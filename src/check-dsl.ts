import { Keywords } from "./keywords";
import { parseDSL, RewriteType } from "./parse-dsl";
import { report } from "./reporters";

// return the line number for the specified relation
const getLineNumber = (relation: string, lines: string[], skipIndex?: number) =>
  lines.findIndex((line: string) =>
    line.trim().replace(/ {2,}/g, " ").startsWith(`define ${relation}`), skipIndex);

export const checkDSL = (codeInEditor: string) => {
  const lines = codeInEditor.split("\n");
  const markers: any = [];
  const reporter = report({ lines, markers });

  try {
    const parserResults = parseDSL(codeInEditor);
    const relationsPerType: Record<string, Record<string, boolean>> = {};
    const globalRelations: Record<string, boolean> = { [Keywords.SELF]: true };

    // Looking at the types
    parserResults.forEach((typeDef) => {
      const typeName = typeDef.type;

      // Include keyword
      const encounteredRelationsInType: Record<string, boolean> = { [Keywords.SELF]: true };

      typeDef.relations.forEach((relationDef) => {
        const { relation: relationName } = relationDef;

        // Check if we have any duplicate relations
        if (encounteredRelationsInType[relationName]) {
          // figure out what is the lineIdx in question
          const initialLineIdx = getLineNumber(relationName, lines);
          const duplicateLineIdx = getLineNumber(relationName, lines, initialLineIdx);
          reporter.duplicateDefinition({ lineIndex: duplicateLineIdx, value: relationName });
        }

        encounteredRelationsInType[relationName] = true;
        globalRelations[relationName] = true;
      });

      relationsPerType[typeName] = encounteredRelationsInType;
    });

    parserResults.forEach((typeDef) => {
      const typeName = typeDef.type;

      // parse through each of the relations to do validation
      typeDef.relations.forEach((relationDef) => {
        const { relation: relationName } = relationDef;
        const validateTargetRelation = (typeName: string, relationName: string, target: any) => {
          if (!target) {
            // no need to continue to parse if there is no target
            return;
          }
          if (relationName === target.target) {
            if (target.rewrite != RewriteType.TupleToUserset) {
              // the error case will be relation require self reference (i.e., define owner as owner)
              const lineIndex = getLineNumber(relationName, lines);
              reporter.useSelf({
                lineIndex,
                value: relationName,
              });
            } else if (relationDef.definition.targets?.length === 1) {
              // define owner as writer from owner
              const lineIndex = getLineNumber(relationName, lines);
              const value = target.rewrite;
              reporter.invalidFrom({
                lineIndex,
                value: target.rewrite,
                clause: value, // FIXME
              });
            }
          }

          if (target.target && !globalRelations[target.target]) {
            // the target relation is not defined (i.e., define owner as foo) where foo is not defined
            const lineIndex = getLineNumber(relationName, lines);
            const value = target.target;
            reporter.invalidRelation({
              lineIndex,
              value,
              validRelations: Object.keys(globalRelations),
            });
          }

          if (target.from && !relationsPerType[typeName][target.from]) {
            // The "from" is not defined for the current type `define owner as member from writer`
            const lineIndex = getLineNumber(relationName, lines);
            const value = target.from;
            reporter.invalidRelationWithinClause({
              typeName,
              value: target.from,
              validRelations: relationsPerType,
              clause: value, // FIXME
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
  } catch (e: any) {
    if (typeof e.offset === "undefined") {
      const line = Number.parseInt(e.message.match(/line\s([0-9]*)\scol\s([0-9]*)/m)[1]);
      const column = Number.parseInt(e.message.match(/line\s([0-9]*)\scol\s([0-9]*)/m)[2]);

      const marker = {
        // monaco.MarkerSeverity.Error,
        severity: 8,
        startColumn: column - 1,
        endColumn: lines[line - 1].length,
        startLineNumber: column === 0 ? line - 1 : line,
        endLineNumber: column === 0 ? line - 1 : line,
        message: "Invalid syntax",
        source: "linter",
      };

      markers.push(marker);
    } else {
      const marker = {
        // monaco.MarkerSeverity.Error,
        severity: 8,
        startColumn: 0,
        endColumn: Number.MAX_SAFE_INTEGER,
        startLineNumber: 0,
        endLineNumber: lines.length,
        message: "Invalid syntax",
        source: "linter",
      };

      markers.push(marker);
    }
  }

  return markers;
};
