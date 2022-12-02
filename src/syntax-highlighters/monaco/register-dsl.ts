import type * as MonacoEditor from "monaco-editor";

import { getLanguageConfiguration, language } from "./language-definition";
import { LANGUAGE_NAME } from "../../constants/language-name";
import { providerHover } from "./providers/hover-actions";
import { provideCompletionItems } from "./providers/completion";
import { provideCodeActions } from "./providers/code-actions";
import { SchemaVersion } from "../../constants/schema-version";

export const registerDSL = (monaco: typeof MonacoEditor, schemaVersion = SchemaVersion.OneDotZero) => {
  const isLanguageRegistered = !!monaco.languages
    .getLanguages()
    .find((language: MonacoEditor.languages.ILanguageExtensionPoint) => language.id === LANGUAGE_NAME);

  if (isLanguageRegistered) {
    return;
  }

  monaco.languages.register({ id: LANGUAGE_NAME });

  monaco.languages.setLanguageConfiguration(LANGUAGE_NAME, getLanguageConfiguration(monaco));

  monaco.languages.setMonarchTokensProvider(LANGUAGE_NAME, language);

  monaco.languages.registerHoverProvider(LANGUAGE_NAME, {
    provideHover: providerHover(monaco),
  });

  monaco.languages.registerCompletionItemProvider(LANGUAGE_NAME, {
    provideCompletionItems: provideCompletionItems(monaco, schemaVersion),
  });

  monaco.languages.registerCodeActionProvider(LANGUAGE_NAME, {
    provideCodeActions: provideCodeActions(monaco, schemaVersion),
  });
};
