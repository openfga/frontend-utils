import formatter from "./formatter";
import transformer from "./transformer";
import validator from "./validator";
import MonacoExtensions from "./monaco-extensions";

export { Keyword } from "./keyword";

const { friendlySyntaxToApiSyntax, apiSyntaxToFriendlySyntax } = transformer;
const checkDSL = validator.checkDSL;
const indentDSL = formatter.indentDSL;

export {
  formatter,
  transformer,
  validator,
  MonacoExtensions,

  // for backward compatibility to prevent breaking changes, to be removed in next major release
  checkDSL,
  indentDSL,
  apiSyntaxToFriendlySyntax,
  friendlySyntaxToApiSyntax,
};
