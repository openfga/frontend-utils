import { WriteAuthorizationModelRequest } from "@openfga/sdk";

export const testModels: { name: string; json: WriteAuthorizationModelRequest; friendly: string }[] = [
  {
    name: "one type with no relations",
    json: {
      schema_version: "1.0",
      type_definitions: [
        {
          type: "document",
          relations: {},
        },
      ],
    },
    friendly: "type document\n",
  },
  {
    name: "one type with no relations and another with one relation",
    json: {
      schema_version: "1.0",
      type_definitions: [
        {
          type: "group",
          relations: {},
        },
        {
          type: "document",
          relations: {
            viewer: {
              this: {},
            },
            editor: {
              this: {},
            },
          },
        },
      ],
    },
    friendly: "type group\ntype document\n  relations\n    define viewer as self\n    define editor as self\n",
  },
  {
    name: "simple model",
    json: {
      schema_version: "1.0",
      type_definitions: [
        {
          type: "document",
          relations: {
            viewer: {
              this: {},
            },
            editor: {
              this: {},
            },
          },
        },
      ],
    },
    friendly: "type document\n  relations\n    define viewer as self\n    define editor as self\n",
  },
  {
    name: "multiple types",
    json: {
      schema_version: "1.0",
      type_definitions: [
        {
          type: "folder",
          relations: {
            editor: {
              this: {},
            },
          },
        },
        {
          type: "document",
          relations: {
            parent: {
              this: {},
            },
            editor: {
              union: {
                child: [
                  {
                    this: {},
                  },
                  {
                    tupleToUserset: {
                      tupleset: {
                        object: "",
                        relation: "parent",
                      },
                      computedUserset: {
                        object: "",
                        relation: "editor",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
    friendly: `type folder
  relations
    define editor as self
type document
  relations
    define parent as self
    define editor as self or editor from parent
`,
  },
  {
    name: "difference",
    json: {
      schema_version: "1.0",
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
        },
        {
          type: "team",
          relations: {
            member: {
              this: {},
            },
          },
        },
      ],
    },
    friendly: `type document
  relations
    define blocked as self
    define editor as self but not blocked
type team
  relations
    define member as self
`,
  },
  {
    name: "intersection",
    json: {
      schema_version: "1.0",
      type_definitions: [
        {
          type: "document",
          relations: {
            owner: {
              this: {},
            },
            writer: {
              this: {},
            },
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
          },
        },
        {
          type: "organization",
          relations: {
            member: {
              this: {},
            },
          },
        },
      ],
    },
    friendly: `type document
  relations
    define owner as self
    define writer as self
    define can_write as writer
    define can_delete as writer and member from owner
type organization
  relations
    define member as self
`,
  },
  {
    name: "union for 1.1",
    json: {
      schema_version: "1.1",
      type_definitions: [
        {
          type: "user",
          relations: {},
        },
        {
          type: "document",
          relations: {
            owner: {
              this: {},
            },
            writer: {
              union: {
                child: [
                  {
                    computedUserset: {
                      object: "",
                      relation: "owner",
                    },
                  },
                  {
                    this: {},
                  },
                ],
              },
            },
            reader: {
              union: {
                child: [
                  {
                    computedUserset: {
                      object: "",
                      relation: "owner",
                    },
                  },
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
          },
          metadata: {
            relations: {
              owner: { directly_related_user_types: [{ type: "user" }] },
              writer: { directly_related_user_types: [{ type: "user" }] },
              reader: { directly_related_user_types: [{ type: "user" }] },
              can_write: { directly_related_user_types: [] },
              can_delete: { directly_related_user_types: [] },
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
    friendly: `model
  schema 1.1
type user
type document
  relations
    define owner: [user]
    define writer: owner or [user]
    define reader: owner or [user] or writer
    define can_write: writer
    define can_delete: writer and member from owner
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
            writer: {
              intersection: {
                child: [
                  {
                    computedUserset: {
                      object: "",
                      relation: "member",
                    },
                  },
                  {
                    this: {},
                  },
                ],
              },
            },
            reader: {
              intersection: {
                child: [
                  {
                    computedUserset: {
                      object: "",
                      relation: "member",
                    },
                  },
                  {
                    this: {},
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
          },
          metadata: {
            relations: {
              allowed: { directly_related_user_types: [{ type: "user" }] },
              member: { directly_related_user_types: [{ type: "user" }] },
              writer: { directly_related_user_types: [{ type: "user" }] },
              reader: { directly_related_user_types: [{ type: "user" }] },
            },
          },
        },
      ],
    },
    friendly: `model
  schema 1.1
type user
type document
  relations
    define allowed: [user]
    define member: [user]
    define writer: member and [user]
    define reader: member and [user] and allowed
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
        },
      ],
    },
    friendly: `model
  schema 1.1
type document
  relations
    define blocked: [user]
    define editor: [user] but not blocked
type user
`,
  },
  {
    name: "relations-starting-with-as",
    json: {
      schema_version: "1.0",
      type_definitions: [
        { type: "org", relations: { member: { this: {} } } },
        {
          type: "feature",
          relations: {
            associated_plan: { this: {} },
            access: {
              tupleToUserset: {
                tupleset: { object: "", relation: "associated_plan" },
                computedUserset: { object: "", relation: "subscriber_member" },
              },
            },
          },
        },
        {
          type: "plan",
          relations: {
            subscriber: { this: {} },
            subscriber_member: {
              tupleToUserset: {
                tupleset: { object: "", relation: "subscriber" },
                computedUserset: { object: "", relation: "member" },
              },
            },
          },
        },
        {
          type: "permission",
          relations: {
            access_feature: {
              tupleToUserset: {
                tupleset: {
                  object: "",
                  relation: "associated_feature",
                },
                computedUserset: { object: "", relation: "access" },
              },
            },
            associated_feature: { this: {} },
          },
        },
      ],
    },
    friendly: `type org
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
    define associated_feature as self
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
    friendly: `model
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
    friendly: `model
  schema 1.1
type document
  relations
    define viewer: [user,group]
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
    friendly: `model
  schema 1.1
type document
  relations
    define viewer: [user,user:*,group]
`,
  },
];
