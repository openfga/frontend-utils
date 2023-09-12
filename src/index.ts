#!/usr/bin/env node
import constants, { enums } from "./constants";
import formatter from "./formatter";
import transformer from "./transformer";
import validator from "./validator";
import * as syntaxHighlighters from "./syntax-highlighters";
import * as theming from "./theme";
import * as graphBuilder from "./utilities/graphs";
import sampleAuthorizationModels from "./samples";
// `language` imported like a module to avoid including antlr in the top level dependencies
// Local package path in package.json will be replaced with npm package version once published
import * as language from "./language/pkg/js";

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
  syntaxHighlighters,
  theming,
  graphBuilder,
  language,

  // for backward compatibility to prevent breaking changes, to be removed in next major release
  Keyword,
  SchemaVersion,
  checkDSL,
  indentDSL,
  apiSyntaxToFriendlySyntax,
  friendlySyntaxToApiSyntax,
};
