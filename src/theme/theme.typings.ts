export enum OpenFgaDslThemeTokenType {
  DEFAULT = "default",
  COMMENT = "comment",
  KEYWORD = "keyword",
  TYPE = "type",
  RELATION = "relation",
  DIRECTLY_ASSIGNABLE = "directly-assignable",
}

export enum OpenFgaDslThemeToken {
  COMMENT = "comment",
  DELIMITER_BRACKET_RELATION_DEFINITION = "delimiter.bracket.relation-definition",
  DELIMITER_BRACKET_TYPE_RESTRICTIONS = "delimiter.bracket.type-restrictions",
  DELIMITER_BRACKET_CONDITION_EXPRESSION = "delimiter.bracket.condition-expression",
  DELIMITER_COLON_TYPE_RESTRICTIONS = "delimiter.colon.type-restrictions",
  DELIMITER_COMMA_TYPE_RESTRICTIONS = "delimiter.comma.type-restrictions",
  DELIMITER_DEFINE_COLON = "delimiter.colon.define",
  DELIMITER_HASHTAG_TYPE_RESTRICTIONS = "delimiter.hashtag.type-restrictions",
  KEYWORD_AS = "keyword.as",
  KEYWORD_DEFINE = "keyword.define",
  KEYWORD_FROM = "keyword.from",
  KEYWORD_MODEL = "keyword.model",
  KEYWORD_RELATIONS = "keyword.relations",
  KEYWORD_SCHEMA = "keyword.schema",
  KEYWORD_SELF = "keyword.self",
  KEYWORD_TYPE = "keyword.type",
  KEYWORD_CONDITION = "keyword.condition",
  KEYWORD_WITH = "keyword.with",
  OPERATOR_AND = "keyword.operator.word.intersection",
  OPERATOR_BUT_NOT = "keyword.operator.word.exclusion",
  OPERATOR_OR = "keyword.operator.word.union",
  VALUE_CONDITION = "entity.name.function.condition",
  VALUE_RELATION_COMPUTED = "computed.relation.value",
  VALUE_RELATION_NAME = "entity.name.function.member.relation.name",
  VALUE_RELATION_TUPLE_TO_USERSET_COMPUTED = "computed.tupletouserset.relation.value",
  VALUE_RELATION_TUPLE_TO_USERSET_TUPLESET = "tupleset.tupletouserset.relation.value",
  VALUE_SCHEMA = "schema.value",
  VALUE_TYPE_NAME = "support.class.type.name.value",
  VALUE_TYPE_RESTRICTIONS_RELATION = "variable.parameter.type-restrictions.relation.value",
  VALUE_TYPE_RESTRICTIONS_TYPE = "variable.parameter.type-restrictions.type.value",
  VALUE_TYPE_RESTRICTIONS_WILDCARD = "variable.parameter.type-restrictions.wildcard.value",
  CONDITION_PARAM = "variable.parameter.name.condition",
  CONDITION_PARAM_TYPE = "variable.parameter.type.condition"
}

export interface OpenFgaThemeConfiguration {
  name: string;
  baseTheme?: "vs" | "vs-dark" | "hc-black" | "hc-light";
  colors: Record<OpenFgaDslThemeTokenType, string>;
  rawColorOverrides?: Partial<Record<OpenFgaDslThemeToken, string>>;
  styles?: Partial<Record<OpenFgaDslThemeTokenType, string>>;
  rawStylesOverrides?: Partial<Record<OpenFgaDslThemeToken, string>>;
  background: {
    color: string;
  };
}

export enum SupportedTheme {
  OpenFgaDark = "openfga-dark",
}
