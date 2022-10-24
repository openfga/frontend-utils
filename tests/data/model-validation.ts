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
          "Name 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' does not match naming rule: '^[^:#@\\s]{1,254}$'.",
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
          "Name 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' does not match naming rule: '^[^:#@\\s]{1,50}$'.",
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
];
