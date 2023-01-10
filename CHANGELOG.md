# Changelog

## v0.0.11
### [0.0.11](https://github.com/openfga/syntax-transformer/compare/v0.0.10...v0.0.11) (2023-01-10)

Please note: All additional undocumented functionality should be considered unstable and may be removed at any moment.

#### Changes
- feat: export graph for use in the FGA Playground
- feat: export sample authorization models
- chore(deps): upgrade dependencies

## v0.0.10
### [0.0.10](https://github.com/openfga/syntax-transformer/compare/v0.0.9...v0.0.10) (2022-12-15)

#### Changes
- chore(deps): upgrade `@openfga/sdk` to `v0.2.0` and update other deps
- chore: revert `package-lock.json` to version `2` because it was breaking snyk

## v0.0.9
### [0.0.9](https://github.com/openfga/syntax-transformer/compare/v0.0.8...v0.0.9) (2022-12-02)

#### Changes
- feat(editor-support): expose auto-completion for monaco (openfga/syntax-transformer#90)
- feat(editor-support): expose syntax highlighting and tokenization for monaco and prism (openfga/syntax-transformer#90)

#### Chore
- chore(deps): bump dev dependencies

## v0.0.8
### [0.0.8](https://github.com/openfga/syntax-transformer/compare/v0.0.7...v0.0.8) (2022-11-16)

#### Changes
- feat: model 1.1 removing 'as self' (openfga/syntax-transformer#94)
- feat: model 1.1 allowing wildcard restriction in allowable types (openfga/syntax-transformer#95)

#### Chore
- chore: update indent-dsl to use keyword constant (openfga/syntax-transformer#91)

## v0.0.7

### [0.0.7](https://github.com/openfga/syntax-transformer/compare/v0.0.6...v0.0.7) (2022-11-02)

#### Changes
- feat: add indentDSL to improve checkDSL parsing reliability (#68)
- feat: validation rule for type and relation name (#78)
- feat: initial support schema 1.1 (#67, #73, #75)

#### Fixes
- fix(parse-dsl): fix issue with infinite loops triggered when parsing some models #76

#### Chore
- chore(deps): bump dependencies

## v0.0.6

### [0.0.6](https://github.com/openfga/syntax-transformer/compare/v0.0.5...v0.0.6) (2022-10-11)

#### Changes
- fix(check-dsl): allow same relation in computedUserset of from clause (openfga/syntax-transformer#70)
- chore(deps): bump dependencies

## v0.0.5

### [0.0.5](https://github.com/openfga/syntax-transformer/compare/v0.0.4...v0.0.5) (2022-09-29)

#### Changes
- fix(grammar): compile beforehand (openfga/syntax-transformer#52)
- fix(grammar): overhaul response returned by parser (openfga/syntax-transformer#52)
- fix(parse-dsl): support types with no relations in the dsl (openfga/syntax-transformer#52)
- fix(check-dsl): support types with no relations in the dsl (openfga/syntax-transformer#57)
- chore(deps): bump dependencies

## v0.0.4

### [0.0.4](https://github.com/openfga/syntax-transformer/compare/v0.0.3...v0.0.4) (2022-08-16)

#### Changes
- fix(check-dsl): incorrect parsing of relations starting with `as`
- chore(deps): bump dependencies

## v0.0.3

### [0.0.3](https://github.com/openfga/syntax-transformer/compare/v0.0.2...v0.0.3) (2022-06-29)

#### Changes
- feat(reporters): add some reporters that can be used to validate the model, and show errors found

## v0.0.2

### [0.0.2](https://github.com/openfga/syntax-transformer/compare/v0.0.1...v0.0.2) (2022-06-15)

#### Changes
- chore(ci): fix publishing to npm

## v0.0.1

### [0.0.1](https://github.com/openfga/syntax-transformer/releases/tag/v0.0.1) (2022-06-15)

Internal Release
