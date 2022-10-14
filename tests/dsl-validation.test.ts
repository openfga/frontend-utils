import { checkDSL } from "../src";
import { validation_cases } from "./data/model-validation";

describe("DSL validation", () => {
  validation_cases.forEach((testCase) => {
    it(`should validate ${testCase.name}`, () => {
      const result = checkDSL(testCase.friendly);
      expect(result).toEqual(testCase.expectedError);
    });
  });
});
