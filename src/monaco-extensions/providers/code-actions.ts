import type * as MonacoEditor from "monaco-editor";
import type { CancellationToken, editor, languages } from "monaco-editor";

import { Keyword } from "../../constants/keyword";
import { Marker } from "../../validator/reporters";
import { ValidationError } from "../../validator/validation-error";

export const provideCodeActions =
  (monaco: typeof MonacoEditor) =>
  (
    model: editor.ITextModel,
    range: MonacoEditor.Range,
    context: languages.CodeActionContext & { markers: Marker[] },
    token: CancellationToken,
  ): languages.ProviderResult<languages.CodeActionList> => {
    const codeActions: languages.CodeAction[] = [];
    for (const marker of context.markers) {
      const startOffset = model.getOffsetAt({ column: marker.startColumn, lineNumber: marker.startLineNumber });
      const endOffset = model.getOffsetAt({ column: marker.endColumn, lineNumber: marker.endLineNumber });
      const text = model.getValue().substr(startOffset, endOffset - startOffset);

      const markerRange = new monaco.Range(
        marker.startLineNumber,
        marker.startColumn,
        marker.endLineNumber,
        marker.endColumn,
      );

      const extraInformation = marker.extraInformation || {};

      if (extraInformation.error === ValidationError.MissingDefinition) {
        marker.startColumn = 0;
        const selfFix = {
          range: markerRange,
          text: `    define ${extraInformation.relation} as self\n${model.getLineContent(marker.startLineNumber)}`,
        };
        codeActions.push({
          title: `Fix: add definition for \`${extraInformation.relation}\`.`,
          diagnostics: [marker],
          edit: {
            edits: [
              {
                textEdit: selfFix,
                resource: model.uri,
                versionId: undefined,
              },
            ],
          },
          kind: "quickfix",
        });
      }

      if (extraInformation.error === ValidationError.SelfError) {
        const selfFix = {
          range: markerRange,
          text: Keyword.SELF,
        };
        codeActions.push({
          title: `Fix: replace \`${text}\` by \`self\`.`,
          diagnostics: [marker],
          edit: {
            edits: [
              {
                textEdit: selfFix,
                resource: model.uri,
                versionId: undefined,
              },
            ],
          },
          kind: "quickfix",
        });
      }

      if (extraInformation.error === ValidationError.DuplicatedError) {
        (markerRange as any).startLineNumber = markerRange.startLineNumber - 1;
        (markerRange as any).startColumn = model.getLineContent(marker.startLineNumber - 1).length + 1;

        const duplicatedFix = {
          range: markerRange,
          text: "",
        };
        codeActions.push({
          title: `Fix: remove duplicated \`${text}\`.`,
          diagnostics: [marker],
          edit: {
            edits: [
              {
                textEdit: duplicatedFix,
                resource: model.uri,
                versionId: undefined,
              },
            ],
          },
          kind: "quickfix",
        });
      }
    }
    return {
      actions: codeActions,
      dispose() {
        //
      },
    };
  };
