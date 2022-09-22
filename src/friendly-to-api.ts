import { AuthorizationModel, Userset } from "@openfga/sdk";

import {
  parseDSL,
  RelationDefOperator,
  RelationTargetParserResult,
  RewriteType,
  TypeDefParserResult
} from "./parse-dsl";
import { assertNever } from "./utils/assert-never";

const resolveRelation = (relation: RelationTargetParserResult): Userset => {
  switch (relation.rewrite) {
  case RewriteType.Direct:
    return { this: {} };
  case RewriteType.ComputedUserset:
    return {
      computedUserset: {
        object: "",
        relation: relation.target,
      },
    };
  case RewriteType.TupleToUserset:
    return {
      tupleToUserset: {
        tupleset: {
          object: "",
          relation: relation.from,
        },
        computedUserset: {
          object: "",
          relation: relation.target,
        },
      },
    };
  default:
    assertNever(relation.rewrite);
  }
};

export const friendlySyntaxToApiSyntax = (config: string): Required<Pick<AuthorizationModel, "type_definitions">> => {
  const result: TypeDefParserResult[] = parseDSL(config);

  const typeDefinitions = result.map(({ type: typeName, relations: rawRelations }) => {
    const relationsMap: Record<string, Userset> = {};

    rawRelations.forEach(rawRelation => {
      const { relation: relationName, definition } = rawRelation;

      switch (definition.type) {
      case RelationDefOperator.Single:
        relationsMap[relationName] = resolveRelation(definition.targets![0]);
        break;
      case RelationDefOperator.Exclusion:
        relationsMap[relationName] = {
          difference: {
            base: {
              ...resolveRelation(definition.base!),
            },
            subtract: {
              ...resolveRelation(definition.diff!),
            },
          },
        };
        break;
      case RelationDefOperator.Union:
        relationsMap[relationName] = {
          union: { child: definition.targets!.map(target => resolveRelation(target)) },
        };
        break;
      case RelationDefOperator.Intersection:
        relationsMap[relationName] = {
          intersection: { child: definition.targets!.map(target => resolveRelation(target)) },
        };
        break;
      default:
        assertNever(definition.type);
      }
    });

    return { type: typeName, relations: relationsMap };
  });

  return { type_definitions: typeDefinitions };
};
