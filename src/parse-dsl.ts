import { Grammar, Parser } from "nearley";

import grammar from "./grammar";

export enum RewriteType {
  Direct = "direct",
  ComputedUserset = "computed_userset",
  TupleToUserset = "tuple_to_userset",
}

export enum RelationDefOperator {
  Single = "single",
  Union = "union",
  Intersection = "intersection",
  Exclusion = "exclusion",
}

export interface RelationTargetParserResult {
  target?: string;
  from?: string;
  rewrite: RewriteType;
}

export interface RelationDefParserResult<T extends RelationDefOperator> {
  comment: string;
  relation: string;
  allowedTypes: string[];
  definition: {
    type: T;
    targets: T extends RelationDefOperator.Exclusion ? undefined : RelationTargetParserResult[];
    base: T extends RelationDefOperator.Exclusion ? RelationTargetParserResult : undefined;
    diff: T extends RelationDefOperator.Exclusion ? RelationTargetParserResult : undefined;
  };
}

export interface TypeDefParserResult {
  comment: string;
  type: string;
  relations: RelationDefParserResult<RelationDefOperator>[];
}

export interface ParserResult {
  schemaVersion: string;
  types: TypeDefParserResult[];
}

export const innerParseDSL = (code: string): ParserResult[] => {
  const parser = new Parser(Grammar.fromCompiled(grammar));
  parser.feed(code.trim() + "\n");
  return parser.results;
};

export const parseDSL = (code: string): ParserResult => {
  return innerParseDSL(code)[0] || [];
};

// The TransformedType allows us to quickly access the various relations unique by
export interface TransformedType {
  comment: string;
  type: string;
  relations: Record<string, RelationDefParserResult<RelationDefOperator>>;
}
