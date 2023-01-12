import { readFile } from "fs/promises";
import { Options as YargsOptions } from "yargs";

import checkDSL from "../validator";
import transformSyntax from "../transformer";
import { assertNever } from "assert-never";

type fromOption = "dsl" | "json";

interface CommandArgs {
  from: fromOption;
  inputFile: string;
}

exports.command = "transform";
exports.desc = "Transform ";
exports.builder = {
  from: {
    describe: "whether we want to transform from dsl or json",
    choices: ["dsl", "json"],
    required: true,
  },
  inputFile: {
    describe: "Configuration file. It must be in DSL syntax.",
    type: "string",
    required: true,
  },
} as Record<keyof CommandArgs, YargsOptions>;

async function loadFile(inputFile: string) {
  return readFile(inputFile, "utf-8");
}

exports.handler = async (argv: CommandArgs) => {
  try {
    const fileContents = await loadFile(argv.inputFile);
    switch (argv.from) {
      case "dsl": {
        const validateResult = checkDSL.checkDSL(fileContents);
        if (validateResult.length) {
          throw new Error(`Invalid DSL with error ${JSON.stringify(validateResult)}`);
        }
        const transformedResult = transformSyntax.friendlySyntaxToApiSyntax(fileContents);
        console.log(JSON.stringify(transformedResult, null, 4));
        break;
      }
      case "json": {
        const transformedResult = transformSyntax.apiSyntaxToFriendlySyntax(JSON.parse(fileContents));
        console.log(transformedResult);
        break;
      }
      default:
        assertNever(argv.from);
    }
  } catch (err) {
    console.error(err as Error);
    process.exitCode = 1;
  }
};
