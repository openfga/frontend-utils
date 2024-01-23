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
        message: "a type cannot be named 'self' or 'this'.",
        extraInformation: {
          error: "reserved-type-keywords",
        },
        severity: 8,
        source: "ModelValidationError",
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
        message: "a type cannot be named 'self' or 'this'.",
        extraInformation: {
          error: "reserved-type-keywords",
        },
        severity: 8,
        source: "ModelValidationError",
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
        message: "a relation cannot be named 'self' or 'this'.",
        extraInformation: {
          error: "reserved-relation-keywords",
        },
        severity: 8,
        source: "ModelValidationError",
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
        message: "a relation cannot be named 'self' or 'this'.",
        extraInformation: {
          error: "reserved-relation-keywords",
        },
        severity: 8,
        source: "ModelValidationError",
        startColumn: 12,
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
          "type 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' does not match naming rule: '^[^:#@\\s]{1,254}$'.",
        extraInformation: {
          error: "invalid-name",
        },
        severity: 8,
        source: "ModelValidationError",
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
          "relation 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' of type 'org' does not match naming rule: '^[^:#@\\s]{1,50}$'.",
        extraInformation: {
          error: "invalid-name",
        },
        severity: 8,
        source: "ModelValidationError",
        startColumn: 12,
        startLineNumber: 6,
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
        message: "`viewer` is an impossible relation for `team` (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
        startColumn: 12,
        startLineNumber: 7,
      },
      {
        endColumn: 18,
        endLineNumber: 11,
        message: "`viewer` is an impossible relation for `group` (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
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
        message: "`group` is an impossible relation for `group` (no entrypoint).",
        extraInformation: {
          relation: "group",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
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
        message: "`viewer` is an impossible relation for `group` (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
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
        message: "`viewer` is an impossible relation for `group` (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
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
        source: "ModelValidationError",
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
          error: "invalid-type",
          typeName: "unknown",
        },
        severity: 8,
        source: "ModelValidationError",
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
        source: "ModelValidationError",
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
        source: "ModelValidationError",
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
        source: "ModelValidationError",
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
        message: "`viewer` is an impossible relation for `group` (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
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
        endColumn: 20,
        endLineNumber: 9,
        message: "missing ':' at 'as'",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 18,
        startLineNumber: 9,
      },
      {
        endColumn: 21,
        endLineNumber: 9,
        message: "mismatched input ' ' expecting {<EOF>, NEWLINE}",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 20,
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
        message: "`reader` is an impossible relation for `document` (potential loop).",
        extraInformation: {
          relation: "reader",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
        startColumn: 12,
        startLineNumber: 5,
      },
      {
        endColumn: 18,
        endLineNumber: 6,
        message: "`writer` is an impossible relation for `document` (potential loop).",
        extraInformation: {
          relation: "writer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
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
        source: "ModelValidationError",
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
        source: "ModelValidationError",
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
        source: "ModelValidationError",
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
        source: "ModelValidationError",
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
        message: "the relation `allowed` does not exist.",
        extraInformation: {
          relation: "allowed",
          error: "missing-definition",
        },
        severity: 8,
        source: "ModelValidationError",
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
        message: "the relation `allowed` does not exist.",
        extraInformation: {
          relation: "allowed",
          error: "missing-definition",
        },
        severity: 8,
        source: "ModelValidationError",
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
        message: "the relation `allowed` does not exist.",
        extraInformation: {
          relation: "allowed",
          error: "missing-definition",
        },
        severity: 8,
        source: "ModelValidationError",
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
        message: "the relation `allowed` does not exist.",
        extraInformation: {
          relation: "allowed",
          error: "missing-definition",
        },
        severity: 8,
        source: "ModelValidationError",
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
        message: "the relation `allowed` does not exist.",
        extraInformation: {
          relation: "allowed",
          error: "missing-definition",
        },
        severity: 8,
        source: "ModelValidationError",
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
        endColumn: 22,
        endLineNumber: 6,
        message: "extraneous input ']' expecting {IDENTIFIER, NEWLINE}",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 21,
        startLineNumber: 6,
      },
      {
        endColumn: 10,
        endLineNumber: 7,
        extraInformation: {},
        message: "mismatched input 'define' expecting IDENTIFIER",
        severity: 8,
        source: "SyntaxError",
        startColumn: 4,
        startLineNumber: 7,
      },
      {
        endColumn: 17,
        endLineNumber: 7,
        extraInformation: {},
        message: "mismatched input 'reader' expecting {',', ']'}",
        severity: 8,
        source: "SyntaxError",
        startColumn: 11,
        startLineNumber: 7,
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
        endColumn: 21,
        endLineNumber: 6,
        message: "extraneous input ']' expecting {WHITESPACE, IDENTIFIER, NEWLINE}",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 20,
        startLineNumber: 6,
      },
      {
        endColumn: 10,
        endLineNumber: 7,
        extraInformation: {},
        message: "mismatched input 'define' expecting IDENTIFIER",
        severity: 8,
        source: "SyntaxError",
        startColumn: 4,
        startLineNumber: 7,
      },
      {
        endColumn: 17,
        endLineNumber: 7,
        extraInformation: {},
        message: "mismatched input 'reader' expecting {',', ']'}",
        severity: 8,
        source: "SyntaxError",
        startColumn: 11,
        startLineNumber: 7,
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
        endColumn: 50,
        endLineNumber: 9,
        message: "mismatched input ':' expecting {',', WHITESPACE, ']'}",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 49,
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
        message: "mismatched input '0.9' expecting '1.1'",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 9,
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
        endColumn: 12,
        endLineNumber: 2,
        message: "mismatched input '1.0' expecting '1.1'",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 9,
        startLineNumber: 2,
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
        endColumn: 20,
        endLineNumber: 7,
        message: "missing ':' at 'as'",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 18,
        startLineNumber: 7,
      },
      {
        endColumn: 21,
        endLineNumber: 7,
        message: "mismatched input ' ' expecting {<EOF>, NEWLINE}",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 20,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "model 1.0 should not be allowed",
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
        endColumn: 12,
        endLineNumber: 2,
        message: "mismatched input '1.0' expecting '1.1'",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 9,
        startLineNumber: 2,
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
        endColumn: 20,
        endLineNumber: 7,
        message: "missing ':' at 'as'",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 18,
        startLineNumber: 7,
      },
      {
        endColumn: 21,
        endLineNumber: 7,
        message: "mismatched input ' ' expecting {<EOF>, NEWLINE}",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 20,
        startLineNumber: 7,
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
        endColumn: 4,
        endLineNumber: 1,
        message: "extraneous input 'type' expecting {WHITESPACE, '#', 'model', NEWLINE}",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 0,
        startLineNumber: 1,
      },
      {
        endColumn: 9,
        endLineNumber: 1,
        message: "extraneous input 'user' expecting {'#', 'model', NEWLINE}",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 5,
        startLineNumber: 1,
      },
      {
        endColumn: 4,
        endLineNumber: 2,
        message: "mismatched input 'type' expecting {'#', 'model'}",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 0,
        startLineNumber: 2,
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
        endColumn: 33,
        endLineNumber: 6,
        message: "mismatched input ':' expecting {',', WHITESPACE, ']'}",
        extraInformation: {},
        severity: 8,
        source: "SyntaxError",
        startColumn: 32,
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
        endColumn: 19,
        endLineNumber: 7,
        message: "`action1` is an impossible relation for `doc` (potential loop).",
        extraInformation: {
          relation: "action1",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
        startColumn: 12,
        startLineNumber: 7,
      },
      {
        endColumn: 19,
        endLineNumber: 8,
        message: "`action2` is an impossible relation for `doc` (potential loop).",
        extraInformation: {
          relation: "action2",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
        startColumn: 12,
        startLineNumber: 8,
      },
      {
        endColumn: 19,
        endLineNumber: 9,
        message: "`action3` is an impossible relation for `doc` (potential loop).",
        extraInformation: {
          relation: "action3",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
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
        endColumn: 19,
        endLineNumber: 7,
        message: "`action1` is an impossible relation for `doc` (potential loop).",
        extraInformation: {
          relation: "action1",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
        startColumn: 12,
        startLineNumber: 7,
      },
      {
        endColumn: 19,
        endLineNumber: 8,
        message: "`action2` is an impossible relation for `doc` (potential loop).",
        extraInformation: {
          relation: "action2",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
        startColumn: 12,
        startLineNumber: 8,
      },
      {
        endColumn: 19,
        endLineNumber: 9,
        message: "`action3` is an impossible relation for `doc` (potential loop).",
        extraInformation: {
          relation: "action3",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
        startColumn: 12,
        startLineNumber: 9,
      },
    ],
  },
  {
    name: "intersection child not allow to reference itself in TTU",
    friendly: `model
  schema 1.1
type user
type document
  relations
    define editor: [user]
    define viewer: [document#viewer] and editor
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 7,
        message: "`viewer` is an impossible relation for `document` (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
        startColumn: 12,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "exclusion base not allow to reference itself in TTU",
    friendly: `model
  schema 1.1
type user
type document
  relations
    define editor: [user]
    define viewer: [document#viewer] but not editor
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 7,
        message: "`viewer` is an impossible relation for `document` (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
        startColumn: 12,
        startLineNumber: 7,
      },
    ],
  },
  {
    name: "detect loop in TTU dependency",
    friendly: `model
  schema 1.1
type folder
  relations
    define parent: [document]
    define viewer: viewer from parent
type document
  relations
    define parent: [folder]
    define viewer: viewer from parent
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 6,
        message: "`viewer` is an impossible relation for `folder` (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
        startColumn: 12,
        startLineNumber: 6,
      },
      {
        endColumn: 18,
        endLineNumber: 10,
        message: "`viewer` is an impossible relation for `document` (no entrypoint).",
        extraInformation: {
          relation: "viewer",
          error: "relation-no-entry-point",
        },
        severity: 8,
        source: "ModelValidationError",
        startColumn: 12,
        startLineNumber: 10,
      },
    ],
  },
  // The following are valid cases and should not result in error
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
        source: "ModelValidationError",
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
        source: "ModelValidationError",
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
        source: "ModelValidationError",
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
        source: "ModelValidationError",
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
  {
    name: "union child allow to reference itself in TTU",
    friendly: `model
  schema 1.1
type user
type document
  relations
    define editor: [user]
    define viewer: [document#viewer] or editor
`,
    expectedError: [],
  },
  {
    name: "mixture of relations from relations for same type",
    friendly: `model
  schema 1.1
type user

type document
  relations
    define restricted: [user]
    define editor: [user]
    define viewer: [document#viewer] or editor
    define can_view: viewer but not restricted
    define can_view_actual: can_view
`,
    expectedError: [],
  },
  {
    name: "self reference with wildcard",
    friendly: `model
  schema 1.1
type user

type document
  relations
    define parent: [document, document:*]
    define viewer: [user] or viewer from parent
`,
    expectedError: [
      {
        endColumn: 10,
        endLineNumber: 8,
        extraInformation: {
          error: "type-wildcard-relation",
        },
        message: "type restriction `document:*` cannot contain both wildcard and relation",
        severity: 8,
        source: "ModelValidationError",
        startColumn: 0,
        startLineNumber: 8,
      },
    ],
  },
];
