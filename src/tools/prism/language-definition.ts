import { OpenFgaDslThemeTokenType } from "../../theme/theme.typings";

export const languageDefinition = {
  module: {
    pattern: /(module\s+)[\w_-]+/i,
    alias: OpenFgaDslThemeTokenType.MODULE,
  },
  type: {
    pattern: /(\btype\s+)[\w_-]+/i,
    alias: OpenFgaDslThemeTokenType.TYPE,
  },
  "extend-type": {
    pattern: /(\bextend type\s+)[\w_-]+/i,
    alias: OpenFgaDslThemeTokenType.EXTEND,
  },
  relation: {
    pattern: /(\bdefine\s+)[\w_-]+/i,
    alias: OpenFgaDslThemeTokenType.RELATION,
  },
  "directly-assignable": {
    pattern: /\[.*]|self/,
    alias: OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE,
  },
  condition: {
    pattern: /(\bcondition\s+)[\w_-]+/i,
    alias: OpenFgaDslThemeTokenType.CONDITION,
  },
  "condition-params": {
    pattern: /\(.*\)\s*{/,
    inside: {
      "condition-param": /\b([\w_-]+)\s*:/i,
      "condition-param-type": /\b(string|int|map|uint|list|timestamp|bool|duration|double|ipaddress)\b/,
    },
  },
  comment: {
    pattern: /(^\s*|\s+)#.*/,
    alias: OpenFgaDslThemeTokenType.COMMENT,
  },
  keyword: {
    pattern: /\b(type|relations|define|and|or|but not|from|as|model|schema|condition|module|extend)\b/,
    alias: OpenFgaDslThemeTokenType.KEYWORD,
  },
};
