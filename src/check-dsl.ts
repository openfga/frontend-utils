import { Keywords, ReservedKeywords } from "./keywords";
import { parseDSL, ParserResult, RewriteType } from "./parse-dsl";
import { report } from "./reporters";

const getTypeLineNumber = (typeName: string, lines: string[], skipIndex?: number) => {
  if (!skipIndex) {
    skipIndex = 0;
  }
  return lines.slice(skipIndex).findIndex((line: string) => line.trim().startsWith(`type ${typeName}`)) + skipIndex;
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

// helper function to populate the relationsPerType and globalRelations list
// will throw error if there are duplication relations
const populateRelation = (
  lines: string[],
  reporter: any,
  parserResults: ParserResult,
  relationsPerType: Record<string, Record<string, boolean>>,
  globalRelations: Record<string, boolean>,
) => {
  // Looking at the types
  parserResults.types.forEach((typeDef) => {
    const typeName = typeDef.type;

    // check to see if the typeName is valid
    if (typeName === Keywords.SELF || typeName === ReservedKeywords.THIS) {
      const lineIndex = getTypeLineNumber(typeName, lines);
      reporter.reservedType({ lineIndex, value: typeName });
    }

    // Include keyword
    const encounteredRelationsInType: Record<string, boolean> = { [Keywords.SELF]: true };

    typeDef.relations.forEach((relationDef) => {
      const { relation: relationName } = relationDef;

      if (relationName === Keywords.SELF || relationName === ReservedKeywords.THIS) {
        const lineIndex = getRelationLineNumber(relationName, lines);
        reporter.reservedRelation({ lineIndex, value: relationName });
      } else if (encounteredRelationsInType[relationName]) {
        // Check if we have any duplicate relations
        // figure out what is the lineIdx in question
        const initialLineIdx = getRelationLineNumber(relationName, lines);
        const duplicateLineIdx = getRelationLineNumber(relationName, lines, initialLineIdx + 1);
        reporter.duplicateDefinition({ lineIndex: duplicateLineIdx, value: relationName });
      }

      encounteredRelationsInType[relationName] = true;
      globalRelations[relationName] = true;
    });

    relationsPerType[typeName] = encounteredRelationsInType;
  });
};

export const basicValidateRelation = (
  lines: string[],
  reporter: any,
  parserResults: ParserResult,
  relationsPerType: Record<string, Record<string, boolean>>,
  globalRelations: Record<string, boolean>,
) => {
  parserResults.types.forEach((typeDef) => {
    const typeName = typeDef.type;

    // parse through each of the relations to do validation
    typeDef.relations.forEach((relationDef) => {
      const { relation: relationName } = relationDef;
      const validateTargetRelation = (typeName: string, relationName: string, target: any) => {
        if (!target) {
          // no need to continue to parse if there is no target
          return;
        }
        if (relationName === target.target && target.rewrite != RewriteType.TupleToUserset) {
          // the error case will be relation require self reference (i.e., define owner as owner)
          const lineIndex = getRelationLineNumber(relationName, lines);
          reporter.useSelf({
            lineIndex,
            value: relationName,
          });
        }
        if (relationName === target.from && relationDef.definition.targets?.length === 1) {
          // define owner as writer from owner
          const lineIndex = getRelationLineNumber(relationName, lines);
          reporter.invalidFrom({
            lineIndex,
            value: target.from,
            clause: Keywords.FROM,
          });
        }

        if (target.target && !globalRelations[target.target]) {
          // the target relation is not defined (i.e., define owner as foo) where foo is not defined
          const lineIndex = getRelationLineNumber(relationName, lines);
          const value = target.target;
          reporter.invalidRelation({
            lineIndex,
            value,
            validRelations: Object.keys(globalRelations),
          });
        }

        if (target.from && !relationsPerType[typeName][target.from]) {
          // The "from" is not defined for the current type `define owner as member from writer`
          const lineIndex = getRelationLineNumber(relationName, lines);
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

export const checkDSL = (codeInEditor: string) => {
  const lines = codeInEditor.split("\n");
  const markers: any = [];
  const reporter = report({ lines, markers });

  try {
    const parserResults = parseDSL(codeInEditor);
    const relationsPerType: Record<string, Record<string, boolean>> = {};
    const globalRelations: Record<string, boolean> = { [Keywords.SELF]: true };

    populateRelation(lines, reporter, parserResults, relationsPerType, globalRelations);
    basicValidateRelation(lines, reporter, parserResults, relationsPerType, globalRelations);
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
