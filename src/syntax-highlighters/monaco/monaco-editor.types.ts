import type { editor } from "monaco-editor";
import type * as MonacoEditor from "monaco-editor";

export type CancellationToken = MonacoEditor.CancellationToken;
export type IMarkerData = editor.IMarkerData;
export type IRelatedInformation = editor.IRelatedInformation;

export type Position = MonacoEditor.Position;
export type IRange = MonacoEditor.IRange;
export type ITextModel = editor.ITextModel;
export type IStandaloneThemeData = editor.IStandaloneThemeData;
export type MonacoEditorType = typeof MonacoEditor;
export type languages = typeof MonacoEditor.languages;
export type Range = MonacoEditor.Range;
export type LanguageConfiguration = MonacoEditor.languages.LanguageConfiguration;
export type IMonarchLanguage = MonacoEditor.languages.IMonarchLanguage;
export type CompletionItemRanges = MonacoEditor.languages.CompletionItemRanges;
export type CompletionItem = MonacoEditor.languages.CompletionItem;
export type CompletionList = MonacoEditor.languages.CompletionList;
export type CompletionListProviderResult = MonacoEditor.languages.ProviderResult<CompletionList>;
export type ILanguageExtensionPoint = MonacoEditor.languages.ILanguageExtensionPoint;
export type Hover = MonacoEditor.languages.Hover;
export type CodeActionContext = MonacoEditor.languages.CodeActionContext;
export type CodeActionList = MonacoEditor.languages.CodeActionList;
export type CodeActionListProviderResult = MonacoEditor.languages.ProviderResult<CodeActionList>;
export type CodeAction = MonacoEditor.languages.CodeAction;
export type Uri = MonacoEditor.Uri;
