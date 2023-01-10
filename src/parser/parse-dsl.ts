import { Grammar, Parser } from "nearley";

import grammar from "./grammar";
import { ParserResult } from "./parser.typings";

export const innerParseDSL = (code: string): ParserResult[] => {
  const parser = new Parser(Grammar.fromCompiled(grammar));
  const cleanedCode =
    code
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n") + "\n";
  parser.feed(cleanedCode);
  return parser.results;
};

export const parseDSL = (code: string): ParserResult => {
  return innerParseDSL(code)[0] || [];
};
