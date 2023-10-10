import { LANGUAGE_NAME } from "../../constants";
import * as languageDefinition from "./language-definition";
import { registerDSL } from "./register-dsl";
export type { DocumentationMap } from "./providers/hover-actions";
import { buildMonacoTheme, monacoThemes } from "./theme";
import { validateDSL } from "./validate";

export const MonacoExtensions = {
  LANGUAGE_NAME,
  registerDSL,
  monacoThemes,
  validateDSL,
  languageDefinition,
  buildMonacoTheme,
};
