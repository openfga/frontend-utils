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
  DELIMITER_BRACKET_RELATION_DEFINITION = "relation-definition.bracket.delimiter",
  DELIMITER_BRACKET_TYPE_RESTRICTIONS = "type-restrictions.bracket.delimiter",
  DELIMITER_COLON_TYPE_RESTRICTIONS = "colon.type-restrictions.delimiter",
  DELIMITER_COMMA_TYPE_RESTRICTIONS = "comma.type-restrictions.delimiter",
  DELIMITER_DEFINE_COLON = "colon.define.delimiter",
  DELIMITER_HASHTAG_TYPE_RESTRICTIONS = "hashtag.type-restrictions.delimiter",
  KEYWORD_AS = "as.keyword",
  KEYWORD_DEFINE = "define.keyword",
  KEYWORD_FROM = "from.keyword",
  KEYWORD_MODEL = "model.keyword",
  KEYWORD_RELATIONS = "relations.keyword",
  KEYWORD_SCHEMA = "schema.keyword",
  KEYWORD_SELF = "self.keyword",
  KEYWORD_TYPE = "type.keyword",
  OPERATOR_AND = "intersection.operator",
  OPERATOR_BUT_NOT = "exclusion.operator",
  OPERATOR_OR = "union.operator",
  VALUE_RELATION_COMPUTED = "computed.relation.value",
  VALUE_RELATION_NAME = "name.relation.value",
  VALUE_RELATION_TUPLE_TO_USERSET_COMPUTED = "computed.tupletouserset.relation.value",
  VALUE_RELATION_TUPLE_TO_USERSET_TUPLESET = "tupleset.tupletouserset.relation.value",
  VALUE_SCHEMA = "schema.value",
  VALUE_TYPE_NAME = "name.type.value",
  VALUE_TYPE_RESTRICTIONS_RELATION = "relation.type-restrictions.value",
  VALUE_TYPE_RESTRICTIONS_TYPE = "type.type-restrictions.value",
  VALUE_TYPE_RESTRICTIONS_WILDCARD = "wildcard.type-restrictions.value",
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
  OpenFgaLight = "openfga-light",
  OpenFgaDark = "openfga-dark",
}
