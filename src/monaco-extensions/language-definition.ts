import type * as MonacoEditor from "monaco-editor";

import { Keyword } from "../keyword";
import { LANGUAGE_NAME } from "./language-name";

// Source for the code below:
// https://github.com/microsoft/monaco-editor/blob/main/src/basic-languages/python/python.ts

// This is exported as a function so we can keep referencing monaco as just a type rather than loading it directly
export function getLanguageConfiguration(monaco: typeof MonacoEditor): MonacoEditor.languages.LanguageConfiguration {
  return {
    comments: {
      lineComment: "#",
      blockComment: ["'''", "'''"],
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"', notIn: ["string"] },
      { open: "'", close: "'", notIn: ["string", "comment"] },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    onEnterRules: [
      {
        beforeText: new RegExp("^\\s*(?:type|relations|model).*?:\\s*$"),
        action: { indentAction: monaco.languages.IndentAction.Indent },
      },
    ],
    folding: {
      offSide: true,
      markers: {
        start: new RegExp("^\\s*#region\\b"),
        end: new RegExp("^\\s*#endregion\\b"),
      },
    },
  };
}

export const language = <MonacoEditor.languages.IMonarchLanguage>{
  defaultToken: "",
  tokenPostfix: `.${LANGUAGE_NAME}`,

  keywords: [Keyword.MODEL, Keyword.SCHEMA, Keyword.RELATIONS, Keyword.DEFINE, Keyword.AS],

  typeKeywords: [Keyword.TYPE],

  operators: [Keyword.AND, Keyword.BUT_NOT, Keyword.OR],

  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.bracket" },
    { open: "(", close: ")", token: "delimiter.parenthesis" },
  ],

  tokenizer: {
    root: [
      { include: "@whitespace" },
      { include: "@numbers" },
      { include: "@strings" },

      [/[,:;]/, "delimiter"],
      [/[{}\[\]()]/, "@brackets"],

      [/@[a-zA-Z_]\w*/, "tag"],
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier",
          },
        },
      ],
    ],

    // Deal with white space, including single and multi-line comments
    whitespace: [
      [/\s+/, "white"],
      [/(^#.*$)/, "comment"],
      [/'''/, "string", "@endDocString"],
      [/"""/, "string", "@endDblDocString"],
    ],
    endDocString: [
      [/[^']+/, "string"],
      [/\\'/, "string"],
      [/'''/, "string", "@popall"],
      [/'/, "string"],
    ],
    endDblDocString: [
      [/[^"]+/, "string"],
      [/\\"/, "string"],
      [/"""/, "string", "@popall"],
      [/"/, "string"],
    ],
  },
};
