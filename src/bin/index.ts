#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { commands } from "../cmds";

yargs(hideBin(process.argv))
  .command(commands as any)
  .demandCommand()
  .recommendCommands()
  .strict()
  .help()
  .completion().argv;
