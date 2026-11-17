# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Storybook dev server (primary dev workflow) — http://localhost:6006
npm run storybook

# Build the library (ng-packagr → dist/ngx-ds)
npm run build

# Run unit tests (Vitest) — no *.spec.ts files exist yet
ng test

# Watch build (dev)
npm run watch

# Build static Storybook
npm run build-storybook
```

## Architecture

This is **ngx-ds**, an Angular 21 component library built with `ng-packagr`. The library entry point is `projects/ngx-ds/src/public-api.ts`. Built output goes to `dist/ngx-ds`.

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
- Colors and surfaces use short CSS custom properties with fallbacks: `var(--text-base, #111827)`, `var(--surface-hover, #f3f4f6)`, `var(--primary-600, #4f46e5)`, `var(--border-base, #e5e7eb)`. These are **not** the `--ngx-color-*` tokens defined in `styles/index.scss` (those are legacy).

### Services

`ToastService` and `ConfirmationService` in `src/lib/services/` are signal-based, `providedIn: 'root'` injectables. The Toast and Confirmation organisms read from these services; consumers trigger them by injecting the service.

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

### Adding a new component (checklist)

1. `src/lib/<tier>/<name>/` with `.component.ts/.html/.scss` + `index.ts` barrel.
2. Add `export * from './lib/<tier>/<name>';` to `src/public-api.ts` in its tier section.
3. Add a story at `stories/<tier>/<name>/<name>.stories.ts`.
4. Run `npm run build` — there are no unit specs yet, so the build is the real verification.

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
