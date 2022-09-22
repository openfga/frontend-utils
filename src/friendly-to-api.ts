import { flatten, flattenDeep, get } from "lodash";

import { parseDSL } from "./parse-dsl";
import { Keywords, ReservedKeywords } from "./keywords";
import { TypeDefinition, TypeDefinitions, Userset } from "@openfga/sdk";

const resolveRelation = (relation: string): Userset => {
  let result;

  if (relation === Keywords.SELF) {
    result = { this: {} };
  } else {
    const isFrom = relation.includes(` ${Keywords.FROM}`);

    if (isFrom) {
      const data = relation.split(` ${Keywords.FROM}`);
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
  relations.filter((relation) => ![" ", Keywords.OR, Keywords.AND, Keywords.BUT_NOT, Keywords.FROM, ReservedKeywords.THIS].includes(relation));

/**
 * Removes empty values from an array of strings and returns a trimmed list of strings
 * @param list
 */
const filterBlanksAndTrim = (list: string[]) => list.filter((entry) => entry).map((entry) => entry.trim());

export const friendlySyntaxToApiSyntax = (config: string): TypeDefinitions => {
  const typeDefinitions: TypeDefinitions = { type_definitions: [] };
  const rawResult: string[][][][] = parseDSL(config);

  // rawResult[0] is just new lines
  const result = get(rawResult, "0.1") || [];

  result.forEach((r: any) => {
    const typeName = flattenDeep(get(r, "0.2")).join("").trim();
    const typeDef: TypeDefinition = { type: typeName, relations: {} };
    const rawRelations: any[] = flatten(get(r, "1.0.1"));

    console.log("typeDef", typeDef);

    rawRelations.forEach((def) => {
      const flattened: any = flatten(get(def, "3"));
      const relationName = flatten(get(def, "1.1.0.1")).join("");

      console.log("relationName", relationName);

      const relationDefinition = [flattenDeep(flattened[0]).join("").trim()]
        .concat(flattened[1]?.map((flat: any) =>
          flattenDeep(flat).join("").trim())).filter(rel => rel);

      console.log("relationDefinition", relationDefinition);

      if (relationDefinition.length === 1) {
        typeDef.relations[relationName] = resolveRelation(relationDefinition[0]);
      } else if (relationDefinition.length) {
        const relationDefinitionString = relationDefinition.join(" ");
        const isOr = relationDefinitionString.includes(` ${Keywords.OR} `);
        const isAnd = relationDefinitionString.includes(` ${Keywords.AND} `);
        const isButNot = relationDefinitionString.includes(` ${Keywords.BUT_NOT} `);
        const isFrom = relationDefinitionString.includes(` ${Keywords.FROM} `);

        console.log(relationDefinition, isOr, isAnd, isButNot, isFrom);

        if (isFrom) {
          typeDef.relations[relationName] = resolveRelation(relationDefinitionString);
        }

        if (isOr) {
          const child: Userset[] = [];
          const list = [relationDefinition[0],
            ...relationDefinition.slice(1).map(partialRelDef =>
              partialRelDef.replace(`${Keywords.OR} `, ""))];

          filterKeywords(filterBlanksAndTrim(list)).forEach((relation) => {
            child.push(resolveRelation(relation));
          });

          typeDef.relations[relationName] = {
            union: {
              child,
            },
          };
        }

        if (isAnd) {
          const child: Userset[] = [];
          const list = [relationDefinition[0],
            ...relationDefinition.slice(1).map(partialRelDef =>
              partialRelDef.replace(`${Keywords.AND} `, ""))];

          filterKeywords(filterBlanksAndTrim(list)).forEach((relation) => {
            child.push(resolveRelation(relation));
          });

          typeDef.relations[relationName] = {
            intersection: {
              child,
            },
          };
        }

        if (isButNot) {
          typeDef.relations[relationName] = {
            difference: {
              base: {
                ...resolveRelation(relationDefinition[0].trim()),
              },
              subtract: {
                ...resolveRelation(relationDefinition[1].split(`${Keywords.BUT_NOT} `)[1].trim()),
              },
            },
          };
        }
      }
    });

    typeDefinitions.type_definitions!.push(typeDef);
  });

  return typeDefinitions;
};
