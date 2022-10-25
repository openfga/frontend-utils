/* eslint-disable max-len */
export const validation_cases: { name: string; friendly: string; expectedError: any }[] = [
  {
    name: "invalid type name for self",
    friendly: `model
  schema 1.1
type user
type self
  relations
    define member: [user] as self
`,
    expectedError: [
      {
        endColumn: 10,
        endLineNumber: 4,
        message: "A type cannot be named 'self' or 'this'.",
        relatedInformation: {
          type: "reserved-type-keywords",
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
    define member: [user] as self
`,
    expectedError: [
      {
        endColumn: 10,
        endLineNumber: 4,
        message: "A type cannot be named 'self' or 'this'.",
        relatedInformation: {
          type: "reserved-type-keywords",
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
    define self: [user] as self
`,
    expectedError: [
      {
        endColumn: 16,
        endLineNumber: 6,
        message: "A relation cannot be named 'self' or 'this'.",
        relatedInformation: {
          type: "reserved-relation-keywords",
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
    define this: [user] as self
`,
    expectedError: [
      {
        endColumn: 16,
        endLineNumber: 6,
        message: "A relation cannot be named 'self' or 'this'.",
        relatedInformation: {
          type: "reserved-relation-keywords",
        },
        severity: 8,
        source: "linter",
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
    define member: [user] as self
`,
    expectedError: [
      {
        endColumn: 350,
        endLineNumber: 4,
        message:
          "Type 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' does not match naming rule: '^[^:#@\\s]{1,254}$'.",
        relatedInformation: {
          type: "invalid-name",
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
    define aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: [user] as self
`,
    expectedError: [
      {
        endColumn: 112,
        endLineNumber: 6,
        message:
          "Relation 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' of type 'org' does not match naming rule: '^[^:#@\\s]{1,50}$'.",
        relatedInformation: {
          type: "invalid-name",
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
    friendly: `type user
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
        endLineNumber: 10,
        message: "The relation `parent` does not exist in type `outlet`",
        relatedInformation: {
          type: "",
        },
        severity: 8,
        source: "linter",
        startColumn: 66,
        startLineNumber: 10,
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
    define parent: [group] as self
    define viewer as viewer from parent
type group
  relations
    define parent: [team] as self
    define viewer as viewer from parent
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 7,
        message: "`viewer` is an impossible relation (no entrypoint).",
        relatedInformation: {
          relation: "viewer",
          type: "relation-no-entry-point",
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
        relatedInformation: {
          relation: "viewer",
          type: "relation-no-entry-point",
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
    define group as group from group
`,
    expectedError: [
      {
        endColumn: 17,
        endLineNumber: 6,
        message: "`group` is an impossible relation (no entrypoint).",
        relatedInformation: {
          relation: "group",
          type: "relation-no-entry-point",
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
    define parent: [group] as self
    define viewer as viewer from parent
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 7,
        message: "`viewer` is an impossible relation (no entrypoint).",
        relatedInformation: {
          relation: "viewer",
          type: "relation-no-entry-point",
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
    define viewer: [group#viewer] as self
 `,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 5,
        message: "`viewer` is an impossible relation (no entrypoint).",
        relatedInformation: {
          relation: "viewer",
          type: "relation-no-entry-point",
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
    define parent: [group] as self
    define viewer as reader from parent
`,
    expectedError: [
      {
        endColumn: 40,
        endLineNumber: 7,
        message: "`reader` is not a valid relation for `group`.",
        relatedInformation: {
          relation: "reader",
          type: "invalid-relation-type",
          typeName: "group",
        },
        severity: 8,
        source: "linter",
        startColumn: 22,
        startLineNumber: 7,
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
    define parent: [group] as self
    define viewer as viewer from org
`,
    expectedError: [
      {
        endColumn: 37,
        endLineNumber: 8,
        message: "`org` is not a valid relation for `group`.",
        relatedInformation: {
          relation: "org",
          type: "invalid-relation-type",
          typeName: "group",
        },
        severity: 8,
        source: "linter",
        startColumn: 22,
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
    define parent: [group] as self
    define viewer as org from parent
`,
    expectedError: [
      {
        endColumn: 37,
        endLineNumber: 8,
        message: "`org` is not a valid relation for `group`.",
        relatedInformation: {
          relation: "org",
          type: "invalid-relation-type",
          typeName: "group",
        },
        severity: 8,
        source: "linter",
        startColumn: 22,
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
    define parent: [group, group#org] as self
`,
    expectedError: [
      {
        endColumn: 37,
        endLineNumber: 7,
        message: "`org` is not a valid relation for `group`.",
        relatedInformation: {
          relation: "org",
          type: "invalid-relation-type",
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
    define viewer: [user] as self
type group
  relations
    define parent: [group] as self
    define viewer as viewer from parent
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 10,
        message: "`viewer` is an impossible relation (no entrypoint).",
        relatedInformation: {
          relation: "viewer",
          type: "relation-no-entry-point",
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
    define member: [user] as self
type group
  relations
    define parent as self
    define viewer as viewer from parent
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 9,
        message: "`parent` is an impossible relation (no entrypoint).",
        relatedInformation: {
          relation: "parent",
          type: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 9,
      },
      {
        endColumn: 18,
        endLineNumber: 10,
        message: "`viewer` is an impossible relation (no entrypoint).",
        relatedInformation: {
          relation: "viewer",
          type: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 10,
      },
    ],
  },
  {
    name: "cyclic loop",
    friendly: `model
  schema 1.1
type document
  relations
    define reader as writer
    define writer as reader
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 5,
        message: "`reader` is an impossible relation (no entrypoint).",
        relatedInformation: {
          relation: "reader",
          type: "relation-no-entry-point",
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
        relatedInformation: {
          relation: "writer",
          type: "relation-no-entry-point",
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
    define parent: [folder] as self or parent from parent
    define viewer: [user] as self or viewer from parent
`,
    expectedError: [
      {
        endColumn: 58,
        endLineNumber: 6,
        message: "`parent` relation used inside from allows only direct relation.",
        relatedInformation: {
          relation: "parent",
          type: "tupleuset-not-direct",
        },
        severity: 8,
        source: "linter",
        startColumn: 52,
        startLineNumber: 6,
      },
      {
        endColumn: 56,
        endLineNumber: 7,
        message: "`parent` relation used inside from allows only direct relation.",
        relatedInformation: {
          relation: "parent",
          type: "tupleuset-not-direct",
        },
        severity: 8,
        source: "linter",
        startColumn: 50,
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
    define root: [folder] as self
    define parent: [folder] as self or root
    define viewer: [user] as self or viewer from parent
`,
    expectedError: [
      {
        endColumn: 56,
        endLineNumber: 8,
        message: "`parent` relation used inside from allows only direct relation.",
        relatedInformation: {
          relation: "parent",
          type: "tupleuset-not-direct",
        },
        severity: 8,
        source: "linter",
        startColumn: 50,
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
    define root: [folder] as self
    define parent: [folder, folder#parent] as self
    define viewer: [user] as self or viewer from parent
`,
    expectedError: [
      {
        endColumn: 56,
        endLineNumber: 8,
        message: "`parent` relation used inside from allows only direct relation.",
        relatedInformation: {
          relation: "parent",
          type: "tupleuset-not-direct",
        },
        severity: 8,
        source: "linter",
        startColumn: 50,
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
    define member: [user] as self
    define reader as member and allowed
`,
    expectedError: [
      {
        endColumn: 40,
        endLineNumber: 7,
        message: "The relation `allowed` does not exist.",
        relatedInformation: {
          relation: "allowed",
          type: "missing-definition",
        },
        severity: 8,
        source: "linter",
        startColumn: 33,
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
    define member: [user] as self
    define reader as member or allowed
`,
    expectedError: [
      {
        endColumn: 39,
        endLineNumber: 7,
        message: "The relation `allowed` does not exist.",
        relatedInformation: {
          relation: "allowed",
          type: "missing-definition",
        },
        severity: 8,
        source: "linter",
        startColumn: 32,
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
    define member: [user] as self
    define reader as allowed but not member
`,
    expectedError: [
      {
        endColumn: 29,
        endLineNumber: 7,
        message: "The relation `allowed` does not exist.",
        relatedInformation: {
          relation: "allowed",
          type: "missing-definition",
        },
        severity: 8,
        source: "linter",
        startColumn: 22,
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
    define member: [user] as self
    define reader as member but not allowed
`,
    expectedError: [
      {
        endColumn: 44,
        endLineNumber: 7,
        message: "The relation `allowed` does not exist.",
        relatedInformation: {
          relation: "allowed",
          type: "missing-definition",
        },
        severity: 8,
        source: "linter",
        startColumn: 37,
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
    define member: [user] as self
    define reader   as member   but not   allowed
`,
    expectedError: [
      {
        endColumn: 50,
        endLineNumber: 7,
        message: "The relation `allowed` does not exist.",
        relatedInformation: {
          relation: "allowed",
          type: "missing-definition",
        },
        severity: 8,
        source: "linter",
        startColumn: 43,
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
    define member: [ ] as self
    define reader: [user] as self
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 6,
        message: "`member` is an impossible relation (no entrypoint).",
        relatedInformation: {
          relation: "member",
          type: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
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
    define member: [] as self
    define reader: [user] as self
`,
    expectedError: [
      {
        endColumn: 18,
        endLineNumber: 6,
        message: "`member` is an impossible relation (no entrypoint).",
        relatedInformation: {
          relation: "member",
          type: "relation-no-entry-point",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 6,
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
    define member: [user] as self
`,
    expectedError: [
      {
        endColumn: 13,
        endLineNumber: 2,
        message: "Invalid schema 0.9",
        relatedInformation: {
          type: "invalid-schema",
        },
        severity: 8,
        source: "linter",
        startColumn: 10,
        startLineNumber: 2,
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
    define group: [group] as self
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
    define viewer: [user] as self
type group
  relations
    define parent: [group, org] as self
    define viewer as viewer from parent
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
    define member: [user] as self
type group
  relations
    define parent: [group] as self
    define writer: [user, org#member] as self
    define viewer: [user, org#member] as self or writer
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
    define blocked: [user] as self
    define can_view: [user] as self but not blocked
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
    define member: [user] as     self   

type group
  relations
    define parent: [group] as self
    define writer: [user, org#member] as self
    define viewer:    [   user,    org#member   ]     as    self    or    writer
`,
    expectedError: [],
  },
];
