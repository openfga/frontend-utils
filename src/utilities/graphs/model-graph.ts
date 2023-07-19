import { AuthorizationModel, ObjectRelation, TypeDefinition, Userset } from "@openfga/sdk";
import { GraphDefinition, GraphEdgeGroup, GraphNodeGroup } from "./graph.typings";

export class AuthorizationModelGraphBuilder {
  private _graph: GraphDefinition = { nodes: [], edges: [] };

  constructor(
    private authorizationModel: AuthorizationModel,
    private store?: { name?: string },
  ) {
    this.buildGraph();
  }

  private buildGraph() {
    const storeName = this.store?.name || "Store";
    const rootId = `store|${storeName}`;
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
  private addRelationToRelationEdge(
    typeGraph: GraphDefinition,
    typeId: string,
    fromRelationKey: string,
    toRelation: ObjectRelation,
  ): void {
    typeGraph.edges.push({
      from: `${typeId}.relation|${fromRelationKey}`,
      to: `${typeId}.relation|${toRelation.relation}`,
      group: GraphEdgeGroup.RelationToRelation,
    });
  }

  private getTypeGraph(typeDef: TypeDefinition, authorizationModelGraph: GraphDefinition): GraphDefinition {
    const typeId = `type|${typeDef.type}`;
    const typeGraph: GraphDefinition = {
      nodes: [{ id: typeId, label: typeDef.type, group: GraphNodeGroup.Type }],
      edges: [{ from: authorizationModelGraph.nodes[0].id, to: typeId, group: GraphEdgeGroup.StoreToType }],
    };

    const relationDefs = typeDef?.relations || {};

    Object.keys(relationDefs).forEach((relationKey: string) => {
      const relationId = `${typeId}.relation|${relationKey}`;

      const relationDef = relationDefs[relationKey] || {};
      const hasSelf = this.checkIfRelationAssignable(relationDef);

      // If a relation definition does not have self, then we call it a `permission`, e.g. not directly assignable
      typeGraph.nodes.push({
        id: relationId,
        label: relationKey,
        group: hasSelf ? GraphNodeGroup.AssignableRelation : GraphNodeGroup.NonassignableRelation,
      });

      // TODO: Support - 1. AND, 2. BUT NOT, 3. Nested relations
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
