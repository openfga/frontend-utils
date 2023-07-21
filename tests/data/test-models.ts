import {AuthorizationModel} from "../../src/transformer/authzmodel.types";
import { loadTransformerTestCases } from "../../src/language/pkg/js/transformer/_testcases";

export const testModels: { name: string; json: AuthorizationModel; dsl: string }[] = [
  {
    name: "union for 1.1",
    json: {
      schema_version: "1.1",
      type_definitions: [
        {
          type: "user",
          relations: {},
          metadata: null as any,
        },
        {
          type: "document",
          relations: {
            can_write: {
              computedUserset: {
                object: "",
                relation: "writer",
              },
            },
            can_delete: {
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
                      tupleset: {
                        object: "",
                        relation: "owner",
                      },
                      computedUserset: {
                        object: "",
                        relation: "member",
                      },
                    },
                  },
                ],
              },
            },
            owner: {
              this: {},
            },
            reader: {
              union: {
                child: [
                  {
                    this: {},
                  },
                  {
                    computedUserset: {
                      object: "",
                      relation: "owner",
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
            writer: {
              union: {
                child: [
                  {
                    this: {},
                  },
                  {
                    computedUserset: {
                      object: "",
                      relation: "owner",
                    },
                  },
                ],
              },
            },
          },
          metadata: {
            relations: {
              can_write: { directly_related_user_types: [] },
              can_delete: { directly_related_user_types: [] },
              owner: { directly_related_user_types: [{ type: "user" }] },
              reader: { directly_related_user_types: [{ type: "user" }] },
              writer: { directly_related_user_types: [{ type: "user" }] },
            },
          },
        },
        {
          type: "organization",
          relations: {
            member: {
              this: {},
            },
          },
          metadata: {
            relations: {
              member: { directly_related_user_types: [{ type: "user" }] },
            },
          },
        },
      ],
    },
    dsl: `model
  schema 1.1

type user

type document
  relations
    define can_write: writer
    define can_delete: writer and member from owner
    define owner: [user]
    define reader: [user] or owner or writer
    define writer: [user] or owner

type organization
  relations
    define member: [user]
`,
  },
  {
    name: "intersection for 1.1",
    json: {
      schema_version: "1.1",
      type_definitions: [
        {
          type: "user",
          relations: {},
          metadata: null as any,
        },
        {
          type: "document",
          relations: {
            allowed: {
              this: {},
            },
            member: {
              this: {},
            },
            reader: {
              intersection: {
                child: [
                  {
                    this: {},
                  },
                  {
                    computedUserset: {
                      object: "",
                      relation: "member",
                    },
                  },
                  {
                    computedUserset: {
                      object: "",
                      relation: "allowed",
                    },
                  },
                ],
              },
            },
            writer: {
              intersection: {
                child: [
                  {
                    this: {},
                  },
                  {
                    computedUserset: {
                      object: "",
                      relation: "member",
                    },
                  },
                ],
              },
            },
          },
          metadata: {
            relations: {
              allowed: { directly_related_user_types: [{ type: "user" }] },
              member: { directly_related_user_types: [{ type: "user" }] },
              reader: { directly_related_user_types: [{ type: "user" }] },
              writer: { directly_related_user_types: [{ type: "user" }] },
            },
          },
        },
      ],
    },
    dsl: `model
  schema 1.1

type user

type document
  relations
    define allowed: [user]
    define member: [user]
    define reader: [user] and member and allowed
    define writer: [user] and member
`,
  },
  {
    name: "difference for model 1.1",
    json: {
      schema_version: "1.1",
      type_definitions: [
        {
          type: "document",
          relations: {
            blocked: {
              this: {},
            },
            editor: {
              difference: {
                base: {
                  this: {},
                },
                subtract: {
                  computedUserset: {
                    object: "",
                    relation: "blocked",
                  },
                },
              },
            },
          },
          metadata: {
            relations: {
              blocked: { directly_related_user_types: [{ type: "user" }] },
              editor: { directly_related_user_types: [{ type: "user" }] },
            },
          },
        },
        {
          type: "user",
          relations: {},
          metadata: null as any,
        },
      ],
    },
    dsl: `model
  schema 1.1

type document
  relations
    define blocked: [user]
    define editor: [user] but not blocked

type user
`,
  },
  {
    name: "one type with one relation that supports one type",
    json: {
      schema_version: "1.1",
      type_definitions: [
        {
          type: "document",
          relations: {
            viewer: {
              this: {},
            },
          },
          metadata: {
            relations: {
              viewer: { directly_related_user_types: [{ type: "team", relation: "member" }] },
            },
          },
        },
      ],
    },
    dsl: `model
  schema 1.1

type document
  relations
    define viewer: [team#member]
`,
  },
  {
    name: "one type with one relation that supports two types",
    json: {
      schema_version: "1.1",
      type_definitions: [
        {
          type: "document",
          relations: {
            viewer: {
              this: {},
            },
          },
          metadata: {
            relations: {
              viewer: { directly_related_user_types: [{ type: "user" }, { type: "group" }] },
            },
          },
        },
      ],
    },
    dsl: `model
  schema 1.1

type document
  relations
    define viewer: [user, group]
`,
  },
  {
    name: "wildcard restriction conversion",
    json: {
      schema_version: "1.1",
      type_definitions: [
        {
          type: "document",
          relations: {
            viewer: {
              this: {},
            },
          },
          metadata: {
            relations: {
              viewer: {
                directly_related_user_types: [{ type: "user" }, { type: "user", wildcard: {} }, { type: "group" }],
              },
            },
          },
        },
      ],
    },
    dsl: `model
  schema 1.1

type document
  relations
    define viewer: [user, user:*, group]
`,
  },
];

testModels.push(...(loadTransformerTestCases().map(testCase => ({
  ...testCase,
  json: JSON.parse(testCase.json),
}))));