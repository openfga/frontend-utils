export type { languages, LanguageConfiguration } from "vscode";
import * as VsCodeEditor from "vscode-languageserver-types";

export type {
  WorkspaceEdit,
  Command,
  CompletionList,
  Position,
  Range,
  CompletionItem,
  Hover,
  CodeActionContext,
  CodeAction,
  Diagnostic,
} from "vscode-languageserver-types";

export type VsCodeEditorType = typeof VsCodeEditor;
export type ITextModel = VsCodeEditor.TextDocument;
export type IMonarchLanguage = any;
export type IStandaloneThemeData = any;

// Source: https://github.com/microsoft/vscode/blob/aebaec6cafe65229a264ee6297c1ef03462ffbff/src/vs/editor/common/languages/languageConfiguration.ts#LL207C4-L227C2
export enum IndentAction {
  /**
   * Insert new line and copy the previous line's indentation.
   */
  None = 0,
  /**
   * Insert new line and indent once (relative to the previous line's indentation).
   */
  Indent = 1,
  /**
   * Insert two new lines:
   *  - the first one indented which will hold the cursor
   *  - the second one at the same indentation level
   */
  IndentOutdent = 2,
  /**
   * Insert new line and outdent once (relative to the previous line's indentation).
   */
  Outdent = 3,
}
