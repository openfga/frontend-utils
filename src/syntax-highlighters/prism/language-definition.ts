import { OpenFgaDslThemeTokenType } from "../../theme";

export const languageDefinition = {
  [OpenFgaDslThemeTokenType.COMMENT]: {
    pattern: /(^|[^\\:])\/\/.*/,
    lookbehind: true,
    greedy: true,
  },
  [OpenFgaDslThemeTokenType.KEYWORD]: /\b(type|relations|define|and|or|but not|from|as|model|schema)\b/,
  [OpenFgaDslThemeTokenType.TYPE]: {
    pattern: /(?<=type\s+)\w+/,
  },
  [OpenFgaDslThemeTokenType.RELATION]: {
    pattern: /(?<=define\s+)\w+/,
  },
  [OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE]: /\[.*\]/,
};
