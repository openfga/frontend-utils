import { LANGUAGE_NAME } from "../../constants";
// import { registerDSL } from "./register-dsl";
export type { DocumentationMap } from "./providers/hover-actions";
import { buildTheme, vscodeThemes } from "./theme";
import * as languageDefinition from "./language-definition";

export const VsCodeExtensions = {
  LANGUAGE_NAME,
  // registerDSL,
  vscodeThemes,
  languageDefinition,
  buildTheme,
};
