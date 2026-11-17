# Table Add Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a right-aligned Plus + label button to `ngx-ds-table` (toolbar + empty state) with configurable `addLabel`, `showAddButton`, and a single `addClick` output.

**Architecture:** Extend the existing toolbar and empty-state action. Reuse `ngx-ds-button` with Lucide `Plus`. Replace `emptyButtonClick` with `addClick`. Show toolbar whenever filter, column toggle, or add button is enabled.

**Tech Stack:** Angular 21 (signals), Lucide Angular, Storybook, existing `ButtonComponent`.

## Global Constraints

- Follow ngx-ds patterns: `input()` / `output()`, `OnPush`, standalone, BEM `ngx-table__*`.
- Breaking change: remove `emptyButtonClick` (only defined on Table; no other consumers in repo).
- Do not commit unless the user explicitly asks.
- Verify via Storybook (dev server may already be on `:6006`) and/or `npm run build`.

## File map

| File | Responsibility |
|------|----------------|
| `projects/ngx-ds/src/lib/organisms/table/table.component.ts` | API: `addLabel`, `showAddButton`, `addClick`; import `Plus`; handler |
| `projects/ngx-ds/src/lib/organisms/table/table.component.html` | Toolbar condition, add button, empty-state button |
| `projects/ngx-ds/src/lib/organisms/table/table.component.scss` | Right-aligned actions group if needed |
| `projects/ngx-ds/stories/organisms/table/table.stories.ts` | Story demonstrating add button |

---

### Task 1: Component API + template + styles

**Files:**
- Modify: `projects/ngx-ds/src/lib/organisms/table/table.component.ts`
- Modify: `projects/ngx-ds/src/lib/organisms/table/table.component.html`
- Modify: `projects/ngx-ds/src/lib/organisms/table/table.component.scss`

**Interfaces:**
- Produces:
  - `addLabel = input<string>('Agregar')`
  - `showAddButton = input(true)`
  - `addClick = output<void>()`
  - `onAddClick(): void` → `this.addClick.emit()`
- Removes: `emptyButtonClick`, `onClicEmptStateButton`

- [ ] **Step 1: Update TypeScript API**

In `table.component.ts`:
1. Add `Plus` to the lucide-angular import and to `protected readonly icons`.
2. In Appearance (or Actions) section, add:

```typescript
readonly addLabel = input<string>('Agregar');
readonly showAddButton = input(true);
```

3. Replace:

```typescript
readonly emptyButtonClick = output<void>();
```

with:

```typescript
readonly addClick = output<void>();
```

4. Replace `onClicEmptStateButton` with:

```typescript
onAddClick(): void {
  this.addClick.emit();
}
```

- [ ] **Step 2: Update toolbar HTML**

Change the toolbar `@if` and wrapper `--attached` condition to:

```html
@if (globalFilter() || columnToggle() || showAddButton()) {
  <div class="ngx-table__toolbar">
    @if (globalFilter()) {
      <ngx-ds-search-input
        class="ngx-table__toolbar-filter"
        [value]="filterValue()"
        (valueChange)="onFilterChange($event)"
        [placeholder]="filterPlaceholder()"
        size="sm"
      />
    }

    <div class="ngx-table__toolbar-actions">
      @if (columnToggle()) {
        <div class="ngx-table__column-menu" [class.ngx-table__column-menu--open]="isColumnMenuOpen()">
          <!-- existing column toggle markup unchanged -->
        </div>
      }

      @if (showAddButton()) {
        <ngx-ds-button
          size="sm"
          color="primary"
          variant="solid"
          [iconLeft]="icons.Plus"
          (click)="onAddClick()"
        >{{ addLabel() }}</ngx-ds-button>
      }
    </div>
  </div>
}
```

Also update:

```html
[class.ngx-table__wrapper--attached]="globalFilter() || columnToggle() || showAddButton()"
```

- [ ] **Step 3: Update empty-state button**

Replace the hard-coded empty action with:

```html
@if (showAddButton()) {
  <ngx-ds-button
    empty-action
    size="sm"
    color="primary"
    variant="solid"
    [iconLeft]="icons.Plus"
    (click)="onAddClick()"
  >{{ addLabel() }}</ngx-ds-button>
}
```

- [ ] **Step 4: SCSS for toolbar actions**

In `table.component.scss`, remove `margin-left: auto` from `.ngx-table__column-menu` and add:

```scss
.ngx-table__toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  flex-shrink: 0;
}
```

Keep `.ngx-table__column-menu { position: relative; flex-shrink: 0; }` without `margin-left: auto`.

- [ ] **Step 5: Sanity-check in Storybook or build**

If Storybook is running: open Table stories and confirm toolbar shows “Agregar” with Plus on the right.  
Else run: `npm run build`  
Expected: build succeeds; no references to `emptyButtonClick`.

---

### Task 2: Storybook coverage

**Files:**
- Modify: `projects/ngx-ds/stories/organisms/table/table.stories.ts`

**Interfaces:**
- Consumes: `addLabel`, `showAddButton`, `addClick` from Task 1

- [ ] **Step 1: Add wrapper + story**

Add a wrapper (near other wrappers) that binds addLabel and handles addClick (e.g. `alert` or a signal counter). Example:

```typescript
@Component({
  selector: 'story-table-add',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
      <ngx-ds-table
        [data]="users"
        [columns]="columns"
        [clientSide]="true"
        [paginated]="true"
        [pageSize]="5"
        [globalFilter]="true"
        addLabel="Nuevo usuario"
        (addClick)="onAdd()"
      />
      <p style="font-size: 0.875rem; color: #6b7280;">
        Clicks agregar: {{ clicks() }}
      </p>
    </div>
  `,
})
class AddButtonWrapper {
  users = USERS.slice(0, 6);
  columns = BASE_COLUMNS;
  clicks = signal(0);
  onAdd(): void {
    this.clicks.update((n) => n + 1);
  }
}
```

Export story:

```typescript
export const WithAddButton: Story = {
  name: 'With add button',
  render: () => ({
    template: `<story-table-add />`,
    moduleMetadata: { imports: [AddButtonWrapper] },
  }),
};
```

Also update any story that used `(emptyButtonClick)` if present (grep: none expected).

- [ ] **Step 2: Verify in Storybook**

Open “With add button”: toolbar button right-aligned with Plus + “Nuevo usuario”; empty table (clear data temporarily or use empty story) shows same label; click increments counter.

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| `addLabel` default `"Agregar"` | Task 1 |
| `showAddButton` default `true` | Task 1 |
| `addClick` replaces `emptyButtonClick` | Task 1 |
| Toolbar right, Plus + label | Task 1 |
| Empty state same button/label | Task 1 |
| Toolbar when filter/columns/add | Task 1 |
| Storybook demo | Task 2 |

No placeholders. Types consistent across tasks.
