import { LANGUAGE_NAME } from "../constants";
import { registerDSL } from "./register-dsl";
import { monacoThemes } from "./theme";
import * as languageDefinition from "./language-definition";

const MonacoExtensions = {
  LANGUAGE_NAME,
  registerDSL,
  monacoThemes,
  languageDefinition,
};

export default MonacoExtensions;
