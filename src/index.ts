#!/usr/bin/env node
import constants, { enums } from "./constants";
import formatter from "./formatter";
import transformer from "./transformer";
import validator from "./validator";
import * as syntaxHighlighters from "./syntax-highlighters";
import * as theming from "./theme";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { commands } from "./cmds";

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

yargs(hideBin(process.argv))
  .command(commands as any)
  .demandCommand()
  .recommendCommands()
  .strict()
  .help()
  .completion().argv;
