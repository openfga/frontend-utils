import { readFile } from "fs/promises";
import { Options as YargsOptions } from "yargs";

import apiSyntaxToFriendlySyntax from "../transformer";

interface CommandArgs {
  jsonFile: string;
}

exports.command = "jsonToDSL <jsonFile>";
exports.desc = "Transform JSON to DSL";
exports.builder = {
  jsonFile: {
    describe: "Configuration file. It must be in JSON syntax.",
    type: "string",
  },
} as Record<keyof CommandArgs, YargsOptions>;

async function loadFile(inputFile: string) {
  return readFile(inputFile, "utf-8");
}

exports.handler = async (argv: CommandArgs) => {
  try {
    const fileContents = JSON.parse(await loadFile(argv.jsonFile));
    const transformedResult = apiSyntaxToFriendlySyntax.apiSyntaxToFriendlySyntax(fileContents);
    console.log(transformedResult);
  } catch (err) {
    console.error(err as Error);
    process.exitCode = 1;
  }
};
