// import * as MonacoEditor from "monaco-editor";
import * as assert from "assert";

import * as MonacoEditor from "monaco-editor";
import { LANGUAGE_NAME } from "../../src/constants";
import { getLanguageConfiguration, language } from "../../src/syntax-highlighters/monaco/language-definition";

// Source: https://github.com/microsoft/monaco-editor/blob/44a956cb423a2873f800a03fc29a2e3d45d6dd34/src/basic-languages/test/testRunner.ts

export interface IRelaxedToken {
  startIndex: number;
  type: string;
}

export interface ITestItem {
  line: string;
  tokens: IRelaxedToken[];
}

function loadOpenFgaLanguage() {
  MonacoEditor.languages.register({ id: LANGUAGE_NAME });
  MonacoEditor.languages.setLanguageConfiguration(LANGUAGE_NAME, getLanguageConfiguration(MonacoEditor));
  MonacoEditor.languages.setMonarchTokensProvider(LANGUAGE_NAME, language);
}

function runTest(languageId: string, test: ITestItem[]): void {
  const text = test.map((t) => t.line).join("\n");
  const actualTokens = MonacoEditor.editor.tokenize(text, languageId);
  const actual = actualTokens.map((lineTokens, index) => {
    return {
      line: test[index].line,
      tokens: lineTokens.map((t) => {
        return {
          startIndex: t.offset,
          type: t.type,
        };
      }),
    };
  });

  assert.deepStrictEqual(actual, test);
}

function runTests(languageId: string, tests: ITestItem[][]): void {
  tests.forEach((test) => runTest(languageId, test));
}

function testTokenization(tests: ITestItem[][]): void {
  loadOpenFgaLanguage();
  test(`${LANGUAGE_NAME} tokenization`, async () => {
    runTests(LANGUAGE_NAME, tests);
  });
}

testTokenization([
  // Keywords
  [
    {
      line: "type user",
      tokens: [
        { startIndex: 0, type: "keyword.openfga" },
        { startIndex: 5, type: "type.openfga" },
      ],
    },
  ],
]);
