# Changelog

## v0.2.0 Beta 2 (Frontend Utils)
### [0.2.0](https://github.com/openfga/frontend-utils/compare/v0.2.0-beta.1...v0.2.0-beta.2) (2023-11-03)

- fix: bump dependencies
  - brings in improvements to monaco alerts and support for conditions

## v0.2.0 Beta 1 (Frontend Utils)
### [0.2.0](https://github.com/openfga/frontend-utils/releases/tag/v0.2.0-beta.1) (2023-10-09)

Removed: (BREAKING)
- Syntax Transformer has been moved to [Language](https://github.com/openfga/language/tree/main/pkg/js)
- Package has been renamed to `@openfga/frontend-utils`: this is meant for use by the VS Code extension, the FGA Playground, the docs and UI frameworks building OpenFGA modeling tooling.

Added:
- Uses the new language based syntax transformer to power modeling and validation

## v0.1.6 (Syntax Transformer)
### [0.1.6](https://github.com/openfga/syntax-transformer/compare/v0.1.5...v0.1.6) (2023-09-21)

- fix: exporting language

## v0.1.5 (Syntax Transformer)
### [0.1.5](https://github.com/openfga/syntax-transformer/compare/v0.1.4...v0.1.5) (2023-09-11)

- fix: exporting language

## v0.1.4 (Syntax Transformer)
### [0.1.4](https://github.com/openfga/syntax-transformer/compare/v0.1.3...v0.1.4) (2023-09-11)

- feat: export the language
- chore(deps): upgrade dependencies

## v0.1.3 (Syntax Transformer)
### [0.1.3](https://github.com/openfga/syntax-transformer/compare/v0.1.2...v0.1.3) (2023-06-26)

- feat(validation): Allow self-referencing type restrictions
- fix(validation): Prevent invalid model that may introduce infinite loop
- chore(deps): upgrade dependencies

## v0.1.2 (Syntax Transformer)
### [0.1.2](https://github.com/openfga/syntax-transformer/compare/v0.1.1...v0.1.2) (2023-04-21)

- chore(ci): update permissions and publish provenance data
- chore(deps): upgrade dependencies

## v0.1.1 (Syntax Transformer)
### [0.1.1](https://github.com/openfga/syntax-transformer/compare/v0.1.0...v0.1.1) (2023-04-03)

- fix(validation): raise error if schema is not specified in DSL (openfga/syntax-transformer#127)

## v0.1.0 (Syntax Transformer)
### [0.1.0](https://github.com/openfga/syntax-transformer/compare/v0.0.14...v0.1.0) (2023-03-31)

- feat!: default to schema v1.1 (openfga/syntax-transformer#122)
- chore: upgrade dependencies (openfga/syntax-transformer#121)

## v0.0.14 (Syntax Transformer)
### [0.0.14](https://github.com/openfga/syntax-transformer/compare/v0.0.13...v0.0.14) (2023-02-16)

- fix(validation): allow ttu relation as long as one of the child has such relation. fixes openfga/syntax-transformer#113
- fix(syntax highlighting): regex lookbehind error on Safari. fixes openfga/syntax-transformer#116
- chore: upgrade dependencies

## v0.0.13 (Syntax Transformer)
### [0.0.13](https://github.com/openfga/syntax-transformer/compare/v0.0.12...v0.0.13) (2023-01-25)

- fix: add yargs to list of dependencies. fixes openfga/syntax-transformer#111

## v0.0.12 (Syntax Transformer)
### [0.0.12](https://github.com/openfga/syntax-transformer/compare/v0.0.11...v0.0.12) (2023-01-23)

#### Changes
- feat: add a simple cli to transform models, run it by:
  ```sh
  npx @openfga/syntax-transformer transform --from=json --inputFile=test.json
  npx @openfga/syntax-transformer transform --from=dsl --inputFile=test.openfga
  ```
- chore(deps): upgrade dependencies

## v0.0.1 (Syntax Transformer)1
### [0.0.11](https://github.com/openfga/syntax-transformer/compare/v0.0.10...v0.0.11) (2023-01-10)

Please note: All additional undocumented functionality should be considered unstable and may be removed at any moment.

#### Changes
- feat: export graph for use in the FGA Playground
- feat: export sample authorization models
- chore(deps): upgrade dependencies

## v0.0.1 (Syntax Transformer)0
### [0.0.10](https://github.com/openfga/syntax-transformer/compare/v0.0.9...v0.0.10) (2022-12-15)

#### Changes
- chore(deps): upgrade `@openfga/sdk` to `v0.2.0` and update other deps
- chore: revert `package-lock.json` to version `2` because it was breaking snyk

## v0.0.9 (Syntax Transformer)
### [0.0.9](https://github.com/openfga/syntax-transformer/compare/v0.0.8...v0.0.9) (2022-12-02)

#### Changes
- feat(editor-support): expose auto-completion for monaco (openfga/syntax-transformer#90)
- feat(editor-support): expose syntax highlighting and tokenization for monaco and prism (openfga/syntax-transformer#90)

#### Chore
- chore(deps): bump dev dependencies

## v0.0.8 (Syntax Transformer)
### [0.0.8](https://github.com/openfga/syntax-transformer/compare/v0.0.7...v0.0.8) (2022-11-16)

#### Changes
- feat: model 1.1 removing 'as self' (openfga/syntax-transformer#94)
- feat: model 1.1 allowing wildcard restriction in allowable types (openfga/syntax-transformer#95)

#### Chore
- chore: update indent-dsl to use keyword constant (openfga/syntax-transformer#91)

## v0.0.7 (Syntax Transformer)

### [0.0.7](https://github.com/openfga/syntax-transformer/compare/v0.0.6...v0.0.7) (2022-11-02)

#### Changes
- feat: add indentDSL to improve checkDSL parsing reliability (#68)
- feat: validation rule for type and relation name (#78)
- feat: initial support schema 1.1 (#67, #73, #75)

#### Fixes
- fix(parse-dsl): fix issue with infinite loops triggered when parsing some models #76

#### Chore
- chore(deps): bump dependencies

## v0.0.6 (Syntax Transformer)

### [0.0.6](https://github.com/openfga/syntax-transformer/compare/v0.0.5...v0.0.6) (2022-10-11)

#### Changes
- fix(check-dsl): allow same relation in computedUserset of from clause (openfga/syntax-transformer#70)
- chore(deps): bump dependencies

## v0.0.5 (Syntax Transformer)

### [0.0.5](https://github.com/openfga/syntax-transformer/compare/v0.0.4...v0.0.5) (2022-09-29)

#### Changes
- fix(grammar): compile beforehand (openfga/syntax-transformer#52)
- fix(grammar): overhaul response returned by parser (openfga/syntax-transformer#52)
- fix(parse-dsl): support types with no relations in the dsl (openfga/syntax-transformer#52)
- fix(check-dsl): support types with no relations in the dsl (openfga/syntax-transformer#57)
- chore(deps): bump dependencies

## v0.0.4 (Syntax Transformer)

### [0.0.4](https://github.com/openfga/syntax-transformer/compare/v0.0.3...v0.0.4) (2022-08-16)

#### Changes
- fix(check-dsl): incorrect parsing of relations starting with `as`
- chore(deps): bump dependencies

## v0.0.3 (Syntax Transformer)

### [0.0.3](https://github.com/openfga/syntax-transformer/compare/v0.0.2...v0.0.3) (2022-06-29)

#### Changes
- feat(reporters): add some reporters that can be used to validate the model, and show errors found

## v0.0.2 (Syntax Transformer)

### [0.0.2](https://github.com/openfga/syntax-transformer/compare/v0.0.1...v0.0.2) (2022-06-15)

#### Changes
- chore(ci): fix publishing to npm

## v0.0.1 (Syntax Transformer)

### [0.0.1](https://github.com/openfga/syntax-transformer/releases/tag/v0.0.1) (2022-06-15)

Internal Release
