import constants, { enums } from "./constants";
import formatter from "./formatter";
import transformer from "./transformer";
import validator from "./validator";
import * as syntaxHighlighters from "./syntax-highlighters";
import * as theming from "./theme";

const { Keyword, SchemaVersion } = enums;

const { friendlySyntaxToApiSyntax, apiSyntaxToFriendlySyntax } = transformer;
const checkDSL = validator.checkDSL;
const indentDSL = formatter.indentDSL;

export {
  constants,
  formatter,
  transformer,
  validator,
  syntaxHighlighters,
  theming,

  // for backward compatibility to prevent breaking changes, to be removed in next major release
  Keyword,
  SchemaVersion,
  checkDSL,
  indentDSL,
  apiSyntaxToFriendlySyntax,
  friendlySyntaxToApiSyntax,
};
