import constants, { enums } from "./constants";
import formatter from "./formatter";
import transformer from "./transformer";
import validator from "./validator";
import MonacoExtensions from "./monaco-extensions";
import * as theming from "./utilities/theme";

const { Keyword, SchemaVersion } = enums;

const { friendlySyntaxToApiSyntax, apiSyntaxToFriendlySyntax } = transformer;
const checkDSL = validator.checkDSL;
const indentDSL = formatter.indentDSL;

export {
  constants,
  formatter,
  transformer,
  validator,
  MonacoExtensions,
  theming,

  // for backward compatibility to prevent breaking changes, to be removed in next major release
  Keyword,
  SchemaVersion,
  checkDSL,
  indentDSL,
  apiSyntaxToFriendlySyntax,
  friendlySyntaxToApiSyntax,
};
