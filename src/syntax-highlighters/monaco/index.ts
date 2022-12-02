import { LANGUAGE_NAME } from "../../constants";
import { registerDSL } from "./register-dsl";
import { buildMonacoTheme, monacoThemes } from "./theme";
import * as languageDefinition from "./language-definition";

export const MonacoExtensions = {
  LANGUAGE_NAME,
  registerDSL,
  monacoThemes,
  languageDefinition,
  buildMonacoTheme,
};
