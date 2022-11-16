import { LANGUAGE_NAME } from "./language-name";
import { registerDSL } from "./register-dsl";
import { theme } from "./theme";
import * as languageDefinition from "./language-definition";

const MonacoExtensions = {
  LANGUAGE_NAME,
  registerDSL,
  theme,
  languageDefinition,
};

export default MonacoExtensions;
