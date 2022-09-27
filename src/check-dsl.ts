import * as _ from "lodash";

import { Keywords } from "./keywords";
import { parseDSL, RewriteType } from "./parse-dsl";
import { report } from "./reporters";

// return the line number for the specified relation
const getLineNumber = (relation: string, lines: string[]) => {
  return _.findIndex(lines, (l: string) => _.trim(l).startsWith(`define ${relation}`));
};

export const checkDSL = (codeInEditor: string) => {
  const lines = codeInEditor.split("\n");
  const markers: any = [];
  const reporter = report({ lines, markers });

  try {
    const results = parseDSL(codeInEditor);
    const relationsPerType: Record<string, string[]> = {};
    const globalRelations = [Keywords.SELF as string];

    // FIXME: In the case of no relation - error

    // Reading relations per type
    _.forEach(results, (r) => {
      const typeName = r.type;

      // Include keyword
      const relations = [Keywords.SELF as string];

      _.forEach(r.relations, (relation) => {
        if (relations.includes(relation.relation)) {
          // figure out what is the lineIdx in question
          const initialLineIdx = _.findIndex(lines, (l: string) => _.trim(l).startsWith(`define ${relation.relation}`));
          const duplicateLineIdx = _.findIndex(
            lines,
            (l: string) => _.trim(l).startsWith(`define ${relation.relation}`),
            initialLineIdx,
          );
          reporter.duplicateDefinition({ lineIndex: duplicateLineIdx, value: relation.relation });
        }

        relations.push(relation.relation);
        globalRelations.push(relation.relation);
      });

      relationsPerType[typeName] = relations;
    });

    _.forEach(results, (r) => {
      const typeName = r.type;
      // parse through each of the relations to do validation
      _.forEach(r.relations, (relation) => {
        const relationName = relation.relation as string;
        const validateTargetRelation = (typeName: string, relationName: string, target: any) => {
          if (!target) {
            // no need to continue to parse if there is no target
            return;
          }
          if (relationName === target.target) {
            if (target.rewrite != RewriteType.TupleToUserset) {
              // the error case will be relation require self reference (i.e., define owner as owner)
              const lineIndex = getLineNumber(relation.relation, lines);
              reporter.useSelf({
                lineIndex,
                value: relationName,
              });
            } else if (relation.definition.targets.length < 2) {
              // define owner as writer from owner
              const lineIndex = getLineNumber(relation.relation, lines);
              const value = target.rewrite;
              reporter.invalidFrom({
                lineIndex,
                value: target.rewrite,
                clause: value, // FIXME
              });
            }
          }

          if (target.target && !globalRelations.includes(target.target)) {
            // the target relation is not defined (i.e., define owner as foo) where foo is not defined
            const lineIndex = getLineNumber(relation.relation, lines);
            const value = target.target;
            reporter.invalidRelation({
              lineIndex,
              value,
              validRelations: globalRelations,
            });
          }

          if (target.from && !relationsPerType[typeName].includes(target.from)) {
            // The "from" is not defined for the current type `define owner as member from writer`
            const lineIndex = getLineNumber(relation.relation, lines);
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

        _.forEach(relation.definition.targets, (target) => {
          validateTargetRelation(typeName, relationName, target);
        });

        // check the but not
        if (relation.definition.base) {
          validateTargetRelation(typeName, relationName, relation.definition.base);
        }
        if (relation.definition.diff) {
          validateTargetRelation(typeName, relationName, relation.definition.diff);
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
