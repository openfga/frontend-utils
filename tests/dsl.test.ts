import { checkDSL } from "../src";
import { parseDSL } from "../src/parse-dsl";

describe("DSL", () => {
  describe("parseDSL()", () => {
    it("should throw if the code is incomplete", () => {
      expect(() => {
        parseDSL("type group");
      }).toThrowError();
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

      it("should allow self reference", () => {
        const markers = checkDSL(`type group
  relations
    define member as self or member from member`);
        expect(markers).toMatchSnapshot();
      });

      it("should not allow impossible self reference", () => {
        const markers = checkDSL(`type group
  relations
    define member as member from member`);
        expect(markers).toMatchSnapshot();
      });
    });
  });
});
