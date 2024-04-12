import { OpenFgaDslThemeTokenType } from "../../theme/theme.typings";

export const languageDefinition = {
  [OpenFgaDslThemeTokenType.MODULE]: {
    pattern: /(module\s+)[\w_-]+/i,
    lookbehind: true,
  },
  [OpenFgaDslThemeTokenType.TYPE]: {
    pattern: /(\btype\s+)[\w_-]+/i,
    lookbehind: true,
  },
  [OpenFgaDslThemeTokenType.EXTEND]: {
    pattern: /(\bextend type\s+)[\w_-]+/i,
    lookbehind: true,
  },
  [OpenFgaDslThemeTokenType.RELATION]: {
    pattern: /(\bdefine\s+)[\w_-]+/i,
    lookbehind: true,
  },
  [OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE]: /\[.*]|self/,
  [OpenFgaDslThemeTokenType.CONDITION]: {
    pattern: /(\bcondition\s+)[\w_-]+/i,
    lookbehind: true,
  },
  "condition-params": {
    pattern: /\(.*\)\s*{/,
    inside: {
      "condition-param": /\b([\w_-]+)\s*:/i,
      "condition-param-type": /\b(string|int|map|uint|list|timestamp|bool|duration|double|ipaddress)\b/,
    },
  },
  [OpenFgaDslThemeTokenType.COMMENT]: {
    pattern: /(^\s*|\s+)#.*/,
  },
  [OpenFgaDslThemeTokenType.KEYWORD]: {
    pattern: /\b(type|relations|define|and|or|but not|from|as|model|schema|condition|module|extend)\b/,
  },
};
