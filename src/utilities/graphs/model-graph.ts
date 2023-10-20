import { AuthorizationModel, ObjectRelation, RelationMetadata, TypeDefinition, Userset } from "@openfga/sdk";
import { GraphDefinition, GraphEdgeGroup, GraphNodeGroup } from "./graph.typings";

export type TypeGraphOpts = { showAssignable?: boolean };

export class AuthorizationModelGraphBuilder {
  private _graph: GraphDefinition = { nodes: [], edges: [] };

  constructor(
    private authorizationModel: AuthorizationModel,
    private store?: { name?: string, id?: string },
  ) {
    this.buildGraph();
  }

  private static getStoreId(storeName: string) {
    return `store|${storeName}`;
  }

  private static getTypeId(typeId: string) {
    return `type|${typeId}`;
  }

  private static getRelationId(typeId: string, relationKey: string) {
    return `${typeId}.relation|${relationKey}`;
  }

  private buildGraph() {
    const storeName = this.store?.name || this.store?.id || "Store";
    const rootId = AuthorizationModelGraphBuilder.getStoreId(storeName);
    const authorizationModelGraph: GraphDefinition = {
      nodes: [{ id: rootId, label: storeName, group: GraphNodeGroup.StoreName }],
      edges: [],
    };

    this.authorizationModel.type_definitions?.forEach((typeDef) => {
      const graph = this.getTypeGraph(typeDef, authorizationModelGraph);
      authorizationModelGraph.nodes = authorizationModelGraph.nodes.concat(graph.nodes);
      authorizationModelGraph.edges = authorizationModelGraph.edges.concat(graph.edges);
    });

    this._graph = authorizationModelGraph;
  }

  // A relation definition has self if `this` is in the relation definition
  private checkIfRelationAssignable(relationDef: Userset): boolean {
    return !!(
      relationDef.this ||
      relationDef.difference?.base.this ||
      relationDef.difference?.subtract.this ||
      (relationDef.intersection?.child || []).some((child) => this.checkIfRelationAssignable(child)) ||
      (relationDef.union?.child || []).some((child) => this.checkIfRelationAssignable(child))
    );
  }

  // Get the sources that can be assignable to a relation
  private getAssignableSourcesForRelation(relationDef: Userset, relationMetadata: RelationMetadata): {
    types: string[], relations: string[], conditions: string[], publicTypes: string[], isAssignable: boolean,
  } {
    const assignableSources: {
      types: string[], relations: string[], conditions: string[], publicTypes: string[], isAssignable: boolean,
    } = { types: [], relations: [], conditions: [], publicTypes: [], isAssignable: false };

    // If this is not used anywhere, then it's not assignable
    if (!this.checkIfRelationAssignable(relationDef)) {
      return assignableSources;
    }

    const assignable = relationMetadata.directly_related_user_types;
    assignable?.forEach(relationRef => {
      // TODO: wildcard and conditions
      if (!(relationRef.relation || relationRef.wildcard || (relationRef as any).condition)) {
        return;
      }

      // TODO: Mark relations as assignable once supported
      if (relationRef.relation) {
        assignableSources.relations.push(
          AuthorizationModelGraphBuilder.getRelationId(relationRef.type, relationRef.relation,
        ));
        return;
      }

      assignableSources.isAssignable = true;
      assignableSources.types.push(AuthorizationModelGraphBuilder.getTypeId(relationRef.type));
    });

    return assignableSources;
  }

  private addRelationToRelationEdge(
    typeGraph: GraphDefinition,
    typeId: string,
    fromRelationKey: string,
    toRelation: ObjectRelation,
  ): void {
    typeGraph.edges.push({
      from: AuthorizationModelGraphBuilder.getRelationId(typeId, fromRelationKey),
      to: AuthorizationModelGraphBuilder.getRelationId(typeId, toRelation.relation!),
      group: GraphEdgeGroup.RelationToRelation,
      dashes: true,
    });
  }

  private getTypeGraph(
    typeDef: TypeDefinition, authorizationModelGraph: GraphDefinition, { showAssignable }: TypeGraphOpts = {},
  ): GraphDefinition {
    const typeId = AuthorizationModelGraphBuilder.getTypeId(typeDef.type);
    const typeGraph: GraphDefinition = {
      nodes: [{ id: typeId, label: typeDef.type, group: GraphNodeGroup.Type }],
      edges: [{ from: authorizationModelGraph.nodes[0].id, to: typeId, group: GraphEdgeGroup.StoreToType }],
    };

    const relationDefs = typeDef?.relations || {};

    Object.keys(relationDefs).forEach((relationKey: string) => {
      const relationId = AuthorizationModelGraphBuilder.getRelationId(typeId, relationKey);

      const relationDef = relationDefs[relationKey] || {};
      const assignableSources = this.getAssignableSourcesForRelation(
        relationDef,
        typeDef.metadata?.relations?.[relationKey] || {},
      );
      const isAssignable = assignableSources.isAssignable;

      // If a relation definition does not have this, then we call it a `permission`, e.g. not directly assignable
      typeGraph.nodes.push({
        id: relationId,
        label: relationKey,
        group: isAssignable ? GraphNodeGroup.AssignableRelation : GraphNodeGroup.NonassignableRelation,
      });

      if (showAssignable) {
        // TODO: Support assignable relations and wildcards, and conditionals
        assignableSources.types.forEach((assignableSource) => {
          typeGraph.edges.push({
            from: AuthorizationModelGraphBuilder.getTypeId(assignableSource),
            to: relationId,
            group: GraphEdgeGroup.AssignableSourceToRelation,
          });
        });
      }

      // TODO: Support - 1. AND, 2. BUT NOT, 3. Nested relations, 4. Tuple to Userset
      typeGraph.edges.push({ from: typeId, to: relationId, group: GraphEdgeGroup.TypeToRelation });
      if (relationDef.computedUserset) {
        this.addRelationToRelationEdge(typeGraph, typeId, relationKey, relationDef.computedUserset);
      } else {
        (relationDef.union?.child || []).forEach((child) => {
          if (child.computedUserset) {
            this.addRelationToRelationEdge(typeGraph, typeId, relationKey, child.computedUserset);
          }
        });
      }
    });

    return typeGraph;
  }

  get graph(): GraphDefinition {
    return this._graph;
  }
}
