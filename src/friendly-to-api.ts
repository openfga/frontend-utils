import { AuthorizationModel, Userset } from "@openfga/sdk";

import { parseDSL, ParserResult, RelationDefOperator, RelationTargetParserResult, RewriteType } from "./parse-dsl";
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

export const friendlySyntaxToApiSyntax = (
  config: string,
): Required<Pick<AuthorizationModel, "type_definitions" | "schema_version">> => {
  const result: ParserResult = parseDSL(config);

  const typeDefinitions = result.types.map(({ type: typeName, relations: rawRelations }) => {
    const relationsMap: Record<string, Userset> = {};
    const relationsMetadataMap: Record<string, any> = {};
    let metadataAvailable = false;

    rawRelations.forEach((rawRelation) => {
      const { relation: relationName, allowedTypes, definition } = rawRelation;

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
            union: { child: definition.targets!.map((target) => resolveRelation(target)) },
          };
          break;
        case RelationDefOperator.Intersection:
          relationsMap[relationName] = {
            intersection: { child: definition.targets!.map((target) => resolveRelation(target)) },
          };
          break;
        default:
          assertNever(definition.type);
      }

      relationsMetadataMap[relationName] = {
        directly_related_user_types: [],
      };

      allowedTypes?.forEach((allowedType: string) => {
        metadataAvailable = true;
        const [userType, usersetRelation] = allowedType.split("#");
        const toAdd: any = {
          type: userType,
        };
        if (usersetRelation) {
          toAdd["relation"] = usersetRelation;
        }
        relationsMetadataMap[relationName]["directly_related_user_types"].push(toAdd);
      });
    });

    if (metadataAvailable) {
      return { type: typeName, relations: relationsMap, metadata: { relations: relationsMetadataMap } };
    }

    return { type: typeName, relations: relationsMap };
  });

  return { type_definitions: typeDefinitions, schema_version: result.schemaVersion };
};
