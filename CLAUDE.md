# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Storybook dev server (primary dev workflow) — http://localhost:6006
npm run storybook

# Build the library (ng-packagr → dist/ngx-ds)
npm run build

# Run unit tests (Vitest, specs in src/**/*.spec.ts) — single run: npx ng test --watch=false
npm test

# Lint (angular-eslint) — must report 0 errors
npm run lint

# Prettier check / fix (src + stories)
npm run format:check
npm run format

# Bundle size of dist/ngx-ds (after npm run build); --base <dir> compares two builds
npm run size

# Watch build (dev)
npm run watch

# Build static Storybook
npm run build-storybook

# Accessibility tests (axe on every story, light + dark) — needs build-storybook first
npm run test:a11y

# Visual regression (screenshot every story, light + dark, vs visual-baselines/)
npm run test:visual
# Regenerate baselines — always in the Playwright Docker image, fonts differ per OS
npm run test:visual:docker -- --update
```

## Architecture

This is **ngx-ds**, an Angular 21 component library built with `ng-packagr`. The library entry point is `projects/ngx-ds/src/public-api.ts`. Built output goes to `dist/ngx-ds`.

### Branches

Trunk-based. `master` is always releasable and only changes through PRs with green CI. Work happens on short-lived `feat/*`, `fix/*` and `chore/*` branches off `master`. There is no `develop` or `staging` branch: npm dist-tags play that role (`next` for prereleases, `latest` for stable). After 1.0, a `release/<major>.x` branch is cut from its tag only when an older major needs a patch.

### Changelog

Don't edit `CHANGELOG.md` in a PR: add a fragment to `.changes/<branch-name>.md` with `### Added` / `Changed` / `Deprecated` / `Removed` / `Fixed` / `Security` sections (see `.changes/README.md`). Changes that don't affect consumers need none. `npm run changelog` previews the next release notes; CI runs `npm run changelog -- --check`.

### Releasing

Published to npm as `@jdpo2008/ngx-ds` (the unscoped `ngx-ds` name belongs to someone else).

1. On a `chore/release-<version>` branch: bump `version` in `projects/ngx-ds/package.json`, run `npm run changelog -- --release` (moves the fragments into `CHANGELOG.md` under the version and today's date, and deletes them), open a PR and merge it.
2. Create a GitHub release with tag `v<version>`. `.github/workflows/release.yml` checks that the tag matches the version, runs lint, tests and the build, then runs `npm publish` with the `NPM_TOKEN` secret. No `--provenance`: npm only accepts it from public repositories, and this one is private.

Prereleases (`1.0.0-rc.1`): bump the version only — no `changelog --release`, the fragments stay for the stable version — and mark the GitHub release as a pre-release. The workflow publishes any version with a `-` to the `next` dist-tag instead of `latest`. After a stable release it also moves `next` to that version, so `next` is never older than `latest`.

### Schematics (`ng add`)

`projects/ngx-ds/schematics/` holds the `ng add` schematic (`collection.json`, `ng-add/index.cts`, `ng-add/schema.json`). It adds `lucide-angular` and prepends `styles/ngx-ds.scss` to the app's `styles`.

- The source is `.cts`: the built package is `"type": "module"`, and `npm pack` drops a nested `package.json`, so the schematic must compile to `.cjs`.
- `npm run build` runs ng-packagr, then `tsc -p projects/ngx-ds/tsconfig.schematics.json`. ng-packagr copies the JSON files as assets.
- Tests: `npm run test:schematics` (Vitest with `schematics/vitest.config.mts`, separate from `ng test`). They import the `.cts` source directly.

Consumers load `styles/ngx-ds.scss` (tokens, no Tailwind). `styles/index.scss` adds the Tailwind directives for Storybook only.

### Component tiers

Components are organized in three tiers, each in its own folder under `projects/ngx-ds/src/lib/`:

- **atoms/** — primitive building blocks (Button, Icon, Avatar, Badge, Divider, Kbd, MenuButton, IconButton, …)
- **molecules/** — composed atoms (Input, Select, Datepicker, Card, EmptyState, ChipGroup, …)
- **organisms/** — feature-level components that may embed atoms/molecules and manage their own state (Table, Modal, Drawer, NotificationCenter, UserMenu, CommandPalette, …)

### File structure per component

Every component follows this pattern:

```
<tier>/<name>/
  <name>.component.ts      # Class + signals API
  <name>.component.html    # Template
  <name>.component.scss    # Scoped BEM styles
  index.ts                 # Barrel: export * from './<name>.component'
```

Organisms with sub-components add a subfolder (e.g. `notification-item/`) and a `.types.ts` file when they have shared interfaces. Each new organism must also add a line to `src/public-api.ts`.

### Signal-based API (Angular 21)

Every component uses:

```typescript
readonly foo  = input<Foo>(defaultValue);       // one-way input
readonly bar  = input.required<Bar>();           // required input
readonly baz  = model<boolean>(false);           // two-way bindable
readonly qux  = output<SomeType>();             // output
readonly derived = computed(() => ...);          // derived state
readonly #state  = signal(value);               // private internal state
```

All components use `ChangeDetectionStrategy.OnPush` and are `standalone: true`.

### Angular signal API constraints

- **`viewChild()` / `contentChild()` cannot use ES private fields (`#`)**. Use `private readonly` instead:
  ```typescript
  // ❌ crashes at compile time
  readonly #ref = viewChild.required(SomeComponent);
  // ✅ correct
  private readonly ref = viewChild.required(SomeComponent);
  ```
- `typeof this.#field` is invalid in TypeScript parameter type positions — write explicit types for `registerOnChange` / `registerOnTouched` callbacks.
- Import `LucideIconData` from `'lucide-angular'` only — the subpath `'lucide-angular/icons/types'` does not exist.

### SCSS conventions

- Each component's `:host` sets `display` and `font-family: var(--ngx-primary-font-family, 'Poppins', sans-serif)`.
- Class names use short BEM blocks scoped to the component (`btn__icon`, `nc__panel`, `um__trigger`).
- Colors and surfaces use short CSS custom properties with fallbacks: `var(--text-base, #111827)`, `var(--surface-hover, #f3f4f6)`, `var(--primary-600, #4f46e5)`, `var(--border-base, #e5e7eb)`. Tokens live in `styles/_tokens.scss` (dark overrides in `_themes.scss`). The old aliases (`--color-*`, `--border-color`, `--text-primary`, `--surface-secondary`, `--ngx-color-*`) were removed in 0.7.0; do not reintroduce them.

### Services

`ToastrService` (file `toast.service.ts`) and `ConfirmationService` in `src/lib/services/` are signal-based, `providedIn: 'root'` injectables. The Toast and Confirmation organisms read from these services; consumers trigger them by injecting the service.

### Content projection patterns

- **Popover** slots: `[popover-trigger]` (click-toggles automatically) and `[popover-content]`.
- **Drawer / Modal**: `[drawer-header]`, `[drawer-body]`, `[drawer-footer]` (or equivalent modal slots).
- Empty or missing slots use `:not(:has(*))` to auto-hide.

### Shared helpers (`src/lib/shared/`)

Components that manage their own open/close state (without PopoverComponent) use the shared helpers — do **not** write `@HostListener('document:click')` by hand:

```typescript
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';

constructor() {
  // Must be called in an injection context (constructor / field initializer).
  // Listeners are removed automatically via DestroyRef.
  setupClickOutside(() => this.#open.set(false));
  setupEscapeClose(() => this.#open.set(false));
}
```

Also in `shared/`: `Size` type (`'sm' | 'md' | 'lg'`) for size inputs, and `day-cell.ts` used by the date pickers/calendar.

### Exceptions to the 4-file pattern

- `atoms/icon`, `atoms/kbd`, `organisms/accordion` use inline template and/or styles.
- `atoms/tooltip` is a directive (`tooltip.directive.ts`) plus `tooltip-box.component.ts`.
- `molecules/masked-input` has no `.scss` of its own: it reuses `../input/input.component.scss` so both fields look the same. Its mask logic lives in `mask.ts`.

### Adding a new component (checklist)

1. `src/lib/<tier>/<name>/` with `.component.ts/.html/.scss` + `index.ts` barrel.
2. Add `export * from './lib/<tier>/<name>';` to `src/public-api.ts` in its tier section.
3. Add a story at `stories/<tier>/<name>/<name>.stories.ts`.
4. Optionally add a `<name>.component.spec.ts` next to the component (Vitest + TestBed; see `atoms/badge/badge.component.spec.ts`).
5. Verify: `npm run lint`, `npx ng test --watch=false` and `npm run build` — the same checks CI runs on every PR (`.github/workflows/ci.yml`).

### Storybook stories

Stories live in `projects/ngx-ds/stories/{atoms,molecules,organisms}/`. Each story uses a local wrapper `@Component` (not Storybook args/knobs) to handle stateful interaction:

```typescript
@Component({ selector: 'my-wrapper', standalone: true, imports: [MyComponent], template: `...` })
class Wrapper { ... }

export const Default: Story = {
  render: () => ({ template: `<my-wrapper />`, moduleMetadata: { imports: [Wrapper] } }),
};
```

The Storybook global stylesheet is `projects/ngx-ds/styles/index.scss` (loaded via `angular.json`).
