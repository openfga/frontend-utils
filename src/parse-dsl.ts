import { Parser } from "nearley";

import { grammar } from "./grammar";

export const parseDSL = (code: string): any[] => {
  const parser = new Parser(grammar);
  parser.feed(code.trim() + "\n");
  return parser.results;
};
