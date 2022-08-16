import * as _ from "lodash";

import { Keywords } from "./keywords";
import { parseDSL } from "./parse-dsl";
import { report } from "./reporters";

const readTypeData = (r: any, lines: any) => {
  const typeName = _.trim(_.flattenDeep(r[0][2]).join(""));
  const typeDefinition = _.flattenDeep([r[0][1], r[0][2]]).join("");
  const typeDefinitionLine = _.findIndex(lines, (l: string) => _.trim(l) === typeDefinition) + 1;
  return { typeName, typeDefinition, typeDefinitionLine };
};

export const checkDSL = (codeInEditor: string) => {
  const lines = codeInEditor.split("\n");
  const markers: any = [];
  const reporter = report({ lines, markers });

  try {
    const results = parseDSL(codeInEditor);
    const relationsPerType: Record<string, string[]> = {};
    const globalRelations = [Keywords.SELF as string];

    // Reading relations per type
    _.forEach(results, (r) => {
      const { typeName, typeDefinitionLine } = readTypeData(r, lines);

      // Include keyword
      const relations = [Keywords.SELF as string];

      _.forEach(r[2], (r2, idx: number) => {
        const relation = _.trim(_.flattenDeep(r2).join("")).match(/define\s+(.*)\s+as\s/)?.[1];
        if (!relation) {
          return;
        }
        const lineIdx = typeDefinitionLine + idx + 1;

        if (relations.includes(relation)) {
          reporter.duplicateDefinition({ lineIndex: lineIdx, value: relation });
        }

        relations.push(relation);
        globalRelations.push(relation);
      });

      relationsPerType[typeName] = relations;
    });

    _.forEach(results, (r) => {
      const { typeName, typeDefinitionLine } = readTypeData(r, lines);

      _.forEach(r[2], (r2, idx: number) => {
        const lineIndex = typeDefinitionLine + idx + 1;
        let definition: any[] = _.flatten(r2[0][1]);

        if (!definition[0].includes(Keywords.DEFINE)) {
          definition = _.flatten(definition);
        }

        const definitionName = _.flattenDeep(definition[2]).join("");

        if (definition[0].includes(Keywords.DEFINE)) {
          const clauses = _.slice(definition, 7, definition.length);

          _.forEach(clauses, (clause) => {
            let value = _.trim(_.flattenDeep(clause).join(""));

            if (value.indexOf(Keywords.OR) === 0) {
              value = value.replace(`${Keywords.OR} `, "");
            }

            if (value.indexOf(Keywords.AND) === 0) {
              value = value.replace(`${Keywords.AND} `, "");
            }

            const hasFrom = value.includes(Keywords.FROM);
            const hasButNot = value.includes(Keywords.BUT_NOT);

            if (hasButNot) {
              const butNotValue = _.trim(_.last(value.split(Keywords.BUT_NOT)));

              if (definitionName === butNotValue) {
                reporter.invalidButNot({
                  lineIndex,
                  value: butNotValue,
                  clause: value,
                });
              } else {
                reporter.invalidRelationWithinClause({
                  typeName,
                  value: butNotValue,
                  validRelations: relationsPerType,
                  clause: value,
                  reverse: true,
                  lineIndex,
                });
              }
            } else if (hasFrom) {
              // Checking: `define share as owner from parent`
              const values = value.split(Keywords.FROM).map((v) => _.trim(v));

              reporter.invalidRelationWithinClause({
                typeName,
                reverse: false,
                value: values[0],
                validRelations: globalRelations,
                clause: value,
                lineIndex,
              });

              if (definitionName === values[1]) {
                // Checking: `define owner as writer from owner`
                if (clauses.length < 2) {
                  reporter.invalidFrom({
                    lineIndex,
                    value: values[1],
                    clause: value,
                  });
                }
              } else {
                reporter.invalidRelationWithinClause({
                  typeName,
                  value: values[1],
                  validRelations: relationsPerType,
                  clause: value,
                  reverse: true,
                  lineIndex,
                });
              }
            } else if (definitionName === value) {
              // Checking: `define owner as owner`
              reporter.useSelf({
                lineIndex,
                value,
              });
            } else {
              // Checking: `define owner as self`
              reporter.invalidRelation({
                lineIndex,
                value,
                validRelations: globalRelations,
              });
            }
          });
        }
      });
    });
  } catch (e: any) {
    if (!_.isUndefined(e.offset)) {
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
