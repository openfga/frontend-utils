import type * as MonacoEditor from "monaco-editor";
import type { CancellationToken, editor, languages } from "monaco-editor";

import { Keyword } from "../../../constants/keyword";
import { Marker } from "../../../validator/reporters";
import { ValidationError } from "../../../validator/validation-error";
import { SchemaVersion } from "../../../constants/schema-version";
import { SINGLE_INDENTATION } from "../../../formatter/indent-dsl";

interface CodeActionInput {
  markerRange: MonacoEditor.Range;
  model: editor.ITextModel;
  marker: editor.IMarkerData & Marker;
  text: string;
  schemaVersion: SchemaVersion;
}

interface CodeActionResult {
  title: string;
  text: string;
  startColumn?: number;
  startLineNumber?: number;
}

const errorFixesByErrorCodeAndSchema: Partial<
  Record<
    ValidationError,
    Record<
      SchemaVersion,
      (markerData: { relation?: string } & Omit<CodeActionInput, "schemaVersion">) => CodeActionResult
    >
  >
> = {
  [ValidationError.MissingDefinition]: {
    [SchemaVersion.OneDotZero]: ({ model, marker, relation }) => {
      const lineContent = model.getLineContent(marker.startLineNumber);
      return {
        startColumn: 0,
        title: `Fix: add definition for \`${relation}\`.`,
        text: `${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE} ${relation} ${Keyword.AS} ${Keyword.SELF}\n${lineContent}`,
      };
    },
    [SchemaVersion.OneDotOne]: ({ model, marker, relation }) => {
      const lineContent = model.getLineContent(marker.startLineNumber);
      return {
        startColumn: 0,
        title: `Fix: add definition for \`${relation}\`.`,
        text: `${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE} ${relation}: [typeName]\n${lineContent}`,
      };
    },
  },
  [ValidationError.SelfError]: {
    [SchemaVersion.OneDotZero]: ({ text }) => ({
      title: `Fix: replace \`${text}\` by \`self\`.`,
      text: Keyword.SELF,
    }),
    [SchemaVersion.OneDotOne]: ({ text }) => ({
      title: `Fix: replace \`${text}\` with type restrictions.`,
      text: "[typeName]",
    }),
  },
  [ValidationError.DuplicatedError]: {
    [SchemaVersion.OneDotZero]: ({ model, marker, markerRange, text }) => ({
      startLineNumber: markerRange.startLineNumber - 1,
      startColumn: model.getLineContent(marker.startLineNumber - 1).length + 1,
      title: `Fix: remove duplicated \`${text}\`.`,
      text: "",
    }),
    [SchemaVersion.OneDotOne]: ({ model, marker, markerRange, text }) => ({
      startLineNumber: markerRange.startLineNumber - 1,
      startColumn: model.getLineContent(marker.startLineNumber - 1).length + 1,
      title: `Fix: remove duplicated \`${text}\`.`,
      text: "",
    }),
  },
};

function getCodeActionForError({ markerRange, model, marker, text, schemaVersion }: CodeActionInput) {
  const { error, relation } = marker.extraInformation || {};
  const fixContent = errorFixesByErrorCodeAndSchema[error as ValidationError]?.[schemaVersion]?.({
    model,
    marker,
    markerRange,
    text,
    relation,
  });

  if (!fixContent) {
    return;
  }
  return {
    title: fixContent?.title,
    diagnostics: [marker],
    edit: {
      edits: [
        {
          textEdit: {
            range: markerRange,
            text: fixContent.text,
          },
          resource: model.uri,
          versionId: undefined,
        },
      ],
    },
    kind: "quickfix",
  };
}

export const provideCodeActions =
  (monaco: typeof MonacoEditor, schemaVersion: SchemaVersion) =>
  (
    model: editor.ITextModel,
    range: MonacoEditor.Range,
    context: languages.CodeActionContext & { markers: Marker[] },
    token: CancellationToken,
  ): languages.ProviderResult<languages.CodeActionList> => {
    const codeActions: languages.CodeAction[] = [];

    context.markers
      .map((marker: Marker) => {
        const startOffset = model.getOffsetAt({ column: marker.startColumn, lineNumber: marker.startLineNumber });
        const endOffset = model.getOffsetAt({ column: marker.endColumn, lineNumber: marker.endLineNumber });
        const text = model.getValue().substr(startOffset, endOffset - startOffset);

        const markerRange = new monaco.Range(
          marker.startLineNumber,
          marker.startColumn,
          marker.endLineNumber,
          marker.endColumn,
        );

        const action = getCodeActionForError({ markerRange, model, marker, text, schemaVersion });
        if (action) {
          codeActions.push(action);
        }
      })
      .filter((action) => action);

    return {
      actions: codeActions,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      dispose() {},
    };
  };
