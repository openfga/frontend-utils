import { tools } from "../src";
import { MonacoEditor } from "../src/tools/monaco/typings";

const { MonacoExtensions } = tools;
const { validateDSL } = MonacoExtensions;

const MonacoErrorSeverityShim = { MarkerSeverity: { Error: 8 } } as typeof MonacoEditor;

// @ts-ignore
import { validation_cases } from "./data/model-validation";

describe("DSL validation", () => {
  validation_cases.forEach((testCase) => {
    it(`should validate ${testCase.name}`, () => {
      const result = validateDSL(MonacoErrorSeverityShim, testCase.friendly);
      expect(result).toEqual(testCase.expectedError);
    });
  });
});
