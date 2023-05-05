import { getLanguageConfiguration } from "./language-definition";
import { LANGUAGE_NAME } from "../../constants";
import { DocumentationMap, providerHover } from "./providers/hover-actions";
import { provideCompletionItems } from "./providers/completion";
import { provideCodeActions } from "./providers/code-actions";
import { VsCodeEditorType } from "./vscode.types";

export interface RegisterDslOverrides {
  documentationMap: DocumentationMap;
}

// export const registerDSL = async (
//   editor: VsCodeEditorType,
//   overrides: RegisterDslOverrides,
// ) => {
//   const isLanguageRegistered = !!(await editor.languages
//     .getLanguages())
//     .find((language) => language === LANGUAGE_NAME);
//
//   if (isLanguageRegistered) {
//     return;
//   }
//
//   // editor.languages.register({ id: LANGUAGE_NAME });
//
//   editor.languages.setLanguageConfiguration(LANGUAGE_NAME, getLanguageConfiguration(editor));
//
//   // editor.languages.registerDocumentSemanticTokensProvider(LANGUAGE_NAME, language);
//
//   editor.languages.registerHoverProvider(LANGUAGE_NAME, {
//     provideHover: providerHover(editor, overrides.documentationMap),
//   });
//
//   editor.languages.registerCompletionItemProvider(LANGUAGE_NAME, {
//     provideCompletionItems: provideCompletionItems(editor),
//   });
//
//   editor.languages.registerCodeActionsProvider(LANGUAGE_NAME, {
//     provideCodeActions: provideCodeActions(editor),
//   });
// };
