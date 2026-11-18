# Changelog fragments

Don't edit `CHANGELOG.md` in a PR. Add a file here instead, so two PRs never conflict on the same lines.

- One file per PR, named after the branch: `feat-segmented-control.md`, `fix-popover-focus.md`.
- Only `### <Section>` headings, with the sections of [Keep a Changelog](https://keepachangelog.com/): `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
- Write the entries as they will read in the changelog, one bullet each.
- Changes that don't affect consumers (CI, tests, docs, refactors) need no fragment.

```md
### Added

- SegmentedControl (`ngx-ds-segmented-control`): …

### Fixed

- Popover: focus returns to the trigger on Escape.
```

`npm run changelog` prints the next release notes. CI runs `npm run changelog -- --check`. On release, `npm run changelog -- --release` moves the fragments into `CHANGELOG.md` under the version in `projects/ngx-ds/package.json` and deletes them.
