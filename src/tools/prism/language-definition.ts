import { OpenFgaDslThemeTokenType } from "../../theme";

export const languageDefinition = {
  [OpenFgaDslThemeTokenType.COMMENT]: {
    pattern: /^\s*#.*/,
  },
  [OpenFgaDslThemeTokenType.KEYWORD]: /\b(type|relations|define|and|or|but not|from|as|model|schema)\b/,
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
};
