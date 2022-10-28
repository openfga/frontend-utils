/* eslint-disable max-len */
export const validation_cases: { name: string; friendly: string; expectedError: any }[] = [
  {
    name: "invalid type name for self",
    friendly: `type user
type self
  relations
    define member: [user] as self
`,
    expectedError: [
      {
        endColumn: 10,
        endLineNumber: 2,
        message: "A type cannot be named 'self' or 'this'.",
        relatedInformation: {
          type: "reserved-type-keywords",
        },
        severity: 8,
        source: "linter",
        startColumn: 6,
        startLineNumber: 2,
      },
    ],
  },

  {
    name: "invalid type name for this",
    friendly: `type user
type this
  relations
    define member: [user] as self
`,
    expectedError: [
      {
        endColumn: 10,
        endLineNumber: 2,
        message: "A type cannot be named 'self' or 'this'.",
        relatedInformation: {
          type: "reserved-type-keywords",
        },
        severity: 8,
        source: "linter",
        startColumn: 6,
        startLineNumber: 2,
      },
    ],
  },
  {
    name: "invalid relation name for self",
    friendly: `type user
type group
  relations
    define self: [user] as self
`,
    expectedError: [
      {
        endColumn: 16,
        endLineNumber: 4,
        message: "A relation cannot be named 'self' or 'this'.",
        relatedInformation: {
          type: "reserved-relation-keywords",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 4,
      },
    ],
  },
  {
    name: "invalid relation name for this",
    friendly: `type user
type group
  relations
    define this: [user] as self
`,
    expectedError: [
      {
        endColumn: 16,
        endLineNumber: 4,
        message: "A relation cannot be named 'self' or 'this'.",
        relatedInformation: {
          type: "reserved-relation-keywords",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 4,
      },
    ],
  },
  {
    name: "invalid type name",
    friendly: `type user
type aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  relations
    define member: [user] as self
`,
    expectedError: [
      {
        endColumn: 350,
        endLineNumber: 2,
        message:
          "Type 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' does not match naming rule: '^[^:#@\\s]{1,254}$'.",
        relatedInformation: {
          type: "invalid-name",
        },
        severity: 8,
        source: "linter",
        startColumn: 6,
        startLineNumber: 2,
      },
    ],
  },
  {
    name: "invalid relation name",
    friendly: `type user
type org
  relations
    define aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: [user] as self
`,
    expectedError: [
      {
        endColumn: 112,
        endLineNumber: 4,
        message:
          "Relation 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' of type 'org' does not match naming rule: '^[^:#@\\s]{1,50}$'.",
        relatedInformation: {
          type: "invalid-name",
        },
        severity: 8,
        source: "linter",
        startColumn: 12,
        startLineNumber: 4,
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
];
