---
name: new-component
description: Scaffold a new ngx-ds component (atom, molecule or organism) following the library conventions — signals API, OnPush, BEM SCSS, barrel, public-api export and Storybook story. Use when the user asks to create, add or scaffold a component in ngx-ds.
---

# New ngx-ds component

Arguments: `<tier> <name>` (tier = atoms | molecules | organisms, name in kebab-case). Ask only if missing.

## 1. Decide the tier

- **atoms/** — primitive, no other ngx-ds components inside.
- **molecules/** — composes atoms.
- **organisms/** — feature-level, manages its own state, may embed molecules.

Before creating, check `projects/ngx-ds/src/lib/` for an existing component that already covers it.

## 2. Files — `projects/ngx-ds/src/lib/<tier>/<name>/`

Reference implementation: `atoms/badge/` (simple) and `organisms/user-menu/` (stateful).

`<name>.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Size } from '../../shared/size';

export type <Name>Size = Size;

@Component({
  selector: 'ngx-ds-<name>',
  standalone: true,
  templateUrl: './<name>.component.html',
  styleUrl: './<name>.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <Name>Component {
  readonly size = input<<Name>Size>('md');
  readonly hostClasses = computed(() => `<bem> <bem>--${this.size()}`);
}
```

Rules:
- `input()`, `input.required()`, `model()`, `output()`, `computed()`; private state as `readonly #state = signal(...)`.
- `viewChild()` / `contentChild()` must be `private readonly`, **never** `#private`.
- Open/close state: use `setupClickOutside` / `setupEscapeClose` from `../../shared/` in the constructor.
- Icons: import from `@lucide/angular` (`LucideX as X`); type icon inputs as `IconInput` from `../../atoms/icon/icon.types`.
- Organisms with shared interfaces add `<name>.types.ts`; sub-components go in a subfolder.

`<name>.component.scss`:
- `:host { display: ...; font-family: var(--ngx-primary-font-family, 'Poppins', sans-serif); }`. If the root element is a `<button>` (or another form control), repeat the `font-family` on it: those don't inherit the font. `src/font-family.spec.ts` checks it.
- Short BEM block (`badge`, `um__trigger`).
- Tokens with fallbacks: `var(--text-base, #111827)`, `var(--surface-hover, #f3f4f6)`, `var(--primary-600, #4f46e5)`, `var(--border-base, #e5e7eb)`. Never the deprecated aliases in `styles/_legacy.scss` (`--color-*`, `--ngx-color-*`, …).

`index.ts`: `export * from './<name>.component';`

## 3. Public API

Add `export * from './lib/<tier>/<name>';` to `projects/ngx-ds/src/public-api.ts` at the end of its tier section. (A Stop hook warns if this is missing.)

## 4. Story — `projects/ngx-ds/stories/<tier>/<name>/<name>.stories.ts`

Use local wrapper components, not args (see `stories/atoms/badge/`):

```typescript
@Component({ selector: '<name>-default-wrapper', standalone: true, imports: [<Name>Component], template: `...` })
class DefaultWrapper {}

export const Default: Story = {
  render: () => ({ template: `<<name>-default-wrapper />`, moduleMetadata: { imports: [DefaultWrapper] } }),
};
```

Title: `'<Tier>/<Name>'` (match sibling stories). Cover default, variants/sizes and states (disabled, error…).

## 5. Verify

Run `npm run build` and fix every error before reporting done. If it is interactive, open it in Storybook (`npm run storybook`).
