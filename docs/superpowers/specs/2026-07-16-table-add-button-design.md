# Table Add Button — Design Spec

**Date:** 2026-07-16  
**Component:** `ngx-ds-table` (`projects/ngx-ds/src/lib/organisms/table/`)  
**Status:** Approved for implementation pending spec review

## Goal

Add a primary “add record” button to the table: Plus icon + configurable label, right-aligned in the toolbar, and reused in the empty state. Both surfaces emit a single `addClick` event.

## Decisions

| Decision | Choice |
|----------|--------|
| Placement | Toolbar (right) **and** empty state |
| Visibility | Always on by default; hide with `showAddButton` |
| Label | Configurable via `addLabel`, default `"Agregar"` |
| Event | Single `addClick`; remove `emptyButtonClick` |
| Approach | Native toolbar control (not projection slot / config object) |

## Public API

```typescript
readonly addLabel = input<string>('Agregar');
readonly showAddButton = input(true);
readonly addClick = output<void>();
```

**Breaking change:** `emptyButtonClick` is removed. Consumers must migrate to `(addClick)`.

## UI behavior

### Toolbar

- Render when `globalFilter() || columnToggle() || showAddButton()`.
- Add button sits on the right (`margin-left: auto` or flex end group).
- Uses `ngx-ds-button` with:
  - `size="sm"`
  - `color="primary"`
  - `variant="solid"`
  - `iconLeft` = Lucide `Plus`
  - content = `{{ addLabel() }}`
- Click calls `addClick.emit()`.

### Empty state

- When `showAddButton()` is true and no custom `emptyTemplate`, the empty-state action button uses `addLabel()` (replacing hard-coded `"Crear elemento"`).
- Click emits the same `addClick`.
- When `showAddButton()` is false, omit the empty-state action button.

### Layout notes

- Existing filter stays left; column toggle and add button share the right side (add button rightmost).
- Wrapper `--attached` class applies whenever the toolbar is shown (same rule as today, extended for add button).

## Storybook

- Extend an existing story (or add a short “With add button” story) showing `addLabel` and `(addClick)` (e.g. alert or console log).
- Document hiding via `[showAddButton]="false"`.

## Out of scope

- Custom icons for the add button
- Separate toolbar vs empty handlers
- Content projection for toolbar actions

## Self-review

- No placeholders or TBD sections.
- Breaking change called out explicitly.
- Scope limited to one organism + stories.
