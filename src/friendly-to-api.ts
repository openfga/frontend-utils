import { flatMapDeep, flatten, flattenDeep, isEmpty } from "lodash";

import { parseDSL } from "./parse-dsl";
import { Keywords } from "./keywords";
import { TypeDefinition, TypeDefinitions, Userset } from "@openfga/sdk";

const resolveRelation = (relation: string): Userset => {
  let result;

  if (relation === Keywords.SELF) {
    result = { this: {} };
  } else {
    const isFrom = relation.includes(" from ");

    if (isFrom) {
      const data = relation.split(" from ");
      const computed = data[0]?.trim();
      const tupleset = data[1]?.trim();

      result = {
        tupleToUserset: {
          tupleset: {
            object: "",
            relation: tupleset,
          },
          computedUserset: {
            object: "",
            relation: computed,
          },
        },
      };
    } else {
      result = {
        computedUserset: {
          object: "",
          relation: relation.trim(),
        },
      };
    }
  }

  return result;
};

/**
 * Filters out keywords from a list of strings
 * @param relations
 */
const filterKeywords = (relations: string[]) =>
  relations.filter((relation) => ![" ", Keywords.OR, Keywords.AND, Keywords.BUT_NOT, Keywords.FROM].includes(relation));

/**
 * Removes empty values from an array of strings and returns a trimmed list of strings
 * @param list
 */
const filterBlanksAndTrim = (list: string[]) => list.filter((entry) => entry).map((entry) => entry.trim());

export const friendlySyntaxToApiSyntax = (config: string): TypeDefinitions => {
  const typeDefinitions: TypeDefinitions = { type_definitions: [] };
  const allTypeDefinitions: string[][][][] = parseDSL(config);

  allTypeDefinitions.forEach((typeDefinition) => {
    // typeDefinition[0] contains the first line "type xxx"
    const nameOfType = flattenDeep(typeDefinition[0][2]).join("");
    const typeDef: TypeDefinition = { type: nameOfType, relations: {} };

    // typeDefinition[1] contains "relations \n define yyy as zzz"
    if (typeDefinition[1].length == 1) {
      const relationDefinitions: any[] = flatten(typeDefinition[1][0][1]);
      relationDefinitions.forEach((relationDefinition) => {
        const flattenedRelationDefinition: any = flatten(relationDefinition);
        const nameOfRelation = flattenedRelationDefinition[1][0][1].join("")
        const relations: any[] = [];
        let rawRelations: any[] = [...flatten(flattenedRelationDefinition[4])];

        // if (flattenedRelationDefinition[1].length === 2) {
        //   flattenedRelationDefinition[1][0][4] = flattenedRelationDefinition[1][0][4].concat(flatMapDeep(flattenedRelationDefinition[1][1]).join(""));
        //   rawRelations = flattenedRelationDefinition[1][0][4];
        // }
        for (const rawRelation of rawRelations) {
          const flat = flattenDeep(rawRelation);
          const value = flat.join("");
  
          if (isEmpty(flat)) {
            break;
          }
  
          if (typeof value === "string") {
            relations.push(value);
          } else {
            relations.push(...(value as any));
          }
        }
  
        if (relations.length === 1) {
          typeDef.relations[nameOfRelation] = resolveRelation(relations[0]);
        } else {
          const isOr = flattenDeep(relations).join("").includes(` ${Keywords.OR} `);
          const isAnd = flattenDeep(relations).join("").includes(` ${Keywords.AND} `);
          const isButNot = flattenDeep(relations).join("").includes(` ${Keywords.BUT_NOT} `);
          const isFrom = flattenDeep(relations).join("").includes(` ${Keywords.FROM} `);
  
          if (isFrom) {
            typeDef.relations[nameOfRelation] = resolveRelation(flattenDeep(relations).join(""));
          }
  
          if (isOr) {
            const child: Userset[] = [];
            const list = [relations[0], ...relations[1].replace("or ", "").split(/\sor\s/)];
  
            filterKeywords(filterBlanksAndTrim(list)).forEach((relation) => {
              child.push(resolveRelation(relation));
            });
  
            typeDef.relations[nameOfRelation] = {
              union: {
                child,
              },
            };
          }
  
          if (isAnd) {
            const child: Userset[] = [];
            const list = [relations[0], ...relations[1].replace("and ", "").split(/\sand\s/)];
  
            filterKeywords(filterBlanksAndTrim(list)).forEach((relation) => {
              child.push(resolveRelation(relation));
            });
  
            typeDef.relations[nameOfRelation] = {
              intersection: {
                child,
              },
            };
          }
  
          if (isButNot) {
            typeDef.relations[nameOfRelation] = {
              difference: {
                base: {
                  ...resolveRelation(relations[0].trim()),
                },
                subtract: {
                  ...resolveRelation(relations[1].split("but not ")[1].trim()),
                },
              },
            };
          }
        }
      });
    }

    typeDefinitions.type_definitions!.push(typeDef);
  });

  return typeDefinitions;
};
