import type * as MonacoEditor from "monaco-editor";

import { Keyword } from "../constants/keyword";
import { LANGUAGE_NAME } from "../constants/language-name";
import { OpenFgaDslThemeToken } from "../utilities/theme";

// Source for the code below:
// https://github.com/microsoft/monaco-editor/blob/main/src/basic-languages/python/python.ts

// This is exported as a function so that we can keep referencing monaco as just a type rather than loading it directly,
// thus keeping it as a dev dependency for those who do not want to use it
export function getLanguageConfiguration(monaco: typeof MonacoEditor): MonacoEditor.languages.LanguageConfiguration {
  return {
    comments: {
      lineComment: "#",
    },
    brackets: [
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "[", close: "]" },
      { open: "(", close: ")" },
    ],
    surroundingPairs: [
      { open: "[", close: "]" },
      { open: "(", close: ")" },
    ],
    onEnterRules: [
      {
        beforeText: new RegExp("^\\s*(?:type|relations|model|define).*?:\\s*$"),
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

  keywords: [],
  operators: [],

  identifiers: new RegExp(/(?:\w|-[a-zA-Z])*/),

  brackets: [
    { open: "[", close: "]", token: OpenFgaDslThemeToken.DELIMITER_BRACKET_TYPE_RESTRICTIONS },
    { open: "(", close: ")", token: OpenFgaDslThemeToken.DELIMITER_BRACKET_RELATION_DEFINITION },
  ],

  typeRestrictionsDelimiters: [
    { open: "[", close: "]", token: OpenFgaDslThemeToken.DELIMITER_BRACKET_TYPE_RESTRICTIONS },
    [new RegExp(/,/), OpenFgaDslThemeToken.DELIMITER_BRACKET_RELATION_DEFINITION],
  ],

  tokenizer: {
    root: [
      { include: "@whitespace" },

      [new RegExp(/[:]/), OpenFgaDslThemeToken.DELIMITER_DEFINE_COLON],
      [new RegExp(/[{}[\]()]/), "@brackets"],

      [new RegExp(/@[a-zA-Z]\w*/), "tag"],

      [
        new RegExp(/(schema)(\s+)(\d\.\d)/),
        [OpenFgaDslThemeToken.KEYWORD_SCHEMA, "@whitespace", OpenFgaDslThemeToken.VALUE_SCHEMA],
      ],
      [
        new RegExp(/(type)(\s+)(@identifiers)/),
        [OpenFgaDslThemeToken.KEYWORD_TYPE, "@whitespace", OpenFgaDslThemeToken.VALUE_TYPE_NAME],
      ],
      [
        new RegExp(/(define)(\s+)(@identifiers)/),
        [OpenFgaDslThemeToken.KEYWORD_DEFINE, "@whitespace", OpenFgaDslThemeToken.VALUE_RELATION_NAME],
      ],
      [
        new RegExp(/(or)(\s+)(@identifiers)/),
        [OpenFgaDslThemeToken.OPERATOR_OR, "@whitespace", OpenFgaDslThemeToken.VALUE_RELATION_COMPUTED],
      ],
      [
        new RegExp(/(and)(\s+)(@identifiers)/),
        [OpenFgaDslThemeToken.OPERATOR_AND, "@whitespace", OpenFgaDslThemeToken.VALUE_RELATION_COMPUTED],
      ],
      [
        new RegExp(/(but not)(\s+)(@identifiers)/),
        [OpenFgaDslThemeToken.OPERATOR_BUT_NOT, "@whitespace", OpenFgaDslThemeToken.VALUE_RELATION_COMPUTED],
      ],
      [
        new RegExp(/(@identifiers)(\s+)(from)(\s+)(@identifiers)/),
        [
          OpenFgaDslThemeToken.VALUE_RELATION_TUPLE_TO_USERSET_COMPUTED,
          "@whitespace",
          OpenFgaDslThemeToken.KEYWORD_FROM,
          "@whitespace",
          OpenFgaDslThemeToken.VALUE_RELATION_TUPLE_TO_USERSET_TUPLESET,
        ],
      ],
      [
        new RegExp(/(@identifiers)(#)(@identifiers)/),
        [
          OpenFgaDslThemeToken.VALUE_TYPE_RESTRICTIONS_TYPE,
          OpenFgaDslThemeToken.DELIMITER_HASHTAG_TYPE_RESTRICTIONS,
          OpenFgaDslThemeToken.VALUE_TYPE_RESTRICTIONS_RELATION,
        ],
      ],
      [
        new RegExp(/(@identifiers)(:)(\*)/),
        [
          OpenFgaDslThemeToken.VALUE_TYPE_RESTRICTIONS_TYPE,
          OpenFgaDslThemeToken.DELIMITER_COLON_TYPE_RESTRICTIONS,
          OpenFgaDslThemeToken.VALUE_TYPE_RESTRICTIONS_WILDCARD,
        ],
      ],
      [new RegExp(/,/), OpenFgaDslThemeToken.DELIMITER_COMMA_TYPE_RESTRICTIONS],
      [new RegExp(/but\snot/), OpenFgaDslThemeToken.OPERATOR_BUT_NOT],
      [
        new RegExp(/@identifiers/),
        {
          cases: {
            [Keyword.AND]: OpenFgaDslThemeToken.OPERATOR_AND,
            [Keyword.OR]: OpenFgaDslThemeToken.OPERATOR_OR,
            [Keyword.TYPE]: OpenFgaDslThemeToken.KEYWORD_TYPE,
            [Keyword.RELATIONS]: OpenFgaDslThemeToken.KEYWORD_RELATIONS,
            [Keyword.DEFINE]: OpenFgaDslThemeToken.KEYWORD_DEFINE,
            [Keyword.FROM]: OpenFgaDslThemeToken.KEYWORD_FROM,
            [Keyword.AS]: OpenFgaDslThemeToken.KEYWORD_AS,
            [Keyword.SELF]: OpenFgaDslThemeToken.KEYWORD_SELF,
            [Keyword.MODEL]: OpenFgaDslThemeToken.KEYWORD_MODEL,
            [Keyword.SCHEMA]: { token: OpenFgaDslThemeToken.KEYWORD_SCHEMA },
            "@default": "identifier",
          },
        },
      ],
    ],

    // Deal with white space, including single and multi-line comments
    whitespace: [
      [new RegExp(/\s+/), "white"],
      [new RegExp(/(^(\s+#).*$)/), OpenFgaDslThemeToken.COMMENT],
      [new RegExp(/'''/), "string", "@endDocString"],
      [new RegExp(/"""/), "string", "@endDblDocString"],
    ],
    endDocString: [
      [new RegExp(/[^']+/), "string"],
      [new RegExp(/\\'/), "string"],
      [new RegExp(/'''/), "string", "@popall"],
      [new RegExp(/'/), "string"],
    ],
    endDblDocString: [
      [new RegExp(/[^"]+/), "string"],
      [new RegExp(/\\"/), "string"],
      [new RegExp(/"""/), "string", "@popall"],
      [new RegExp(/"/), "string"],
    ],
  },
};
