import { OpenFgaDslThemeToken, OpenFgaDslThemeTokenType, OpenFgaThemeConfiguration } from "./theme.typings";

const tokenTypeMap: Record<OpenFgaDslThemeToken, OpenFgaDslThemeTokenType> = {
  [OpenFgaDslThemeToken.COMMENT]: OpenFgaDslThemeTokenType.COMMENT,
  [OpenFgaDslThemeToken.DELIMITER_BRACKET_RELATION_DEFINITION]: OpenFgaDslThemeTokenType.DEFAULT,
  [OpenFgaDslThemeToken.DELIMITER_BRACKET_TYPE_RESTRICTIONS]: OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE,
  [OpenFgaDslThemeToken.DELIMITER_BRACKET_CONDITION_EXPRESSION]: OpenFgaDslThemeTokenType.DEFAULT,
  [OpenFgaDslThemeToken.DELIMITER_COLON_TYPE_RESTRICTIONS]: OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE,
  [OpenFgaDslThemeToken.DELIMITER_COMMA_TYPE_RESTRICTIONS]: OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE,
  [OpenFgaDslThemeToken.DELIMITER_DEFINE_COLON]: OpenFgaDslThemeTokenType.DEFAULT,
  [OpenFgaDslThemeToken.DELIMITER_HASHTAG_TYPE_RESTRICTIONS]: OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE,
  [OpenFgaDslThemeToken.KEYWORD_AS]: OpenFgaDslThemeTokenType.KEYWORD,
  [OpenFgaDslThemeToken.KEYWORD_DEFINE]: OpenFgaDslThemeTokenType.KEYWORD,
  [OpenFgaDslThemeToken.KEYWORD_FROM]: OpenFgaDslThemeTokenType.KEYWORD,
  [OpenFgaDslThemeToken.KEYWORD_MODEL]: OpenFgaDslThemeTokenType.KEYWORD,
  [OpenFgaDslThemeToken.KEYWORD_RELATIONS]: OpenFgaDslThemeTokenType.KEYWORD,
  [OpenFgaDslThemeToken.KEYWORD_SCHEMA]: OpenFgaDslThemeTokenType.KEYWORD,
  [OpenFgaDslThemeToken.KEYWORD_SELF]: OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE,
  [OpenFgaDslThemeToken.KEYWORD_TYPE]: OpenFgaDslThemeTokenType.KEYWORD,
  [OpenFgaDslThemeToken.OPERATOR_AND]: OpenFgaDslThemeTokenType.KEYWORD,
  [OpenFgaDslThemeToken.OPERATOR_BUT_NOT]: OpenFgaDslThemeTokenType.KEYWORD,
  [OpenFgaDslThemeToken.OPERATOR_OR]: OpenFgaDslThemeTokenType.KEYWORD,
  [OpenFgaDslThemeToken.KEYWORD_CONDITION]: OpenFgaDslThemeTokenType.KEYWORD,
  [OpenFgaDslThemeToken.KEYWORD_WITH]: OpenFgaDslThemeTokenType.KEYWORD,
  [OpenFgaDslThemeToken.VALUE_CONDITION]: OpenFgaDslThemeTokenType.CONDITION,
  [OpenFgaDslThemeToken.VALUE_RELATION_COMPUTED]: OpenFgaDslThemeTokenType.DEFAULT,
  [OpenFgaDslThemeToken.VALUE_RELATION_NAME]: OpenFgaDslThemeTokenType.RELATION,
  [OpenFgaDslThemeToken.VALUE_RELATION_TUPLE_TO_USERSET_COMPUTED]: OpenFgaDslThemeTokenType.DEFAULT,
  [OpenFgaDslThemeToken.VALUE_RELATION_TUPLE_TO_USERSET_TUPLESET]: OpenFgaDslThemeTokenType.DEFAULT,
  [OpenFgaDslThemeToken.VALUE_SCHEMA]: OpenFgaDslThemeTokenType.DEFAULT,
  [OpenFgaDslThemeToken.VALUE_TYPE_NAME]: OpenFgaDslThemeTokenType.TYPE,
  [OpenFgaDslThemeToken.VALUE_TYPE_RESTRICTIONS_RELATION]: OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE,
  [OpenFgaDslThemeToken.VALUE_TYPE_RESTRICTIONS_TYPE]: OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE,
  [OpenFgaDslThemeToken.VALUE_TYPE_RESTRICTIONS_WILDCARD]: OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE,
  [OpenFgaDslThemeToken.CONDITION_PARAM]: OpenFgaDslThemeTokenType.CONDITION_PARAM,
  [OpenFgaDslThemeToken.CONDITION_PARAM_TYPE]: OpenFgaDslThemeTokenType.CONDITION_PARAM_TYPE,
};

export function getThemeTokenStyle(
  token: OpenFgaDslThemeToken,
  themeConfig: OpenFgaThemeConfiguration,
): {
  foreground?: string;
  fontStyle?: string;
} {
  return {
    foreground:
      themeConfig.rawColorOverrides?.[token] ||
      themeConfig.colors[tokenTypeMap[token || OpenFgaDslThemeTokenType.DEFAULT]],
    fontStyle:
      themeConfig.rawStylesOverrides?.[token] ||
      themeConfig.styles?.[tokenTypeMap[token || OpenFgaDslThemeTokenType.DEFAULT]],
  };
}
