import { apiSyntaxToFriendlySyntax } from "../src";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { testModels } from "./data";

describe("api-to-friendly", () => {
  testModels.forEach((testCase) => {
    it(`should transform ${testCase.name}`, () => {
      const friendlySyntax = apiSyntaxToFriendlySyntax(testCase.json);
      expect(friendlySyntax).toEqual(testCase.dsl);
    });
  });

  it("Having no relations should still yield correct DSL", () => {
    const friendlySyntax = apiSyntaxToFriendlySyntax({ schema_version: "1.1", type_definitions: [{ type: "user" }] });
    const expectedOutput = "model\n  schema 1.1\n\ntype user\n";
    expect(friendlySyntax).toEqual(expectedOutput);
  });
});
