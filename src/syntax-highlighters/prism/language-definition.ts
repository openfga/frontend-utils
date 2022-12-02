import { OpenFgaDslThemeTokenType } from "../../theme";

export const languageDefinition = {
  [OpenFgaDslThemeTokenType.DEFAULT]: {},
  [OpenFgaDslThemeTokenType.COMMENT]: {
    pattern: /(^|[^\\:])\/\/.*/,
    lookbehind: true,
    greedy: true,
  },
  [OpenFgaDslThemeTokenType.KEYWORD]: /\b(type|relations|define|and|or|but not|from|as|model|schema)\b/,
  [OpenFgaDslThemeTokenType.TYPE]: {
    pattern: /(\b(?:type)\s+)[\w.\\]+/
  },
  [OpenFgaDslThemeTokenType.RELATION]: {
    pattern: /(\b(?:relation)\s+)[\w.\\]+/
  },
  [OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE]: /\bself|(\[.*\])\b/,
};
