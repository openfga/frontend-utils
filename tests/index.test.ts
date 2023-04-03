import { apiSyntaxToFriendlySyntax, friendlySyntaxToApiSyntax } from "../src";

describe("friendlySyntaxToApiSyntax()", () => {
  describe("invalid syntax", () => {
    it("should throw if syntax is incorrect", () => {
      expect(() => {
        friendlySyntaxToApiSyntax(`model
  schema 1.0
t ype t1`);
      }).toThrowError();
    });

    it("should throw if syntax is incorrect", () => {
      expect(() => {
        friendlySyntaxToApiSyntax(`model
  schema 1.0
type test
  relations
    define writer as self and a but not test`);
      }).toThrowError();
    });

    it("should throw if syntax is incorrect", () => {
      expect(() => {
        friendlySyntaxToApiSyntax(`model
  schema 1.0
type test
  relations
    define writer as self and pepe or test `);
      }).toThrowError();
    });
  });

  it("should correctly read from `basic` definition", () => {
    const result = friendlySyntaxToApiSyntax(`model
  schema 1.0
type t1
  relations
    define r1 as self
`);

    const typeDf = result.type_definitions![0];
    const relations = typeDf.relations;

    expect(result.type_definitions).toHaveLength(1);
    expect(typeDf).toHaveProperty("type", "t1");
    expect(typeDf).toHaveProperty("relations");
    expect(relations).toHaveProperty("r1", { this: {} });
    expect(result).toMatchSnapshot();
  });

  it("should be able to handle single character type", () => {
    const result = friendlySyntaxToApiSyntax(`model
  schema 1.0
type t
  relations
    define r as self
`);

    const typeDf = result.type_definitions![0];
    const relations = typeDf.relations;

    expect(result.type_definitions).toHaveLength(1);
    expect(typeDf).toHaveProperty("type", "t");
    expect(typeDf).toHaveProperty("relations");
    expect(relations).toHaveProperty("r", { this: {} });
    expect(result).toMatchSnapshot();
  });

  it("should correctly read from `and` definition", () => {
    const result = friendlySyntaxToApiSyntax(`model
  schema 1.0
type t1
  relations
    define r1 as self and writer
`);

    const typeDf = result.type_definitions![0];
    const relations = typeDf.relations;
    const relation = relations!.r1;

    expect(result.type_definitions).toHaveLength(1);

    expect(typeDf).toHaveProperty("type", "t1");
    expect(typeDf).toHaveProperty("relations");

    expect(relations).toHaveProperty("r1");
    expect(relation).toHaveProperty("intersection");

    expect(relation.intersection).toHaveProperty("child");
    expect(relation.intersection!.child).toHaveLength(2);
    expect(relation.intersection!.child![0]).toEqual({ this: {} });
    expect(relation.intersection!.child![1]).toEqual({ computedUserset: { object: "", relation: "writer" } });
    expect(result).toMatchSnapshot();
  });

  it("should correctly read from `and` definition with $ as prefix", () => {
    const result = friendlySyntaxToApiSyntax(`model
  schema 1.0
type $t1
  relations
    define $r1 as self and $writer
`);

    const typeDf = result.type_definitions![0];
    const relations = typeDf.relations;
    const relation = relations!.$r1;

    expect(result.type_definitions).toHaveLength(1);

    expect(typeDf).toHaveProperty("type", "$t1");
    expect(typeDf).toHaveProperty("relations");
    expect(relations).toHaveProperty("$r1");
    expect(relation).toHaveProperty("intersection");

    expect(relation.intersection).toHaveProperty("child");
    expect(relation.intersection!.child).toHaveLength(2);
    expect(relation.intersection!.child![0]).toEqual({ this: {} });
    expect(relation.intersection!.child![1]).toEqual({ computedUserset: { object: "", relation: "$writer" } });
    expect(result).toMatchSnapshot();
  });

  it("should correctly read from `or` definition", () => {
    const result = friendlySyntaxToApiSyntax(`model
  schema 1.0
type t1
  relations
    define r1 as self or writer
`);

    const typeDf = result.type_definitions![0];
    const relations = typeDf.relations;
    const relation = relations!.r1;

    expect(result.type_definitions).toHaveLength(1);

    expect(typeDf).toHaveProperty("type", "t1");
    expect(typeDf).toHaveProperty("relations");

    expect(relations).toHaveProperty("r1");
    expect(relation).toHaveProperty("union");

    expect(relation.union).toHaveProperty("child");
    expect(relation.union!.child).toHaveLength(2);
    expect(relation.union!.child![0]).toEqual({ this: {} });
    expect(relation.union!.child![1]).toEqual({ computedUserset: { object: "", relation: "writer" } });
    expect(result).toMatchSnapshot();
  });

  it("should correctly read from `but not` definition", () => {
    const result = friendlySyntaxToApiSyntax(`model
  schema 1.0
type t1
  relations
    define r1 as self but not writer
`);
    const typeDef = result.type_definitions![0];
    const relations = typeDef.relations;
    const relation = relations!.r1;

    expect(result.type_definitions).toHaveLength(1);

    expect(typeDef).toHaveProperty("type", "t1");
    expect(typeDef).toHaveProperty("relations");

    expect(relations).toHaveProperty("r1");
    expect(relation).toHaveProperty("difference");

    expect(relation.difference!.base).toHaveProperty("this", {});
    expect(relation.difference!.subtract).toHaveProperty("computedUserset", { object: "", relation: "writer" });
    expect(result).toMatchSnapshot();
  });

  it("should correctly read from `from` definition", () => {
    const result = friendlySyntaxToApiSyntax(`model
  schema 1.0
type t1
  relations
    define share as owner from parent
`);

    expect(result.type_definitions).toHaveLength(1);
    expect(result).toMatchSnapshot();
  });

  it("should read a complex definition 1", () => {
    const result = friendlySyntaxToApiSyntax(`model
  schema 1.0
type folder
  relations
    define deleter as self
type doc
  relations
    define blocked_reader as self
    define delete as writer and deleter from parent
    define glass as writer
    define parent as self
    define read as reader or writer
    define reader as shared_reader but not blocked_reader
    define shared_reader as self
    define writer as self
    define creator as self
    define admin as self or creator
`);

    expect(result).toMatchSnapshot();
  });

  it("should read a complex definition 2", () => {
    const result = friendlySyntaxToApiSyntax(`model
  schema 1.0
type website
  relations
    define admin as self or owner
    define billing as self or admin
    define content_editor as self or admin
    define owner as self
    define viewer as self or admin or content_editor or billing
    define viewer as self and admin and content_editand and billing
`);

    expect(result).toMatchSnapshot();
  });

  it("should read a complex definition 3", () => {
    const result = friendlySyntaxToApiSyntax(`model
  schema 1.0
type website
  relations
    define admin as self or randy
    define billing as self or admin
    define content_editor as self or admin
    define randy as self
    define viewer as self or admin or content_editor or billing`);

    expect(result).toMatchSnapshot();
  });
});

describe("apiSyntaxToFriendlySyntax", () => {
  it("should correctly read from `basic` definition", () => {
    const result = apiSyntaxToFriendlySyntax({
      type_definitions: [
        {
          type: "t1",
          relations: {
            r1: {
              this: {},
            },
          },
        },
      ],
    });

    expect(result).toMatchSnapshot();
  });

  it("should correctly read from `and` definition", () => {
    const result = apiSyntaxToFriendlySyntax({
      type_definitions: [
        {
          type: "t1",
          relations: {
            r1: {
              intersection: {
                child: [
                  {
                    this: {},
                  },
                  {
                    computedUserset: {
                      object: "",
                      relation: "writer",
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    });

    expect(result).toMatchSnapshot();
  });

  it("should correctly read from `or` definition", () => {
    const result = apiSyntaxToFriendlySyntax({
      type_definitions: [
        {
          type: "t1",
          relations: {
            r1: {
              union: {
                child: [
                  {
                    this: {},
                  },
                  {
                    computedUserset: {
                      object: "",
                      relation: "writer",
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    });

    expect(result).toMatchSnapshot();
  });

  it("should correctly read from `but not` definition", () => {
    const result = apiSyntaxToFriendlySyntax({
      type_definitions: [
        {
          type: "t1",
          relations: {
            r1: {
              difference: {
                base: {
                  this: {},
                },
                subtract: {
                  computedUserset: {
                    object: "",
                    relation: "writer",
                  },
                },
              },
            },
          },
        },
      ],
    });

    expect(result).toMatchSnapshot();
  });

  it("should read a complex definition 4", () => {
    const result = apiSyntaxToFriendlySyntax({
      type_definitions: [
        {
          type: "folder",
          relations: {
            deleter: {
              this: {},
            },
          },
        },
        {
          type: "doc",
          relations: {
            blocked_reader: {
              this: {},
            },
            delete: {
              intersection: {
                child: [
                  {
                    computedUserset: {
                      object: "",
                      relation: "writer",
                    },
                  },
                  {
                    tupleToUserset: {
                      computedUserset: {
                        object: "",
                        relation: "deleter",
                      },
                      tupleset: {
                        object: "",
                        relation: "parent",
                      },
                    },
                  },
                ],
              },
            },
            glass: {
              computedUserset: {
                object: "",
                relation: "writer",
              },
            },
            parent: {
              this: {},
            },
            read: {
              union: {
                child: [
                  {
                    computedUserset: {
                      object: "",
                      relation: "reader",
                    },
                  },
                  {
                    computedUserset: {
                      object: "",
                      relation: "writer",
                    },
                  },
                ],
              },
            },
            reader: {
              difference: {
                base: {
                  computedUserset: {
                    object: "",
                    relation: "shared_reader",
                  },
                },
                subtract: {
                  computedUserset: {
                    object: "",
                    relation: "blocked_reader",
                  },
                },
              },
            },
            shared_reader: {
              this: {},
            },
            writer: {
              this: {},
            },
          },
        },
      ],
    });

    expect(result).toMatchSnapshot();
  });
});
