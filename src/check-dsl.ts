import { defaultRelationRule, defaultTypeRule } from "./default-regex";
import { Keywords, ReservedKeywords } from "./keywords";
import {
  parseDSL,
  ParserResult,
  RelationDefOperator,
  RelationDefParserResult,
  RelationTargetParserResult,
  RewriteType,
  SchemaVersion,
  TransformedType,
} from "./parse-dsl";
import { report } from "./reporters";
import { assertNever } from "./utils/assert-never";

export interface ValidationRegex {
  rule: string;
  regex: RegExp;
}

export interface ValidationOptions {
  typeValidation?: string;
  relationValidation?: string;
}

const getTypeLineNumber = (typeName: string, lines: string[], skipIndex?: number) => {
  if (!skipIndex) {
    skipIndex = 0;
  }
  return lines.slice(skipIndex).findIndex((line: string) => line.trim().startsWith(`type ${typeName}`)) + skipIndex;
};

const getSchemaLineNumber = (schema: string, lines: string[]) => {
  return lines.findIndex((line: string) => line.trim().replace(/ {2,}/g, " ").startsWith(`schema ${schema}`));
};

// return the line number for the specified relation
const getRelationLineNumber = (relation: string, lines: string[], skipIndex?: number) => {
  if (!skipIndex) {
    skipIndex = 0;
  }
  return (
    lines
      .slice(skipIndex)
      .findIndex((line: string) => line.trim().replace(/ {2,}/g, " ").startsWith(`define ${relation}`)) + skipIndex
  );
};

const defaultError = (lines: string[]) => {
  return {
    // monaco.MarkerSeverity.Error,
    severity: 8,
    startColumn: 0,
    endColumn: Number.MAX_SAFE_INTEGER,
    startLineNumber: 0,
    endLineNumber: lines.length,
    message: "Invalid syntax",
    source: "linter",
  };
};

// helper function to figure out whether the specified allowable types
// are tuple to user set.  If so, return the type and relationship.
// Otherwise, return null as relationship
function destructTupleToUserset(allowableType: string): string[] {
  return allowableType.split("#", 2);
}

// helper function to parse thru a child relation to see if there are unique entry points.
// Entry point describes ways that tuples can be assigned to the relation
// For example,
// type user
// type org
//   relations
//     define member: [user]
// we can assign a user with (type user) to org's member
// However, in the following example
// type doc
//   relations
//     define reader as writer
//     define writer as reader
// It is impossible to have any tuples that assign to doc's reader and writer
function childHasEntryPoint(
  transformedTypes: Record<string, TransformedType>,
  visitedRecords: Record<string, Record<string, boolean>>,
  type: string,
  childDef: RelationTargetParserResult | undefined,
  allowedTypes: string[],
): boolean {
  if (!childDef) {
    return false;
  }
  if (childDef.rewrite === RewriteType.Direct) {
    // we can safely assume that direct rewrite (i.e., it is a self/this), there are direct entry point
    for (const item of allowedTypes) {
      const [decodedType, decodedRelation] = destructTupleToUserset(item);
      if (!decodedRelation) {
        // this is not a tuple set and is a straight type, we can return true right away
        return true;
      }
      // it is only true if it has unique entry point
      if (hasEntryPoint(transformedTypes, visitedRecords, decodedType, decodedRelation)) {
        return true;
      }
    }
  }
  // otherwise, we will need to follow the child
  if (!childDef.from) {
    // this is a simpler case - we only need to check the child type itself
    if (hasEntryPoint(transformedTypes, visitedRecords, type, childDef.target)) {
      return true;
    }
  } else {
    // there is a from.  We need to parse thru all the from's possible type
    // to see if there are unique entry point
    const fromPossibleTypes = transformedTypes[type].relations[childDef.from].allowedTypes;
    for (const fromType of fromPossibleTypes) {
      const [decodedType] = destructTupleToUserset(fromType);

      // For now, we just look at the type without seeing whether the user set
      // of the type is reachable too in the case of tuple to user set.
      // TODO: We may have to investigate whether we need to dive into relation (if present) of the userset
      if (hasEntryPoint(transformedTypes, visitedRecords, decodedType, childDef.target)) {
        return true;
      }
    }
  }
  return false;
}

// for the type/relation, whether there are any unique entry points
// if there are unique entry points (i.e., direct relations) then it will return true
// otherwise, it will follow its children to see if there are unique entry points
function hasEntryPoint(
  transformedTypes: Record<string, TransformedType>,
  visitedRecords: Record<string, Record<string, boolean>>,
  type: string,
  relation: string | undefined,
): boolean {
  if (!relation) {
    // nothing to do if relation is undefined
    return false;
  }
  // check to see if we already visited this relation to avoid infinite loop
  if (visitedRecords[type] && visitedRecords[type][relation]) {
    return false;
  }
  if (!visitedRecords[type]) {
    visitedRecords[type] = {};
  }
  visitedRecords[type][relation] = true;
  const currentRelation = transformedTypes[type].relations[relation];
  if (!currentRelation || !currentRelation.definition) {
    return false;
  }

  // there are two main cases, exclusion and non-exclusion
  if (
    currentRelation.definition.type === RelationDefOperator.Single ||
    currentRelation.definition.type === RelationDefOperator.Union ||
    currentRelation.definition.type === RelationDefOperator.Intersection
  ) {
    // for non-exclusion, check all targets
    for (const childDef of currentRelation.definition.targets || []) {
      if (childHasEntryPoint(transformedTypes, visitedRecords, type, childDef, currentRelation.allowedTypes)) {
        return true;
      }
    }
  } else {
    // this is a exclusion which means there are no targets. Instead, look at base
    if (
      childHasEntryPoint(
        transformedTypes,
        visitedRecords,
        type,
        currentRelation.definition.base,
        currentRelation.allowedTypes,
      )
    ) {
      return true;
    }
  }

  return false;
}

// Return all the allowable types for the specified type/relation
function allowableTypes(
  transformedTypes: Record<string, TransformedType>,
  type: string,
  relation: string,
): [string[], boolean] {
  const allowedTypes: string[] = [];
  const currentRelation = transformedTypes[type].relations[relation];

  const isValid = currentRelation?.definition?.type === RelationDefOperator.Single;
  // for now, we assume that the type/relation must be single and rewrite is direct
  if (isValid) {
    for (const childDef of currentRelation.definition.targets || []) {
      switch (childDef.rewrite) {
        case RewriteType.Direct: {
          allowedTypes.push(...currentRelation.allowedTypes);
        }
      }
    }
  }
  return [allowedTypes, isValid];
}

// helper function to ensure all childDefs are defined
function childDefDefined(
  lines: string[],
  reporter: any,
  transformedTypes: Record<string, TransformedType>,
  type: string,
  relation: string,
  childDef: RelationTargetParserResult,
) {
  const currentRelation = transformedTypes[type].relations[relation];
  switch (childDef.rewrite) {
    case RewriteType.Direct: {
      // for this case, as long as the type / type+relation defined, we should be fine
      const fromPossibleTypes = currentRelation.allowedTypes;
      if (!fromPossibleTypes.length) {
        const typeIndex = getTypeLineNumber(type, lines);
        const lineIndex = getRelationLineNumber(relation, lines, typeIndex);
        reporter.assignableRelationMustHaveTypes({ lineIndex, value: relation });
      }
      for (const item of fromPossibleTypes) {
        const [decodedType, decodedRelation] = destructTupleToUserset(item);
        if (decodedRelation) {
          if (!transformedTypes[decodedType] || !transformedTypes[decodedType].relations[decodedRelation]) {
            // type/relation is not defined
            const typeIndex = getTypeLineNumber(type, lines);
            const lineIndex = getRelationLineNumber(relation, lines, typeIndex);
            reporter.invalidTypeRelation({
              lineIndex,
              value: `${decodedType}#${decodedRelation}`,
              typeName: decodedType,
              relationName: decodedRelation,
            });
          }
        } else if (!transformedTypes[decodedType]) {
          // type is not defined
          const typeIndex = getTypeLineNumber(type, lines);
          const lineIndex = getRelationLineNumber(relation, lines, typeIndex);
          reporter.invalidType({
            lineIndex,
            value: `${decodedType}`,
            typeName: decodedType,
          });
        }
      }
      break;
    }
    case RewriteType.ComputedUserset: {
      if (childDef.target && !transformedTypes[type].relations[childDef.target]) {
        const typeIndex = getTypeLineNumber(type, lines);
        const lineIndex = getRelationLineNumber(relation, lines, typeIndex);
        const value = childDef.target;
        reporter.invalidRelation({
          lineIndex,
          value,
          validRelations: Object.keys(transformedTypes[type].relations),
        });
      }
      break;
    }
    case RewriteType.TupleToUserset: {
      // for this case, we need to consider both the "from" and "relation"
      if (childDef.from && childDef.target) {
        // First, check to see if the childDef.from exists
        if (!transformedTypes[type].relations[childDef.from]) {
          const typeIndex = getTypeLineNumber(type, lines);
          const lineIndex = getRelationLineNumber(relation, lines, typeIndex);
          reporter.invalidTypeRelation({
            lineIndex,
            value: `${childDef.target} from ${childDef.from}`,
            typeName: type,
            relationName: childDef.from,
          });
        } else {
          const [fromTypes, isValid] = allowableTypes(transformedTypes, type, childDef.from);
          if (isValid) {
            for (const item of fromTypes) {
              const [decodedType, decodedRelation] = destructTupleToUserset(item);
              if (decodedRelation) {
                const typeIndex = getTypeLineNumber(type, lines);
                const lineIndex = getRelationLineNumber(relation, lines, typeIndex);
                reporter.tupleUsersetRequiresDirect({
                  lineIndex,
                  value: childDef.from,
                });
              } else {
                if (!transformedTypes[decodedType] || !transformedTypes[decodedType].relations[childDef.target]) {
                  const typeIndex = getTypeLineNumber(type, lines);
                  const lineIndex = getRelationLineNumber(relation, lines, typeIndex);
                  reporter.invalidTypeRelation({
                    lineIndex,
                    value: `${childDef.target} from ${childDef.from}`,
                    typeName: decodedType,
                    relationName: childDef.target,
                  });
                }
              }
            }
          } else {
            // the from is not allowed.  Only direct assignable types are allowed.
            const typeIndex = getTypeLineNumber(type, lines);
            const lineIndex = getRelationLineNumber(relation, lines, typeIndex);
            reporter.tupleUsersetRequiresDirect({
              lineIndex,
              value: childDef.from,
            });
          }
        }
      }
      break;
    }
  }
}

// ensure all the referenced relations are defined
function relationDefined(
  lines: string[],
  reporter: any,
  transformedTypes: Record<string, TransformedType>,
  type: string,
  relation: string,
) {
  const currentRelation = transformedTypes[type].relations[relation];
  if (
    currentRelation.definition.type === RelationDefOperator.Single ||
    currentRelation.definition.type === RelationDefOperator.Union ||
    currentRelation.definition.type === RelationDefOperator.Intersection
  ) {
    // we need to check all the child target to ensure they are defined
    for (const childDef of currentRelation.definition.targets || []) {
      childDefDefined(lines, reporter, transformedTypes, type, relation, childDef);
    }
  } else if (currentRelation.definition.type === RelationDefOperator.Exclusion) {
    if (currentRelation.definition.base) {
      childDefDefined(lines, reporter, transformedTypes, type, relation, currentRelation.definition.base);
    }
    if (currentRelation.definition.diff) {
      childDefDefined(lines, reporter, transformedTypes, type, relation, currentRelation.definition.diff);
    }
  }
}

function mode11Validation(
  lines: string[],
  reporter: any,
  markers: any[],
  parserResults: ParserResult,
  relationsPerType: Record<string, TransformedType>,
) {
  if (markers.length) {
    // no point in looking at directly assignable types if the model itself already
    // has other problems
    return;
  }
  // first, validate to ensure all the relation are defined
  parserResults.types.forEach((typeDef) => {
    const typeName = typeDef.type;

    // parse through each of the relations to do validation
    typeDef.relations.forEach((relationDef) => {
      const { relation: relationName } = relationDef;

      relationDefined(lines, reporter, relationsPerType, typeName, relationName);
    });
  });

  // next, ensure all relation have entry point
  // we can skip if there are errors because errors (such as missing relations) will likely lead to no entries
  if (markers.length === 0) {
    parserResults.types.forEach((typeDef) => {
      const typeName = typeDef.type;

      // parse through each of the relations to do validation
      typeDef.relations.forEach((relationDef) => {
        const { relation: relationName } = relationDef;

        if (!hasEntryPoint(relationsPerType, {}, typeName, relationName)) {
          const typeIndex = getTypeLineNumber(typeName, lines);
          const lineIndex = getRelationLineNumber(relationName, lines, typeIndex);
          reporter.noEntryPoint({
            lineIndex,
            value: relationName,
            typeName,
          });
        }
      });
    });
  }
}

// helper function to populate the relationsPerType and globalRelations list
// will report error if there are duplication relations
function populateRelations(
  lines: string[],
  reporter: any,
  parserResults: ParserResult,
  typeRegex: ValidationRegex,
  relationRegex: ValidationRegex,
): [Record<string, boolean>, Record<string, TransformedType>] {
  const globalRelations: Record<string, boolean> = { [Keywords.SELF]: true };
  const transformedTypes: Record<string, TransformedType> = {};
  // Looking at the types
  parserResults.types.forEach((typeDef) => {
    const typeName = typeDef.type;

    // check to see if the typeName is valid
    if (typeName === Keywords.SELF || typeName === ReservedKeywords.THIS) {
      const lineIndex = getTypeLineNumber(typeName, lines);
      reporter.reservedType({ lineIndex, value: typeName });
    }

    if (!typeRegex.regex.test(typeName)) {
      const lineIndex = getTypeLineNumber(typeName, lines);
      reporter.invalidName({ lineIndex, value: typeName, clause: typeRegex.rule });
    }

    // Include keyword
    const encounteredRelationsInType: Record<string, boolean> = { [Keywords.SELF]: true };
    const relations: Record<string, RelationDefParserResult<RelationDefOperator>> = {};

    typeDef.relations.forEach((relationDef) => {
      const { relation: relationName } = relationDef;
      relations[relationName] = relationDef;

      if (relationName === Keywords.SELF || relationName === ReservedKeywords.THIS) {
        const typeIndex = getTypeLineNumber(typeName, lines);
        const lineIndex = getRelationLineNumber(relationName, lines, typeIndex);
        reporter.reservedRelation({ lineIndex, value: relationName });
      } else if (!relationRegex.regex.test(relationName)) {
        const typeIndex = getTypeLineNumber(typeName, lines);
        const lineIndex = getRelationLineNumber(relationName, lines, typeIndex);
        reporter.invalidName({ lineIndex, value: relationName, clause: relationRegex.rule, typeName });
      } else if (encounteredRelationsInType[relationName]) {
        // Check if we have any duplicate relations
        // figure out what is the lineIdx in question
        const typeIndex = getTypeLineNumber(typeName, lines);
        const initialLineIdx = getRelationLineNumber(relationName, lines, typeIndex);
        const duplicateLineIdx = getRelationLineNumber(relationName, lines, initialLineIdx + 1);
        reporter.duplicateDefinition({ lineIndex: duplicateLineIdx, value: relationName });
      }

      encounteredRelationsInType[relationName] = true;
      globalRelations[relationName] = true;
    });
    transformedTypes[typeName] = {
      comment: "",
      type: typeName,
      relations,
    };
  });
  return [globalRelations, transformedTypes];
}

export const basicValidateRelation = (
  lines: string[],
  reporter: any,
  parserResults: ParserResult,
  globalRelations: Record<string, boolean>,
  relationsPerType: Record<string, TransformedType>,
) => {
  parserResults.types.forEach((typeDef) => {
    const typeName = typeDef.type;

    // parse through each of the relations to do validation
    typeDef.relations.forEach((relationDef) => {
      const { relation: relationName } = relationDef;

      if (relationDef.allowedTypes.length) {
        const typeIndex = getTypeLineNumber(typeName, lines);
        const lineIndex = getRelationLineNumber(relationName, lines, typeIndex);
        reporter.allowedTypeModel10({ lineIndex, value: relationName });
      }

      const validateTargetRelation = (typeName: string, relationName: string, target: any) => {
        if (!target) {
          // no need to continue to parse if there is no target
          return;
        }
        if (relationName === target.target && target.rewrite != RewriteType.TupleToUserset) {
          // the error case will be relation require self reference (i.e., define owner as owner)
          const typeIndex = getTypeLineNumber(typeName, lines);
          const lineIndex = getRelationLineNumber(relationName, lines, typeIndex);
          reporter.useSelf({
            lineIndex,
            value: relationName,
          });
        }
        if (relationName === target.from && relationDef.definition.targets?.length === 1) {
          // define owner as writer from owner
          const typeIndex = getTypeLineNumber(typeName, lines);
          const lineIndex = getRelationLineNumber(relationName, lines, typeIndex);
          reporter.invalidFrom({
            lineIndex,
            value: target.from,
            clause: Keywords.FROM,
          });
        }
        if (target.target && !globalRelations[target.target]) {
          // the target relation is not defined (i.e., define owner as foo) where foo is not defined
          const typeIndex = getTypeLineNumber(typeName, lines);
          const lineIndex = getRelationLineNumber(relationName, lines, typeIndex);
          const value = target.target;
          reporter.invalidRelation({
            lineIndex,
            value,
            validRelations: Object.keys(globalRelations),
          });
        }
        if (target.from && !relationsPerType[typeName].relations[target.from]) {
          // The "from" is not defined for the current type `define owner as member from writer`
          const typeIndex = getTypeLineNumber(typeName, lines);
          const lineIndex = getRelationLineNumber(relationName, lines, typeIndex);
          const value = target.from;
          reporter.invalidRelationWithinClause({
            typeName,
            value: target.from,
            validRelations: relationsPerType,
            clause: value,
            reverse: true,
            lineIndex,
          });
        }
      };

      relationDef.definition.targets?.forEach((target) => {
        validateTargetRelation(typeName, relationName, target);
      });

      // check the but not
      if (relationDef.definition.base) {
        validateTargetRelation(typeName, relationName, relationDef.definition.base);
      }
      if (relationDef.definition.diff) {
        validateTargetRelation(typeName, relationName, relationDef.definition.diff);
      }
    });
  });
};

export const checkDSL = (codeInEditor: string, options: ValidationOptions = {}) => {
  const lines = codeInEditor.split("\n");
  const markers: any = [];
  const reporter = report({ lines, markers });
  const typeValidation = options.typeValidation || defaultTypeRule;
  const relationValidation = options.relationValidation || defaultRelationRule;
  const defaultRegex = new RegExp("[a-zA-Z]*");

  let typeRegex: ValidationRegex = {
    regex: defaultRegex,
    rule: typeValidation,
  };
  try {
    typeRegex = {
      regex: new RegExp(typeValidation),
      rule: typeValidation,
    };
  } catch (e: any) {
    const marker = defaultError(lines);
    marker.message = `Incorrect type regex specification for ${typeValidation}`;
    markers.push(marker);
    return markers;
  }

  let relationRegex: ValidationRegex = {
    regex: defaultRegex,
    rule: relationValidation,
  };
  try {
    relationRegex = {
      regex: new RegExp(relationValidation),
      rule: relationValidation,
    };
  } catch (e: any) {
    const marker = defaultError(lines);
    marker.message = `Incorrect relation regex specification for ${relationValidation}`;
    markers.push(marker);
    return markers;
  }

  try {
    const parserResults = parseDSL(codeInEditor);

    const [globalRelations, transformedTypes] = populateRelations(
      lines,
      reporter,
      parserResults,
      typeRegex,
      relationRegex,
    );

    const schemaVersion = parserResults.schemaVersion || SchemaVersion.OneDotZero;
    switch (schemaVersion) {
      case SchemaVersion.OneDotZero:
        basicValidateRelation(lines, reporter, parserResults, globalRelations, transformedTypes);
        break;
      case SchemaVersion.OneDotOne:
        mode11Validation(lines, reporter, markers, parserResults, transformedTypes);
        break;
      default: {
        const lineIndex = getSchemaLineNumber(schemaVersion, lines);
        reporter.invalidSchemaVersion({ lineIndex, value: schemaVersion });
        break;
      }
    }
  } catch (e: any) {
    if (typeof e.offset !== "undefined") {
      try {
        let line = Number.parseInt(e.message.match(/line\s([0-9]*)\scol\s([0-9]*)/m)[1]);
        const column = Number.parseInt(e.message.match(/line\s([0-9]*)\scol\s([0-9]*)/m)[2]);
        line = line <= lines.length ? line : lines.length;

        const marker = {
          // monaco.MarkerSeverity.Error,
          severity: 8,
          startColumn: column - 1 < 0 ? 0 : column - 1,
          endColumn: lines[line - 1].length,
          startLineNumber: column === 0 ? line - 1 : line,
          endLineNumber: column === 0 ? line - 1 : line,
          message: "Invalid syntax",
          source: "linter",
        };
        markers.push(marker);
      } catch (e: any) {
        markers.push(defaultError(lines));
      }
    } else {
      markers.push(defaultError(lines));
    }
  }

  return markers;
};
