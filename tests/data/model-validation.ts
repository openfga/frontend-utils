/* eslint-disable max-len */
export const validation_cases: { name: string; friendly: string; expectedError: any }[] = [
  {
    name: "invalid type name for self",
    friendly: `model
  schema 1.1
type user
type self
  relations
    define member: [user]
`,
    expectedError: [
      {
        endColumn: 10,
        endLineNumber: 4,
        message: "A type cannot be named 'self' or 'this'.",
        extraInformation: {
          error: "reserved-type-keywords",
        },
        severity: 8,
        source: "linter",
        startColumn: 6,
        startLineNumber: 4,
      },
    ],
  },
  {
    name: "invalid type name for this",
    friendly: `model
  schema 1.1
type user
type this
  relations
    define member: [user]
`,
    expectedError: [
      {
        endColumn: 10,
        endLineNumber: 4,
        message: "A type cannot be named 'self' or 'this'.",
        extraInformation: {
          error: "reserved-type-keywords",
        },
        severity: 8,
        source: "linter",
        startColumn: 6,
        startLineNumber: 4,
      },
    ],
  },
  {
    name: "invalid relation name for self",
    friendly: `model
  schema 1.1
type user
type group
  relations
    define self: [user]
`,
    expectedError: [
      {
        endColumn: 16,
        endLineNumber: 6,
        message: "A relation cannot be named 'self' or 'this'.",
        extraInformation: {
          error: "reserved-relation-keywords",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 6,
      },
    ],
  },
  {
    name: "invalid relation name for this",
    friendly: `model
  schema 1.1
type user
type group
  relations
    define this: [user]
`,
    expectedError: [
      {
        endColumn: 16,
        endLineNumber: 6,
        message: "A relation cannot be named 'self' or 'this'.",
        extraInformation: {
          error: "reserved-relation-keywords",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 6,
      },
    ],
  },
  {
    name: "cannot use this in mode 1.0",
    friendly: `model
  schema 1.0
type document
  relations
    define editor as self
    define viewer as editor or this
`,
    expectedError: [
      {
        endColumn: 36,
        endLineNumber: 6,
        message: "The relation `this` does not exist.",
        extraInformation: {
          relation: "this",
          error: "missing-definition",
        },
        severity: 8,
        source: "linter",
        startColumn: 32,
        startLineNumber: 6,
      },
    ],
  },
  {
    name: "invalid type name",
    friendly: `model
  schema 1.1
type user
type aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  relations
    define member: [user]
`,
    expectedError: [
      {
        endColumn: 350,
        endLineNumber: 4,
        message:
          "Type 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' does not match naming rule: '^[^:#@\\s]{1,254}$'.",
        extraInformation: {
          error: "invalid-name",
        },
        severity: 8,
        source: "linter",
        startColumn: 6,
        startLineNumber: 4,
      },
    ],
  },
  {
    name: "invalid relation name",
    friendly: `model
  schema 1.1
type user
type org
  relations
    define aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: [user]
`,
    expectedError: [
      {
        endColumn: 112,
        endLineNumber: 6,
        message:
          "Relation 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' of type 'org' does not match naming rule: '^[^:#@\\s]{1,50}$'.",
        extraInformation: {
          error: "invalid-name",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 6,
      },
    ],
  },
  {
    name: "ensure errors are highlighted in the right place for same relation name across different types",
    friendly: `model
  schema 1.0
type user
type geography
  relations
    define parent as self
    define can_view_locations as self or can_view_locations from parent

type outlet
  relations
    define geography as self
    define can_view_locations as self or can_view_locations from parent
`,
    expectedError: [
      {
        endColumn: 72,
        endLineNumber: 12,
        message: "The relation `parent` does not exist in type `outlet`",
        extraInformation: {
          error: "invalid-syntax",
        },
        severity: 8,
        source: "linter",
        startColumn: 66,
        startLineNumber: 12,
      },
    ],
  },
  {
    name: "no entry point for multiple type",
    friendly: `model
  schema 1.1
type user
type team
  relations
    define parent: [group]
    define viewer: viewer from parent
type group
  relations
    define parent: [team]
    define viewer: viewer from parent
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 7,
        message: "`viewer` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 7,
      },
      {
        endColumn: 18,
        endLineNumber: 11,
        message: "`viewer` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 11,
      },
    ],
  },
  {
    name: "no entry point for single type single relation",
    friendly: `model
  schema 1.1
type user
type group
  relations
    define group: group from group
`,
    expectedError: [
      {
        endColumn: 17,
        endLineNumber: 6,
        message: "`group` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "group",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 6,
      },
    ],
  },
  {
    name: "no entry point for single type multiple relations",
    friendly: `model
  schema 1.1
type user
type group
  relations
    define parent: [group]
    define viewer: viewer from parent
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 7,
        message: "`viewer` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "no entry point if directly assignable value is itself",
    friendly: `model
  schema 1.1
type group
  relations
    define viewer: [group#viewer]
 `,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 5,
        message: "`viewer` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 5,
      },
    ],
  },
  {
    name: "from target relation is valid",
    friendly: `model
  schema 1.1
type user
type group
  relations
    define parent: [group]
    define viewer: reader from parent
`,
    expectedError: [
      {
        endColumn: 38,
        endLineNumber: 7,
        message: "`reader` is not a valid relation for `group`.",
        extraInformation: {
          relation: "reader",
          error: "invalid-relation-type",
          typeName: "group",
        },
        severity: 8,
        source: "linter",
        startColumn: 20,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "invalid type is used",
    friendly: `model
  schema 1.1
type user
type group
  relations
    define parent: [unknown]
`,
    expectedError: [
      {
        endColumn: 28,
        endLineNumber: 6,
        message: "`unknown` is not a valid type.",
        extraInformation: {
          error: "invalid-relation-type",
          typeName: "unknown",
        },
        severity: 8,
        source: "linter",
        startColumn: 21,
        startLineNumber: 6,
      },
    ],
  },
  {
    name: "from target relation is not a valid relation for the from child",
    friendly: `model
  schema 1.1
type user
type org
type group
  relations
    define parent: [group]
    define viewer: viewer from org
`,
    expectedError: [
      {
        endColumn: 35,
        endLineNumber: 8,
        message: "`org` is not a valid relation for `group`.",
        extraInformation: {
          relation: "org",
          error: "invalid-relation-type",
          typeName: "group",
        },
        severity: 8,
        source: "linter",
        startColumn: 20,
        startLineNumber: 8,
      },
    ],
  },
  {
    name: "org is not a relation for group",
    friendly: `model
  schema 1.1
type user
type org
type group
  relations
    define parent: [group]
    define viewer: org from parent
`,
    expectedError: [
      {
        endColumn: 35,
        endLineNumber: 8,
        message: "`org` is not a valid relation for `group`.",
        extraInformation: {
          relation: "org",
          error: "invalid-relation-type",
          typeName: "group",
        },
        severity: 8,
        source: "linter",
        startColumn: 20,
        startLineNumber: 8,
      },
    ],
  },
  {
    name: "direct relation assignment not found",
    friendly: `model
  schema 1.1
type user
type org
type group
  relations
    define parent: [group, group#org]
`,
    expectedError: [
      {
        endColumn: 37,
        endLineNumber: 7,
        message: "`org` is not a valid relation for `group`.",
        extraInformation: {
          relation: "org",
          error: "invalid-relation-type",
          typeName: "group",
        },
        severity: 8,
        source: "linter",
        startColumn: 28,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "group viewer no entry point",
    friendly: `model
  schema 1.1
type user
type org
  relations
    define viewer: [user]
type group
  relations
    define parent: [group]
    define viewer: viewer from parent
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 10,
        message: "`viewer` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 10,
      },
    ],
  },
  {
    // TODO: discuss whether parent is impossible as well
    name: "mixture of 1.0 and 1.1 should yield error",
    friendly: `model
  schema 1.1
type user
type org
  relations
    define member: [user]
type group
  relations
    define parent as self
    define viewer as viewer from parent
`,
    expectedError: [
      {
        endColumn: 25,
        endLineNumber: 9,
        message: "Invalid syntax",
        severity: 8,
        source: "linter",
        startColumn: 19,
        startLineNumber: 9,
      },
    ],
  },
  {
    name: "cyclic loop",
    friendly: `model
  schema 1.1
type document
  relations
    define reader: writer
    define writer: reader
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 5,
        message: "`reader` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "reader",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 5,
      },
      {
        endColumn: 18,
        endLineNumber: 6,
        message: "`writer` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "writer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 6,
      },
    ],
  },
  {
    name: "parent relation used inside contains a write",
    friendly: `model
  schema 1.1
type user
type folder
  relations
    define parent: [folder] or parent from parent
    define viewer: [user] or viewer from parent
`,
    expectedError: [
      {
        endColumn: 50,
        endLineNumber: 6,
        message: "`parent` relation used inside from allows only direct relation.",
        extraInformation: {
          relation: "parent",
          error: "tupleuset-not-direct",
        },
        severity: 8,
        source: "linter",
        startColumn: 44,
        startLineNumber: 6,
      },
      {
        endColumn: 48,
        endLineNumber: 7,
        message: "`parent` relation used inside from allows only direct relation.",
        extraInformation: {
          relation: "parent",
          error: "tupleuset-not-direct",
        },
        severity: 8,
        source: "linter",
        startColumn: 42,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "parent relation used inside viewer contains a write",
    friendly: `model
  schema 1.1
type user
type folder
  relations
    define root: [folder]
    define parent: [folder] or root
    define viewer: [user] or viewer from parent
`,
    expectedError: [
      {
        endColumn: 48,
        endLineNumber: 8,
        message: "`parent` relation used inside from allows only direct relation.",
        extraInformation: {
          relation: "parent",
          error: "tupleuset-not-direct",
        },
        severity: 8,
        source: "linter",
        startColumn: 42,
        startLineNumber: 8,
      },
    ],
  },
  {
    name: "from is another tuple to userset",
    friendly: `model
  schema 1.1
type user
type folder
  relations
    define root: [folder]
    define parent: [folder, folder#parent]
    define viewer: [user] or viewer from parent
`,
    expectedError: [
      {
        endColumn: 48,
        endLineNumber: 8,
        message: "`parent` relation used inside from allows only direct relation.",
        extraInformation: {
          relation: "parent",
          error: "tupleuset-not-direct",
        },
        severity: 8,
        source: "linter",
        startColumn: 42,
        startLineNumber: 8,
      },
    ],
  },
  {
    name: "model 1.1 one of the intersection relation is not valid",
    friendly: `model
  schema 1.1
type user
type group
  relations
    define member: [user]
    define reader: member and allowed
`,
    expectedError: [
      {
        endColumn: 38,
        endLineNumber: 7,
        message: "The relation `allowed` does not exist.",
        extraInformation: {
          relation: "allowed",
          error: "missing-definition",
        },
        severity: 8,
        source: "linter",
        startColumn: 31,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "model 1.1 one of the union relation is not valid",
    friendly: `model
  schema 1.1
type user
type group
  relations
    define member: [user]
    define reader: member or allowed
`,
    expectedError: [
      {
        endColumn: 37,
        endLineNumber: 7,
        message: "The relation `allowed` does not exist.",
        extraInformation: {
          relation: "allowed",
          error: "missing-definition",
        },
        severity: 8,
        source: "linter",
        startColumn: 30,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "model 1.1 base in exclusion not valid",
    friendly: `model
  schema 1.1
type user
type group
  relations
    define member: [user]
    define reader: allowed but not member
`,
    expectedError: [
      {
        endColumn: 27,
        endLineNumber: 7,
        message: "The relation `allowed` does not exist.",
        extraInformation: {
          relation: "allowed",
          error: "missing-definition",
        },
        severity: 8,
        source: "linter",
        startColumn: 20,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "model 1.1 diff in exclusion not valid",
    friendly: `model
  schema 1.1
type user
type group
  relations
    define member: [user]
    define reader: member but not allowed
`,
    expectedError: [
      {
        endColumn: 42,
        endLineNumber: 7,
        message: "The relation `allowed` does not exist.",
        extraInformation: {
          relation: "allowed",
          error: "missing-definition",
        },
        severity: 8,
        source: "linter",
        startColumn: 35,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "model 1.1 diff in exclusion not valid and spaces are reflected correctly in error messages",
    friendly: `model
  schema 1.1
type user
type group
  relations
    define member: [user]
    define reader   : member   but not   allowed
`,
    expectedError: [
      {
        endColumn: 49,
        endLineNumber: 7,
        message: "The relation `allowed` does not exist.",
        extraInformation: {
          relation: "allowed",
          error: "missing-definition",
        },
        severity: 8,
        source: "linter",
        startColumn: 42,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "empty directly assignable relations with spaces should yield error",
    friendly: `model
  schema 1.1
type user
type org
  relations
    define member: [ ]
    define reader: [user]
`,
    expectedError: [
      {
        endColumn: 23,
        endLineNumber: 6,
        message: "Assignable relation 'member' must have types",
        extraInformation: {
          error: "assignable-relation-must-have-type",
        },
        severity: 8,
        source: "linter",
        startColumn: 20,
        startLineNumber: 6,
      },
    ],
  },
  {
    name: "empty directly assignable relations without spaces should yield error",
    friendly: `model
  schema 1.1
type user
type org
  relations
    define member: []
    define reader: [user]
`,
    expectedError: [
      {
        endColumn: 22,
        endLineNumber: 6,
        message: "Assignable relation 'member' must have types",
        extraInformation: {
          error: "assignable-relation-must-have-type",
        },
        severity: 8,
        source: "linter",
        startColumn: 20,
        startLineNumber: 6,
      },
    ],
  },
  {
    name: "type restriction cannot contains both wildcard and relation",
    friendly: `model
  schema 1.1
type user
type department
  relations
    define member: [user]
type org
  relations
    define reader: [department, department#member:*]
  `,
    expectedError: [
      {
        endColumn: 52,
        endLineNumber: 9,
        message: "Type restriction 'department#member:*' cannot contain both wildcard and relation",
        extraInformation: {
          error: "type-wildcard-relation",
        },
        severity: 8,
        source: "linter",
        startColumn: 33,
        startLineNumber: 9,
      },
    ],
  },
  {
    name: "unsupported schema version should yield error",
    friendly: `model
  schema 0.9
type user
type org
  relations
    define member: [user]
`,
    expectedError: [
      {
        endColumn: 12,
        endLineNumber: 2,
        message: "Invalid syntax",
        severity: 8,
        source: "linter",
        startColumn: 10,
        startLineNumber: 2,
      },
    ],
  },
  {
    name: "model 1.0 should not have allowedType",
    friendly: `model
  schema 1.0
type user
type org
  relations
    define member: [user]
`,
    expectedError: [
      {
        endColumn: 25,
        endLineNumber: 6,
        message: "Invalid syntax",
        severity: 8,
        source: "linter",
        startColumn: 18,
        startLineNumber: 6,
      },
    ],
  },
  {
    name: "model 1.1 has no directly allowed types in viewer",
    friendly: `model
  schema 1.1
type user
type folder
  relations
    define parent: [folder]
    define viewer as self or viewer from parent
`,
    expectedError: [
      {
        endColumn: 47,
        endLineNumber: 7,
        message: "Invalid syntax",
        severity: 8,
        source: "linter",
        startColumn: 19,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "model 1.0 should not have directly allowed types in viewer",
    friendly: `model
  schema 1.0
type user
type folder
  relations
    define parent: [folder]
    define viewer: [user] or viewer from parent
`,
    expectedError: [
      {
        endColumn: 27,
        endLineNumber: 6,
        message: "Invalid syntax",
        severity: 8,
        source: "linter",
        startColumn: 18,
        startLineNumber: 6,
      },
    ],
  },
  {
    name: "mixing 1.0 and 1.1 should not be allowed as non assignable self is not allowed",
    friendly: `model
  schema 1.1
type user
type folder
  relations
    define reader: [user]
    define viewer as self or reader
`,
    expectedError: [
      {
        endColumn: 35,
        endLineNumber: 7,
        message: "Invalid syntax",
        severity: 8,
        source: "linter",
        startColumn: 19,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "syntax error is highlighted in the right spot",
    friendly: `model
  schema 1.0
type user
type group
  relations
    define group: [group] as self
`,
    expectedError: [
      {
        endColumn: 33,
        endLineNumber: 6,
        message: "Invalid syntax",
        severity: 8,
        source: "linter",
        startColumn: 17,
        startLineNumber: 6,
      },
    ],
  },

  {
    name: "should not allow no model schema",
    friendly: `type user
type group
  relations
    define group: [user] as self
`,
    expectedError: [
      {
        endColumn: 9,
        endLineNumber: 1,
        message: "Invalid syntax",
        severity: 8,
        source: "linter",
        startColumn: 1,
        startLineNumber: 1,
      },
    ],
  },
  {
    name: "incorrect wildcard restriction should be raised",
    friendly: `model
  schema 1.1
type user
type group
  relations
    define member: [user, user:*:*]
`,
    expectedError: [
      {
        endColumn: 35,
        endLineNumber: 6,
        message: "Invalid syntax",
        severity: 8,
        source: "linter",
        startColumn: 33,
        startLineNumber: 6,
      },
    ],
  },
  {
    name: "no entry point intersection that relates to itself",
    friendly: `model
  schema 1.1
type user
type doc
  relations
    define admin: [user]
    define action1: admin and action2 and action3
    define action2: admin and action3 and action1
    define action3: admin and action1 and action2
`,
    expectedError: [
      {
        endColumn: 19 ,
        endLineNumber: 7,
        message: "`action1` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "action1",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 7,
      },
      {
        endColumn: 19 ,
        endLineNumber: 8,
        message: "`action2` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "action2",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 8,
      },
      {
        endColumn: 19 ,
        endLineNumber: 9,
        message: "`action3` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "action3",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 9,
      },
    ],
  },
  {
    name: "no entry point exclusion that relates to itself",
    friendly: `model
  schema 1.1
type user
type doc
  relations
    define admin: [user]
    define action1: admin but not action2
    define action2: admin but not action3
    define action3: admin but not action1
`,
    expectedError: [
      {
        endColumn: 19 ,
        endLineNumber: 7,
        message: "`action1` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "action1",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 7,
      },
      {
        endColumn: 19 ,
        endLineNumber: 8,
        message: "`action2` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "action2",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 8,
      },
      {
        endColumn: 19 ,
        endLineNumber: 9,
        message: "`action3` is an impossible relation (no entrypoint).",
        extraInformation: {
          relation: "action3",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 9,
      },
    ],
  },
  // The following are valid cases and should not result in error
  {
    name: "simple model 1.0",
    friendly: `model
  schema 1.0
type user
type group
  relations
    define member as self
`,
    expectedError: [],
  },
  {
    name: "simple model where the model is explicit",
    friendly: `model
  schema 1.0
type user
type group
  relations
    define member as self
`,
    expectedError: [],
  },
  {
    name: "simple group reference to itself",
    friendly: `model
  schema 1.1
type user
type group
  relations
    define group: [group]
`,
    expectedError: [],
  },
  {
    name: "group has entry point to itself",
    friendly: `model
  schema 1.1
type user
type org
  relations
    define viewer: [user]
type group
  relations
    define parent: [group, org]
    define viewer: viewer from parent
`,
    expectedError: [],
  },
  {
    name: "intersection with directly related",
    friendly: `model
  schema 1.1
type user
type org
  relations
    define member: [user]
type group
  relations
    define parent: [group]
    define writer: [user, org#member]
    define viewer: [user, org#member] or writer
`,
    expectedError: [],
  },
  {
    name: "should allow directly assigned as last item",
    friendly: `model
  schema 1.1
type user
type org
  relations
    define member: [user]
type group
  relations
    define parent: [group]
    define writer: [user, org#member]
    define viewer: writer or [user, org#member]
`,
    expectedError: [],
  },
  {
    name: "union with directly related",
    friendly: `model
  schema 1.1
type user
type org
  relations
    define member: [user]
type group
  relations
    define parent: [group]
    define writer: [user, org#member]
    define viewer: [user, org#member] and writer
`,
    expectedError: [],
  },
  {
    name: "union allow directly assigned as last item",
    friendly: `model
  schema 1.1
type user
type org
  relations
    define member: [user]
type group
  relations
    define parent: [group]
    define writer: [user, org#member]
    define viewer: writer and [user, org#member]
`,
    expectedError: [],
  },
  {
    name: "but not with directly linked",
    friendly: `model
  schema 1.1
type user
type docs
  relations
    define blocked: [user]
    define can_view: [user] but not blocked
`,
    expectedError: [],
  },
  {
    name: "intersection with directly related and has spaces and blank lines",
    friendly: `model
  schema 1.1
type user
type org

  relations
    define member: [user]    

type group
  relations
    define parent: [group]
    define writer: [user, org#member]
    define viewer:    [   user,    org#member   ]       or    writer
`,
    expectedError: [],
  },
  {
    name: "model 1.0 does not assert impossible relation",
    friendly: `model
  schema 1.0
type user
type folder
  relations
    define parent as self
    define viewer as self or viewer from parent
`,
    expectedError: [],
  },
  {
    name: "model 1.1 tuple to userset",
    friendly: `model
  schema 1.1
type folder
  relations
    define viewer: [user]

type document
  relations
    define parent: [folder]
    define viewer: [user] or viewer from parent
type user
`,
    expectedError: [],
  },
  {
    name: "model 1.1 allow TTU with relations as long as 1 child has such relation",
    friendly: `model
  schema 1.1
type final
  relations
    define children: [child1, child2]
    define has_assigned: u1 from children or u2 from children
type child1
  relations
    define role: [user]
    define u1: role
type child2
  relations
    define role: [user]
    define u2: role
type user
    `,
    expectedError: [],
  },
  {
    name: "model 1.1 should raise error if none of the children has such relation",
    friendly: `model
  schema 1.1
type final
  relations
    define children: [child1, child2]
    define has_assigned: u3 from children or u2 from children
type child1
  relations
    define role: [user]
    define u1: role
type child2
  relations
    define role: [user]
    define u4: role
type user
    `,
    expectedError: [
      {
        endColumn: 42,
        endLineNumber: 6,
        extraInformation: {
          error: "invalid-relation-type",
          relation: "u3",
          typeName: "child1",
        },
        message: "`u3` is not a valid relation for `child1`.",
        severity: 8,
        source: "linter",
        startColumn: 26,
        startLineNumber: 6,
      },
      {
        endColumn: 42,
        endLineNumber: 6,
        extraInformation: {
          error: "invalid-relation-type",
          relation: "u3",
          typeName: "child2",
        },
        message: "`u3` is not a valid relation for `child2`.",
        severity: 8,
        source: "linter",
        startColumn: 26,
        startLineNumber: 6,
      },
      {
        endColumn: 62,
        endLineNumber: 6,
        extraInformation: {
          error: "invalid-relation-type",
          relation: "u2",
          typeName: "child1",
        },
        message: "`u2` is not a valid relation for `child1`.",
        severity: 8,
        source: "linter",
        startColumn: 46,
        startLineNumber: 6,
      },
      {
        endColumn: 62,
        endLineNumber: 6,
        extraInformation: {
          error: "invalid-relation-type",
          relation: "u2",
          typeName: "child2",
        },
        message: "`u2` is not a valid relation for `child2`.",
        severity: 8,
        source: "linter",
        startColumn: 46,
        startLineNumber: 6,
      },
    ],
  },
  {
    name: "model 1.1 wildcard restricted type",
    friendly: `model
  schema 1.1
type folder
  relations
    define viewer: [user, user:*]

type user
`,
    expectedError: [],
  },
  {
    name: "model 1.1 wildcard restricted type in the middle",
    friendly: `model
  schema 1.1
type folder
  relations
    define viewer: [user, user:*, group]

type user
type group
`,
    expectedError: [],
  },
  {
    name: "model 1.1 with spacing in allowed type",
    friendly: `model
  schema 1.1
type folder
  relations
    define viewer: [  user  , user:*  , group  ]

type user
type group
`,
    expectedError: [],
  },
  {
    name: "union does not require all child to have entry",
    friendly: `model
  schema 1.1
type user
type doc
  relations
    define admin: [user]
    define action1: admin or action2 or action3
    define action2: admin or action3 or action1
    define action3: admin or action1 or action2
`,
    expectedError: [],
  },
  {
    name: "union does not require all child to have entry even for intersection child",
    friendly: `model
  schema 1.1
type user
type docs
  relations
    define admin: [user]
    define union1: admin or union2
    define union2: admin or union1
    define intersection1: union1 and union2
    define intersection2: union1 and union2
`,
    expectedError: [],
  },
  {
    name: "union does not require all child to have entry even for exclusion child",
    friendly: `model
  schema 1.1
type user
type docs
  relations
    define admin: [user]
    define union1: admin or union2
    define union2: admin or union1
    define exclusion1: admin but not union1
    define exclusion2: admin but not union2
`,
    expectedError: [],
  },
];
