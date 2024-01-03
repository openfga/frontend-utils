import type { ExpandResponse, Node, OpenFgaApi, TupleKey } from "@openfga/sdk";
import { GraphDefinition, GraphEdgeGroup, RelationType, ResolutionTree } from "./graph.typings";

/**
 * Taking a string representation of a user (object or userset), returns the proper object fields
 *
 * @param {string} userString - a string in the form of: `<type>:<id>`, `<type>:<id>#<relation>`, `<type>:*`
 *
 * @typedef {Object} UserComponents
 * @property {string} object - a string in the form of: `<type>:<id>`
 * @property {string} relation - the relation part of a userset
 * @property {boolean} isWildcard
 *
 * @return {UserComponents} - the object and relation components of a user
 */
const getUserComponents = (userString: string): { isWildcard: boolean; object: string; relation?: string } => {
  const objectRelation = userString.split("#");
  const isWildcard = objectRelation[1] === "*" || userString === "*";

  return {
    object: objectRelation[0],
    relation: isWildcard ? undefined : objectRelation[1],
    isWildcard,
  };
};

export class TreeBuilder {
  private currentTree?: ResolutionTree;
  private readonly expandedTuples: Record<string, true> = {};

  constructor(
    private readonly openFgaApi: Pick<OpenFgaApi, "expand">,
    private readonly capturedTuple: Required<Omit<TupleKey, "user">>,
    private readonly existingTree?: ResolutionTree,
    private readonly authorizationModelId?: string,
  ) {
    if (existingTree) {
      this.currentTree = existingTree;
    }
  }

  private addParent(user: string, parent: string, type?: RelationType, inActivePath?: boolean): void {
    if (!this.currentTree) return;
    if (!this.currentTree[user]) {
      this.currentTree[user] = { parents: {} };
    }
    this.currentTree[user].parents[parent] = { inActivePath, type };

    if (parent === `${this.capturedTuple.object}#${this.capturedTuple.relation}`) {
      if (!this.currentTree[this.capturedTuple.object]) {
        this.currentTree[this.capturedTuple.object] = { parents: {}, inActivePath: true };
      }
      this.addParent(
        `${this.capturedTuple.object}#${this.capturedTuple.relation}`,
        this.capturedTuple.object,
        undefined,
        true,
      );
    }
  }

  private async expandTuple(tuple: Pick<TupleKey, "relation" | "object">): Promise<ExpandResponse> {
    return this.openFgaApi.expand({
      tuple_key: {
        relation: tuple.relation,
        object: tuple.object,
      },
      authorization_model_id: this.authorizationModelId,
    });
  }

  private async walkDirectUser(node: Node, user: string): Promise<void> {
    const tupleKey = getUserComponents(user);

    this.addParent(user, node.name!, RelationType.DirectUsers);

    // this is a relation that can be broken down further, e.g. github-org:auth0#member
    if (tupleKey.relation) {
      await this.walk(tupleKey);
    }
  }

  private async walkDirectUsers(node: Node): Promise<void> {
    const users = node?.leaf?.users?.users || [];

    await Promise.all(users.map(async (user) => this.walkDirectUser(node, user)));
  }

  private async walkComputedUserSet(node: Node, computedUserSet: string, viaTupleToUserset?: boolean): Promise<void> {
    if (!computedUserSet || computedUserSet.split(":").length !== 2) {
      return;
    }

    this.addParent(
      computedUserSet,
      node.name!,
      viaTupleToUserset ? RelationType.TupleToUserset : RelationType.ComputedUserset,
    );

    const tupleKey = getUserComponents(computedUserSet);

    await this.walk(tupleKey);
  }

  private async walkTupleToUserset(node: Node): Promise<void> {
    const tupleToUsersetTupleset = node.leaf?.tupleToUserset?.tupleset;

    if (!tupleToUsersetTupleset) {
      return;
    }

    const tupleKey = getUserComponents(tupleToUsersetTupleset);

    // this.addParent(tupleToUsersetTupleset, node.name, RelationType.TupleToUserset);

    await this.walk(tupleKey);
  }

  private getNodeType(node: Node): RelationType | undefined {
    if (node?.leaf?.computed?.userset) {
      return RelationType.ComputedUserset;
    }
    if (node?.leaf?.tupleToUserset?.computed) {
      return RelationType.TupleToUserset;
    }
    if (!node?.union?.nodes?.length) {
      return RelationType.DirectUsers;
    }
  }

  private async walkNode(node: Node): Promise<void> {
    const promises: Promise<any>[] = [];

    const type = this.getNodeType(node);

    switch (type) {
      case RelationType.DirectUsers:
        promises.push(this.walkDirectUsers(node));
        break;
      case RelationType.ComputedUserset:
        const computedUserSet = node.leaf?.computed?.userset;

        promises.push(this.walkComputedUserSet(node, computedUserSet!));
        break;
      case RelationType.TupleToUserset:
        promises.push(this.walkTupleToUserset(node));

        const computedList = node.leaf?.tupleToUserset?.computed || [];

        promises.push(...computedList.map(async (computed) => this.walkComputedUserSet(node, computed.userset!, true)));
        break;
      // Union
      default:
        const childNodes = node.union?.nodes || [];

        promises.push(...childNodes.map(async (childNode) => this.walkNode(childNode)));
    }

    await Promise.all(promises);
  }

  private async walk(currentTuple: Pick<TupleKey, "object"> & Partial<Pick<TupleKey, "relation">>): Promise<void> {
    const currentTupleKey = `${currentTuple.object}#${currentTuple.relation}`;

    if (!currentTuple.relation || this.expandedTuples[currentTupleKey]) {
      return;
    }
    if (this.currentTree && !this.currentTree[currentTupleKey]) {
      this.currentTree[currentTupleKey] = { parents: {} };
    }

    this.expandedTuples[currentTupleKey] = true;
    const data = await this.expandTuple(currentTuple as Pick<TupleKey, "relation" | "object">);
    const rootNode = data.tree?.root;

    await this.walkNode(rootNode!);
  }

  // This is a workaround for the tree generation function generating nodes the have no parents
  // If we find one, clear it - logic while drawing the graph will deal with hiding nodes linked to it
  private deleteHangingNodes(): void {
    const { tree = {} } = this;

    Object.keys(tree).forEach((nodeName) => {
      const { parents } = tree[nodeName];

      if (!Object.keys(parents).length && nodeName !== this.capturedTuple.object) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete tree[nodeName];
      }
    });
  }

  get tree(): ResolutionTree | undefined {
    return this.currentTree;
  }

  async buildTree(): Promise<void> {
    if (this.tree) {
      return;
    }

    this.currentTree = {};
    await this.walk(this.capturedTuple);
  }

  fillActivePath(targetUser: string): ResolutionTree {
    const { tree = {} } = this;
    const { object: targetObject } = this.capturedTuple;

    // Clone the tree
    const fullTreeObject: ResolutionTree = JSON.parse(JSON.stringify(tree));

    let nextPaths = ["*", targetUser];

    const traversedPaths: Record<string, boolean> = {};

    while (nextPaths.length) {
      const nextPathsObject: Record<string, true> = {};

      nextPaths.forEach((nextPath) => {
        if (traversedPaths[nextPath]) {
          return;
        } else {
          traversedPaths[nextPath] = true;
        }
        if (!fullTreeObject[nextPath]) {
          return;
        }

        if (fullTreeObject[nextPath].parents[targetObject]) {
          // if one of the parents is the actual object we are looking for, delete all other parents
          // this prevents looping cases where we find the object and still tru to keep going
          Object.keys(fullTreeObject[nextPath].parents).forEach((parent) => {
            if (parent !== targetObject) {
              delete fullTreeObject[nextPath].parents[parent];
            }
          });
        }

        Object.keys(fullTreeObject[nextPath].parents).forEach((parent) => {
          if (parent === nextPath) {
            return;
          }

          fullTreeObject[nextPath].parents[parent].inActivePath = true;
          nextPathsObject[parent] = true;
        });
      });

      nextPaths = Object.keys(nextPathsObject);
    }

    return fullTreeObject;
  }

  buildGraph(targetUser?: string, onlyInActivePath?: boolean): GraphDefinition {
    const { capturedTuple } = this;
    let { tree = {} } = this;

    const hasUser = !!targetUser;
    const graph: GraphDefinition = {
      nodes: [],
      edges: [],
    };
    let shouldHideNode = false;

    this.deleteHangingNodes();

    if (targetUser) {
      tree = this.fillActivePath(targetUser);
    }

    Object.keys(tree).forEach((nodeKey) => {
      const node = tree[nodeKey];
      const [object, relation] = nodeKey.split("#");
      let hasFoundParentInActivePath: boolean | undefined;

      Object.keys(node.parents).forEach((parentKey) => {
        const parentNode = node.parents[parentKey];

        // If the parent node does not exist in the tree, ignore the whole node
        if (!tree[parentKey]) {
          shouldHideNode = true;

          return;
        }

        if (onlyInActivePath && !parentNode.inActivePath) {
          return;
        }

        hasFoundParentInActivePath = true;

        const type = parentNode.type?.replace(/\s/gu, "");

        if (type) {
          graph.nodes.push({
            id: `${parentKey}.${type}.${nodeKey}`,
            label: parentNode.type as string,
          });

          graph.edges.push({
            to: `${parentKey}.${type}.${nodeKey}`,
            from: parentKey,
            isActive: parentNode.inActivePath,
            group: GraphEdgeGroup.Default,
          });
        }

        graph.edges.push({
          to: nodeKey,
          from: type ? `${parentKey}.${type}.${nodeKey}` : parentKey,
          label: parentKey === capturedTuple.object ? `${relation} from` : "",
          isActive: parentNode.inActivePath,
          group: GraphEdgeGroup.Default,
        });
      });

      const isUserNode = nodeKey === targetUser || (nodeKey === "*" && hasUser);
      const isObjectNode = nodeKey === capturedTuple.object;

      // Only add the node if:
      // 1- It is the main object we are checking for OR
      // 2- It has a parent in the "active" path for the relationship OR
      // 3- We are not drawing only the active oath or force hiding the node
      if (isObjectNode || hasFoundParentInActivePath || !(onlyInActivePath || shouldHideNode)) {
        const isActive = isObjectNode || isUserNode;

        graph.nodes.push({
          id: nodeKey,
          label: object === "*" && hasUser ? `${targetUser} via everyone (*)` : nodeKey,
          isActive,
        });
      }
    });

    return graph;
  }
}
