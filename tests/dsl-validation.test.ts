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
      const result = validateDSL(MonacoErrorSeverityShim, testCase.friendly).map((error: any) => {
        delete error.extraInformation;
        delete error.message;
        delete error.source;
        return error;
      });

      // TODO: Current language does not expose this information
      const expectedErrors = testCase.expectedError.map((expectedError: any) => {
        delete expectedError.extraInformation;
        delete expectedError.message;
        delete expectedError.source;
        return expectedError;
      });

      expect(result).toEqual(expectedErrors);
    });
  });
});
