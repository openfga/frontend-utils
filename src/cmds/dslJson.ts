import { readFile } from "fs/promises";
import { Options as YargsOptions } from "yargs";

import checkDSL from "../validator";
import friendlySyntaxToApiSyntax from "../transformer";

interface CommandArgs {
  dslFile: string;
}

exports.command = "dslToJSON <dslFile>";
exports.desc = "Transform from DSL to JSON";
exports.builder = {
  dslFile: {
    describe: "Configuration file. It must be in DSL syntax.",
    type: "string",
  },
} as Record<keyof CommandArgs, YargsOptions>;

async function loadFile(inputFile: string) {
  return readFile(inputFile, "utf-8");
}

exports.handler = async (argv: CommandArgs) => {
  try {
    const fileContents = await loadFile(argv.dslFile);
    const validateResult = checkDSL.checkDSL(fileContents);
    if (validateResult.length) {
      throw new Error(`Invalid DSL with error ${JSON.stringify(validateResult)}`);
    }
    const transformedResult = friendlySyntaxToApiSyntax.friendlySyntaxToApiSyntax(fileContents);
    console.log(JSON.stringify(transformedResult, null, 4));
  } catch (err) {
    console.error(err as Error);
    process.exitCode = 1;
  }
};
