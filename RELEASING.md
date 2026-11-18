# Releasing

Releases are automated with [release-please](https://github.com/googleapis/release-please).

## Cutting a release

1. Go to **Actions → release-please → Run workflow**. Pick a bump type: `auto` follows conventional commits, `patch`/`minor`/`major` force that bump, and `explicit` uses the exact version entered in `release-version`.
2. release-please opens a PR titled `release: vX.Y.Z` with the version bump and updated `CHANGELOG.md` — review it.
3. Merge it. CI pushes a signed `vX.Y.Z` tag and the tag build publishes to npm. The draft GitHub release is not auto-published yet — publish it from the Releases page.

## Version bumps

Bumps follow [conventional commits](https://www.conventionalcommits.org/), with `bump-minor-pre-major` and `bump-patch-for-minor-pre-major` enabled:

| Commit | Before v1.0.0 | v1.0.0 and later |
|---|---|---|
| `feat:` | patch | minor |
| `fix:`, `perf:`, `refactor:`, `revert:`, `docs:` | patch | patch |
| `type!:` or `BREAKING CHANGE:` footer | minor | major |

While the version has a pre-release suffix (e.g. `0.2.0-beta.11`), `auto` keeps it (`0.2.1-beta.11`) and `patch`/`minor`/`major` drop it (`0.2.1`, `0.3.0`, `1.0.0`). Use `explicit` to cut the next pre-release or the stable release (e.g. `0.2.0`).

## Changelog

Built from commit messages since the last release: `feat:` → Added, `fix:` → Fixed, `perf:`/`refactor:` → Changed, `revert:` → Removed, `docs:` → Documentation. `test:`, `ci:` and `chore:` commits are hidden.

### Overriding an entry

If a commit message isn't user-facing, add this block to its PR description (this also works after merge; re-run the release workflow to regenerate the release PR). release-please uses it instead of the commit message:

```
BEGIN_COMMIT_OVERRIDE
feat: user-facing description of the change
END_COMMIT_OVERRIDE
```

### Breaking changes

Mark the type with `!` and add a `BREAKING CHANGE:` footer. PRs are squash-merged: the squash title defaults to the commit title for single-commit PRs and to the PR title otherwise, and the body defaults to the commit messages. Before merging, check that the squash title has the `!` and the body keeps the footer:

```
feat!: remove the Foo option

BREAKING CHANGE: the Foo option has been removed. Use Bar instead.
```

This gets its own changelog section and triggers a major bump (minor before v1.0.0).
