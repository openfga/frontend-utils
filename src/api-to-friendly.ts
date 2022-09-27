import { TypeDefinition, TypeDefinitions, Userset } from "@openfga/sdk";
import { Keywords } from "./keywords";

const readFrom = (obj: Userset, define: string[]) => {
  const childKeys = Object.keys(obj);

  childKeys.forEach((childKey: string) => {
    if (childKey === "this") {
      define.push(Keywords.SELF);
    }

    if (childKey === "tupleToUserset") {
      define.push(`${obj[childKey]!.computedUserset!.relation} ${Keywords.FROM} ${obj[childKey]!.tupleset!.relation}`);
    }

    if (childKey === "computedUserset") {
      define.push(`${obj[childKey]!.relation}`);
    }
  });
};

const apiToFriendlyRelation = (
  relation: string,
  relationDefinition: Userset,
  relations: string[],
  idx: number,
  newSyntax: string[],
) => {
  const relationKeys = Object.keys(relationDefinition);
  const define = [`    ${Keywords.DEFINE} ${relation}${relationKeys?.length ? ` ${Keywords.AS} ` : ""}`];

  // Read simple definitions
  readFrom(relationDefinition, define);

  relationKeys.forEach((relationKey) => {
    if (relationKey === "union") {
      const children = relationDefinition[relationKey]!.child!;
      children.forEach((child: Userset, idx: number) => {
        readFrom(child, define);

        if (idx < children.length - 1) {
          define.push(` ${Keywords.OR} `);
        }
      });
    }

    if (relationKey === "intersection") {
      const children = relationDefinition[relationKey]!.child!;
      children.forEach((child, idx: number) => {
        readFrom(child, define);

        if (idx < children.length - 1) {
          define.push(` ${Keywords.AND} `);
        }
      });
    }

    if (relationKey === "difference") {
      const { base, subtract } = relationDefinition[relationKey]!;

      readFrom(base!, define);
      define.push(` ${Keywords.BUT_NOT} `);
      readFrom(subtract!, define);
    }
  });

  // if (relations.length === idx + 1) {
  //   define.push("\n");
  // }

  newSyntax.push(define.join(""));
};

const apiToFriendlyType = (typeDef: TypeDefinition | TypeDefinition["relations"], newSyntax: string[]) => {
  if (typeDef.relations) {
    // A full type definition was passed
    newSyntax.push(`${Keywords.NAMESPACE} ${typeDef.type}`);
    if (Object.keys(typeDef.relations).length) {
      newSyntax.push(`  ${Keywords.RELATIONS}`);

      const relations = Object.keys(typeDef.relations);

      relations.forEach((relation: any, idx: number) => {
        const relationDefinition = (typeDef as TypeDefinition).relations[relation];
        apiToFriendlyRelation(relation, relationDefinition, relations, idx, newSyntax);
      });
    }
  } else {
    // A subset of the type definition with only the relations object was passed
    const relations = Object.keys(typeDef as TypeDefinition["relations"]);
    if (!relations.length) {
      return;
    }
    const relation = relations[0];
    const userSet = (typeDef as TypeDefinition["relations"])[relation];
    apiToFriendlyRelation(relation, userSet, relations, 0, newSyntax);
  }
};

export const apiSyntaxToFriendlySyntax = (
  config: TypeDefinitions | TypeDefinition,
  newSyntax: string[] = [],
): string => {
  const typeDefs = (config as TypeDefinitions)?.type_definitions;
  if (typeDefs) {
    typeDefs.forEach((typeDef) => {
      apiSyntaxToFriendlySyntax(typeDef, newSyntax);
    });
  } else if (config) {
    apiToFriendlyType(config as TypeDefinition, newSyntax);
  }

  return newSyntax.join("\n") + "\n";
};
