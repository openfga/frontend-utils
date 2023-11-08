import { OpenFgaDslThemeTokenType } from "../../theme";

export const languageDefinition = {
  [OpenFgaDslThemeTokenType.COMMENT]: {
    pattern: /^\s*#.*/,
  },
  [OpenFgaDslThemeTokenType.KEYWORD]: /\b(type|relations|define|and|or|but not|from|as|model|schema|condition)\b/,
  [OpenFgaDslThemeTokenType.TYPE]: {
    pattern: /(\btype\s+)\w+/i,
    lookbehind: true,
    greedy: true,
  },
  [OpenFgaDslThemeTokenType.RELATION]: {
    pattern: /(\bdefine\s+)\w+/i,
    lookbehind: true,
    greedy: true,
  },
  [OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE]: /\[.*]|self/,
  [OpenFgaDslThemeTokenType.CONDITION]: {
    pattern: /(\bcondition\s+)\w+/i,
    lookbehind: true,
    greedy: true,
  },
  "condition-params": {
    pattern: /\(.*\)\s*{/,
    inside: {
      "condition-param": /\b(\w+)\s*:/i,
      "condition-param-type": /\b(string|int|map|uint|list|timestamp|bool|duration|double|ipaddress)\b/,
    },
  },
};
