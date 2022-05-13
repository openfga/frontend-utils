import { friendlySyntaxToApiSyntax } from "../src";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { testModels } from "./data";

describe("friendly-to-api", () => {
  testModels.forEach(testCase => {
    it(`should transform ${testCase.name}`, () => {
      const apiSyntax = friendlySyntaxToApiSyntax(testCase.friendly);
      expect(apiSyntax).toEqual(testCase.json);
    });
  });
});
