import { checkDSL } from "../src";
import { parseDSL } from "../src/parse-dsl";
import { ValidationOptions } from "../src/check-dsl";

describe("DSL", () => {
  describe("parseDSL()", () => {
    it("should correctly parse a type with no relations", () => {
      const result = parseDSL("type group");

      expect(result).toMatchSnapshot();
    });

    it("should correctly parse a simple sample", () => {
      const result = parseDSL(`type group
  relations
    define writer as self`);

      expect(result).toMatchSnapshot();
    });

    it("should correctly parse a complex sample", () => {
      const result = parseDSL(`type team
  relations
    define member as self

type repo
  relations
    define admin as self or repo_admin from owner
    define maintainer as self or admin
    define owner as self
    define reader as self or triager or repo_reader from owner
    define triager as self or writer
    define writer as self or maintainer or repo_writer from owner

type org
  relations
    define billing_manager as self or owner
    define member as self or owner
    define owner as self
    define repo_admin as self
    define repo_reader as self
    define repo_writer as self

type app
  relations
    define app_manager as self or owner from owner
    define owner as self`);

      expect(result).toMatchSnapshot();
    });
  });

  describe("checkDSL()", () => {
    it("should correctly parse a simple sample", () => {
      const markers = checkDSL(`type group
  relations
    define member as self

type document
  relations
    define writer as self
    define reader as writer or self
    define commenter as member from writer
    define owner as writer
    define super as reader but not member from writer`);

      expect(markers).toMatchSnapshot();
    });

    describe("invalid code", () => {
      it("should handle `no relations`", () => {
        const markers = checkDSL("type group");
        expect(markers).toMatchSnapshot();
      });

      it("should handle `no definitions`", () => {
        const markers = checkDSL(`type group
  relations`);
        expect(markers).toMatchSnapshot();
      });
    });

    describe("invalid keywords", () => {
      it("should handle invalid `self`", () => {
        const markers = checkDSL(`type group
  relations
    define writer as se lf`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle invalid `as`", () => {
        const markers = checkDSL(`type group
  relations
    define writer a s self`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle invalid `define`", () => {
        const markers = checkDSL(`type group
  relations
    dec lare writer as self`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle invalid `as`", () => {
        const markers = checkDSL(`type group
  relations
    define writer a s self`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle invalid `or`", () => {
        const markers = checkDSL(`type group
  relations
    define reader as self
    define writer as self o r reader`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle invalid `and`", () => {
        const markers = checkDSL(`type group
  relations
    define reader as self
    define writer as self an d reader`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle invalid `but not`", () => {
        const markers = checkDSL(`type group
  relations
    define reader as self
    define writer as self but no t reader`);
        expect(markers).toMatchSnapshot();
      });
    });

    describe("semantics", () => {
      it("should handle invalid `self-error`", () => {
        const markers = checkDSL(`type group
  relations
    define writer as writer`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle invalid `relation not define`", () => {
        const markers = checkDSL(`type group
  relations
    define writer as reader`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle invalid `relation not define` where name is substring of other word", () => {
        const markers = checkDSL(`type group
  relations
    define writer as def`);
        expect(markers).toMatchSnapshot();
      });

      it("should identify correct error line number if there are spaces", () => {
        const markers = checkDSL(`type group
  relations

    define owner as self
    define writer as reader`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle invalid `self-ref in but not`", () => {
        const markers = checkDSL(`type group
  relations
    define writer as self but not writer`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle invalid `invalid but not`", () => {
        const markers = checkDSL(`type group
  relations
    define writer as self but not reader`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle invalid `invalid from`", () => {
        const markers = checkDSL(`type group
  relations
    define writer as self or reader from test`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle invalid `invalid or`", () => {
        const markers = checkDSL(`type group
  relations
    define writer as self or reader`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle invalid `invalid and`", () => {
        const markers = checkDSL(`type group
  relations
    define writer as self and reader`);
        expect(markers).toMatchSnapshot();
      });

      it("should handle duplicated definition", () => {
        const markers = checkDSL(`type group
  relations
    define writer as self
    define writer as self`);
        expect(markers).toMatchSnapshot();
      });

      it("should be able to handle more than one error", () => {
        const markers = checkDSL(`type group
  relations
    define writer as writer
    define hi as self
    define relation as relation2 from relation2
    define domain as domain from domain but not domain`);
        expect(markers).toMatchSnapshot();
      });

      it("should allow reference from other relation", () => {
        const markers = checkDSL(`type group
  relations
    define foo as self
    define member as self or member from foo`);
        expect(markers).toMatchSnapshot();
      });

      it("should allow self reference", () => {
        const markers = checkDSL(`type group
  relations
    define member as self or member from member`);
        expect(markers).toMatchSnapshot();
      });

      it("should allow same relation name in from", () => {
        const markers = checkDSL(`type feature
  relations
    define associated_plan as self
    define subscriber as subscriber from associated_plan`);
        expect(markers).toMatchSnapshot();
      });

      it("should not allow self reference in from relation", () => {
        const markers = checkDSL(`type feature
  relations
    define associated_plan as self
    define subscriber as associated_plan from subscriber`);
        expect(markers).toMatchSnapshot();
      });

      it("should not allow impossible self reference", () => {
        const markers = checkDSL(`type group
  relations
    define member as member from member`);
        expect(markers).toMatchSnapshot();
      });

      it("should allow model with relations starting with as", () => {
        const markers = checkDSL(`type org
  relations
    define member as self
type feature
  relations
    define associated_plan as self
    define access as subscriber_member from associated_plan
type plan
  relations
    define subscriber as self
    define subscriber_member as member from subscriber
type permission
  relations
    define access_feature as access from associated_feature
    define associated_feature as self`);
        expect(markers).toMatchSnapshot();
      });

      it("should gracefully handle error", () => {
        const markers = checkDSL(`type group
  relations
    define member as self
    define admin as self

    define can_add as can_manage_group
    define can_edit as can_manage_group
    define can_delete as can_manage_group
    define can_read as can_manage

    define can_manage_group as admin
    define can_manage_users as admin
    define can_view_group as admin or member
    define can_view_users as admin or member

    def`);
        expect(markers).toMatchSnapshot();
      });

      it("should gracefully handle type regex error", () => {
        const incorrectRegex: ValidationOptions = {
          typeValidation: "[a-Z",
        };
        const markers = checkDSL(
          `type user
`,
          incorrectRegex,
        );
        const expectError: any = [
          {
            endColumn: 9007199254740991,
            endLineNumber: 2,
            message: "Incorrect type regex specification for [a-Z",
            severity: 8,
            source: "linter",
            startColumn: 0,
            startLineNumber: 0,
          },
        ];
        expect(markers).toEqual(expectError);
      });

      it("should gracefully handle relation regex error", () => {
        const incorrectRegex: ValidationOptions = {
          relationValidation: "[a-Z",
        };
        const markers = checkDSL(
          `type user
`,
          incorrectRegex,
        );
        const expectError: any = [
          {
            endColumn: 9007199254740991,
            endLineNumber: 2,
            message: "Incorrect relation regex specification for [a-Z",
            severity: 8,
            source: "linter",
            startColumn: 0,
            startLineNumber: 0,
          },
        ];
        expect(markers).toEqual(expectError);
      });
    });
  });
});
