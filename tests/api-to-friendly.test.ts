import { apiSyntaxToFriendlySyntax } from "../src";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { testModels } from "./data";

describe("api-to-friendly", () => {
  testModels.forEach((testCase) => {
    it(`should transform ${testCase.name}`, () => {
      const friendlySyntax = apiSyntaxToFriendlySyntax(testCase.json);
      expect(friendlySyntax).toEqual(testCase.friendly);
    });
  });

  it("Having no relations should still yield correct DSL", () => {
    const friendlySyntax = apiSyntaxToFriendlySyntax({ type_definitions: [{ type: "user" }] });
    const expectedOutput = "type user\n";
    expect(friendlySyntax).toEqual(expectedOutput);
  });
});
