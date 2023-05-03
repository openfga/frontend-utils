import { getLanguageConfiguration, language } from "./language-definition";
import { LANGUAGE_NAME } from "../../constants";
import { DocumentationMap, providerHover } from "./providers/hover-actions";
import { provideCompletionItems } from "./providers/completion";
import { provideCodeActions } from "./providers/code-actions";
import { SchemaVersion } from "../../constants/schema-version";
import { ILanguageExtensionPoint, MonacoEditorType } from "./monaco-editor.types";

export interface RegisterDslOverrides {
  documentationMap: DocumentationMap;
}

export const registerDSL = (
  monaco: MonacoEditorType,
  schemaVersion = SchemaVersion.OneDotZero,
  overrides: RegisterDslOverrides,
) => {
  const isLanguageRegistered = !!monaco.languages
    .getLanguages()
    .find((language: ILanguageExtensionPoint) => language.id === LANGUAGE_NAME);

  if (isLanguageRegistered) {
    return;
  }

  monaco.languages.register({ id: LANGUAGE_NAME });

  monaco.languages.setLanguageConfiguration(LANGUAGE_NAME, getLanguageConfiguration(monaco));

  monaco.languages.setMonarchTokensProvider(LANGUAGE_NAME, language);

  monaco.languages.registerHoverProvider(LANGUAGE_NAME, {
    provideHover: providerHover(monaco, overrides.documentationMap),
  });

  monaco.languages.registerCompletionItemProvider(LANGUAGE_NAME, {
    provideCompletionItems: provideCompletionItems(monaco, schemaVersion),
  });

  monaco.languages.registerCodeActionProvider(LANGUAGE_NAME, {
    provideCodeActions: provideCodeActions(monaco, schemaVersion),
  });
};
