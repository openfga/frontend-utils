import type * as MonacoEditor from "monaco-editor";

import { Keyword } from "../../constants/keyword";
import { LANGUAGE_NAME } from "../../constants";
import { OpenFgaDslThemeToken } from "../../theme";

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
      ["{", "}"],
    ],
    autoClosingPairs: [
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "{", close: "}" },
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

  identifiers: new RegExp(/(?!self)(?:\w|-[a-zA-Z])*/),

  brackets: [
    { open: "[", close: "]", token: OpenFgaDslThemeToken.DELIMITER_BRACKET_TYPE_RESTRICTIONS },
    { open: "(", close: ")", token: OpenFgaDslThemeToken.DELIMITER_BRACKET_RELATION_DEFINITION },
    { open: "{", close: "}", token: OpenFgaDslThemeToken.DELIMITER_BRACKET_CONDITION_EXPRESSION },
  ],

  tokenizer: {
    root: [
      { include: "@comment" },
      { include: "@whitespace" },

      [new RegExp(/(\[)/), "@brackets", "@restrictions"],

      [new RegExp(/(\{)/), "@brackets", "@cel_symbols"],

      [new RegExp(/[{}[\]()]/), "@brackets"],

      [
        new RegExp(/(schema)(\s+)(\d\.\d)/),
        [OpenFgaDslThemeToken.KEYWORD_SCHEMA, "@whitespace", OpenFgaDslThemeToken.VALUE_SCHEMA],
      ],
      [
        new RegExp(/(module)(\s+)(@identifiers)/),
        [OpenFgaDslThemeToken.KEYWORD_MODULE, "@whitespace", OpenFgaDslThemeToken.VALUE_MODULE],
      ],
      [
        new RegExp(/(extend)(\s+)(type)(\s+)(@identifiers)/),
        [
          OpenFgaDslThemeToken.KEYWORD_EXTEND,
          "@whitespace",
          OpenFgaDslThemeToken.KEYWORD_TYPE,
          "@whitespace",
          OpenFgaDslThemeToken.VALUE_TYPE_NAME,
        ],
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
        new RegExp(/(as)(\s+)(@identifiers)/),
        [OpenFgaDslThemeToken.KEYWORD_AS, "@whitespace", OpenFgaDslThemeToken.VALUE_RELATION_COMPUTED],
      ],
      [
        new RegExp(/(:)(\s+)(@identifiers)/),
        [OpenFgaDslThemeToken.DELIMITER_DEFINE_COLON, "@whitespace", OpenFgaDslThemeToken.VALUE_RELATION_COMPUTED],
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
        new RegExp(/(@identifiers)(\s*)(:)(\s*)(@identifiers)(<@identifiers>)(,?)(\s*)/),
        [
          OpenFgaDslThemeToken.CONDITION_PARAM,
          "@whitespace",
          OpenFgaDslThemeToken.DELIMITER_COLON_CONDITION_PARAM,
          "@whitespace",
          OpenFgaDslThemeToken.CONDITION_PARAM_TYPE,
          OpenFgaDslThemeToken.CONDITION_PARAM_TYPE,
          OpenFgaDslThemeToken.DELIMITER_COMMA_CONDITION_PARAM,
          "@whitespace",
        ],
      ],
      [
        new RegExp(/(@identifiers)(\s*)(:)(\s*)(@identifiers)(,?)(\s*)/),
        [
          OpenFgaDslThemeToken.CONDITION_PARAM,
          "@whitespace",
          OpenFgaDslThemeToken.DELIMITER_COLON_CONDITION_PARAM,
          "@whitespace",
          OpenFgaDslThemeToken.CONDITION_PARAM_TYPE,
          OpenFgaDslThemeToken.DELIMITER_COMMA_CONDITION_PARAM,
          "@whitespace",
        ],
      ],
      [
        new RegExp(/(condition)(\s*)(@identifiers)(\s*)(\()/),
        [
          OpenFgaDslThemeToken.KEYWORD_CONDITION,
          "@whitespace",
          OpenFgaDslThemeToken.VALUE_CONDITION,
          "@whitespace",
          "@brackets",
        ],
      ],

      [":", OpenFgaDslThemeToken.DELIMITER_DEFINE_COLON],
      [",", OpenFgaDslThemeToken.DELIMITER_COMMA_TYPE_RESTRICTIONS],
      [Keyword.BUT_NOT, OpenFgaDslThemeToken.OPERATOR_BUT_NOT],
      [Keyword.SELF, OpenFgaDslThemeToken.KEYWORD_SELF],
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
            [Keyword.WITH]: OpenFgaDslThemeToken.KEYWORD_WITH,
            [Keyword.CONDITION]: OpenFgaDslThemeToken.KEYWORD_CONDITION,
            [Keyword.AS]: OpenFgaDslThemeToken.KEYWORD_AS,
            [Keyword.MODEL]: OpenFgaDslThemeToken.KEYWORD_MODEL,
            [Keyword.SCHEMA]: { token: OpenFgaDslThemeToken.KEYWORD_SCHEMA },
            // TODO: This should be "identifier", however because tupleset was not properly
            //  detected with the rules above, this is the quickiest hacky fix we can do to
            //  get it out there for people to use
            "@default": OpenFgaDslThemeToken.VALUE_RELATION_TUPLE_TO_USERSET_TUPLESET,
          },
        },
      ],
    ],

    cel_symbols: [
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      [/(\w|-[a-zA-Z])+/, OpenFgaDslThemeToken.CONDITION_SYMBOL],
      [/(<|<=|>=|>|=|!=|&&|\|\||\.|null|in)/, OpenFgaDslThemeToken.CONDITION_SYMBOL],
      [/\[|\]|\(|\)/, "@brackets"],
      [/\}/, "@brackets", "@pop"],
    ],

    string_double: [
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"],
    ],

    string_single: [
      [/[^\\']+/, "string"],
      [/\\./, "string.escape.invalid"],
      [/'/, "string", "@pop"],
    ],

    restrictions: [
      { include: "@whitespace" },
      [new RegExp(`${Keyword.WITH}`), OpenFgaDslThemeToken.KEYWORD_WITH],
      [/(\w|-[a-zA-Z])+/, OpenFgaDslThemeToken.VALUE_TYPE_RESTRICTIONS_TYPE],
      [
        /(:)(\*)/,
        [OpenFgaDslThemeToken.DELIMITER_COLON_TYPE_RESTRICTIONS, OpenFgaDslThemeToken.VALUE_TYPE_RESTRICTIONS_WILDCARD],
      ],
      [/#/, OpenFgaDslThemeToken.DELIMITER_HASHTAG_TYPE_RESTRICTIONS],
      [/,/, OpenFgaDslThemeToken.DELIMITER_COMMA_TYPE_RESTRICTIONS],
      [/\]/, "@brackets", "@pop"],
    ],

    // Deal with white space, including comments
    whitespace: [[new RegExp(/\s+/), "white"]],
    comment: [
      [new RegExp(/\s+(#.*)/), OpenFgaDslThemeToken.COMMENT],
      [new RegExp(/^\s*(#.*)/), OpenFgaDslThemeToken.COMMENT],
    ],
  },
};
