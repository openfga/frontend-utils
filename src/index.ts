#!/usr/bin/env node
import constants, { enums } from "./constants";
import formatter from "./formatter";
import transformer from "./transformer";
import validator, * as ValidationErrors from "./validator";
import * as syntaxHighlighters from "./syntax-highlighters";
import * as theming from "./theme";
import * as graphBuilder from "./utilities/graphs";
import sampleAuthorizationModels from "./samples";

const { Keyword, SchemaVersion } = enums;

const { friendlySyntaxToApiSyntax, apiSyntaxToFriendlySyntax } = transformer;
const checkDSL = validator.checkDSL;
const indentDSL = formatter.indentDSL;

export {
  sampleAuthorizationModels,
  constants,
  formatter,
  transformer,
  validator,
  ValidationErrors,
  syntaxHighlighters,
  theming,
  graphBuilder,

  // for backward compatibility to prevent breaking changes, to be removed in next major release
  Keyword,
  SchemaVersion,
  checkDSL,
  indentDSL,
  apiSyntaxToFriendlySyntax,
  friendlySyntaxToApiSyntax,
};
