import { LANGUAGE_NAME } from "../constants/language-name";
// eslint-disable-next-line import/no-unresolved
import * as Prism from "prismjs";

export const languageMap: Prism.LanguageMap = {
  [LANGUAGE_NAME]: {
    comment: {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true,
    },
    "fga-type": /^(type)\b/m,
    "fga-definition": /\b(relations|define)\b/m,
    "fga-keyword": /\b(?:as)\b/,
    "fga-operator": /\b(?:and|or|but\snot)\b/,
    "fga-self": /\bself\b/,
    "fga-tuple-to-userset": /\bfrom\b/,
  },
};
