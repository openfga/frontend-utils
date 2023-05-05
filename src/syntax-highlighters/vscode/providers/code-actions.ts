import { Keyword } from "../../../constants/keyword";
import { Marker } from "../../../validator/reporters";
import { ValidationError } from "../../../validator/validation-error";
import { SINGLE_INDENTATION } from "../../../formatter/indent-dsl";
import {
  CodeAction,
  CodeActionContext,
  VsCodeEditorType,
  Range,
  Diagnostic,
  ITextModel,
  WorkspaceEdit,
} from "../vscode.types";

export interface DiagnosticWithExtraInformation extends Diagnostic {
  extraInformation?: { error?: ValidationError; typeName?: string; relation?: string };
}

interface CodeActionInput {
  markerRange: Range;
  model: ITextModel;
  marker: DiagnosticWithExtraInformation;
  text: string;
}

interface CodeActionResult {
  title: string;
  text: string;
  startColumn?: number;
  startLineNumber?: number;
}

const errorFixesByErrorCode: Partial<
  Record<ValidationError, (markerData: { relation?: string } & CodeActionInput) => CodeActionResult>
> = {
  [ValidationError.MissingDefinition]: ({ model, markerRange, relation }) => {
    const lineContent = model.getText(markerRange);
    return {
      startColumn: 0,
      title: `Fix: add definition for \`${relation}\`.`,
      text: `${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE} ${relation}: [typeName]\n${lineContent}`,
    };
  },
  [ValidationError.SelfError]: ({ text }) => ({
    title: `Fix: replace \`${text}\` with type restrictions.`,
    text: "[typeName]",
  }),
  [ValidationError.DuplicatedError]: ({ model, markerRange, text }) => {
    return {
      startLineNumber: markerRange.start.line - 1,
      startColumn: markerRange.start.character,
      title: `Fix: remove duplicated \`${text}\`.`,
      text: "",
    };
  },
};

function getCodeActionForError(
  editor: VsCodeEditorType,
  { markerRange, model, marker, text }: CodeActionInput,
): CodeAction | undefined {
  const { error, relation } = marker.extraInformation || {};
  const fixContent = errorFixesByErrorCode[error as ValidationError]?.({
    model,
    marker,
    markerRange,
    text,
    relation,
  });

  if (!fixContent) {
    return;
  }

  const workspaceEdit: WorkspaceEdit = {
    changes: {
      [model.uri]: [
        {
          range: markerRange,
          newText: fixContent.text,
        },
      ],
    },
  };

  return {
    title: fixContent?.title,
    diagnostics: [marker],
    edit: workspaceEdit,
    kind: editor.CodeActionKind.QuickFix,
  };
}

export const provideCodeActions =
  (editor: VsCodeEditorType) =>
  (model: ITextModel, range: Range, context: CodeActionContext & { markers: Marker[] }): CodeAction[] => {
    const codeActions: CodeAction[] = [];

    context.diagnostics
      .map((diagnostic: Diagnostic) => {
        const range = diagnostic.range;
        const text = model.getText(range);

        const action = getCodeActionForError(editor, { markerRange: range, model, marker: diagnostic, text });
        if (action) {
          codeActions.push(action);
        }
      })
      .filter((action) => action);

    return codeActions;
  };
