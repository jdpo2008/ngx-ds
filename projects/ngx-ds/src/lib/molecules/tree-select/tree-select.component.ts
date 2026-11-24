import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Check, ChevronDown, ChevronRight, Minus, X } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';
import { FieldErrors, fieldErrorText, fieldHasError } from '../../shared/field-error';
import { isActivationKey } from '../../shared/keyboard';
import { NGX_DS_LABELS } from '../../shared/labels';
import { Size } from '../../shared/size';

export type TreeSelectId = string | number;

export interface TreeSelectNode {
  id: TreeSelectId;
  label: string;
  children?: TreeSelectNode[];
  disabled?: boolean;
}

/** One id (or `null`) in single mode, an array of ids with `multiple`. */
export type TreeSelectValue = TreeSelectId | TreeSelectId[] | null;

export type TreeSelectSize = Size;

export type TreeSelectCheckState = 'checked' | 'mixed' | 'unchecked';

/** A visible row of the flattened tree. */
export interface TreeSelectRow {
  node: TreeSelectNode;
  level: number;
  parentId: TreeSelectId | null;
  hasChildren: boolean;
  expanded: boolean;
  posinset: number;
  setsize: number;
}

interface TreeIndex {
  byId: Map<TreeSelectId, TreeSelectNode>;
  parentOf: Map<TreeSelectId, TreeSelectId | null>;
  /** Every leaf under a node (the node itself when it is a leaf). */
  leavesOf: Map<TreeSelectId, TreeSelectNode[]>;
}

let nextId = 0;

/**
 * A select whose options form a tree. Single mode picks one node; `multiple` adds
 * checkboxes that, with `cascade`, check every leaf under a parent.
 *
 * Works with `[(value)]`, reactive forms and Signal Forms `[formField]`.
 */
@Component({
  selector: 'ngx-ds-tree-select',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './tree-select.component.html',
  styleUrl: './tree-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true,
    },
  ],
})
export class TreeSelectComponent implements ControlValueAccessor {
  readonly i18n = inject(NGX_DS_LABELS);
  readonly #injector = inject(Injector);

  // ── Configuration ────────────────────────────────────────────
  readonly nodes = input<TreeSelectNode[]>([]);
  /** Checkboxes and an array value instead of a single id. */
  readonly multiple = input<boolean>(false);
  /**
   * With `multiple`, checking a parent checks every leaf under it, and the value
   * holds leaf ids only. With `false`, each node is checked on its own.
   */
  readonly cascade = input<boolean>(true);
  /** In single mode, parents can be picked too. By default a click on them expands. */
  readonly selectableParents = input<boolean>(false);
  /** Adds a box that filters the tree by label, keeping the ancestors of matches. */
  readonly searchable = input<boolean>(false);
  readonly placeholder = input<string | undefined>(undefined);
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  /** Set by Signal Forms `[formField]`. Its errors show once the field is touched. */
  readonly errors = input<FieldErrors>([]);
  readonly touched = input<boolean>(false);
  readonly size = input<TreeSelectSize>('md');
  readonly disabled = input<boolean>(false);

  // ── State ────────────────────────────────────────────────────
  readonly value = model<TreeSelectValue>(null);
  /** Ids of the expanded parents. */
  readonly expanded = model<TreeSelectId[]>([]);

  readonly id = `ngx-tree-select-${nextId++}`;
  readonly panelId = `${this.id}-panel`;
  readonly messageId = `${this.id}-message`;
  readonly searchId = `${this.id}-search`;

  protected readonly icons = { ChevronDown, ChevronRight, Check, Minus, X };

  readonly #open = signal(false);
  readonly #search = signal('');
  readonly #cvaDisabled = signal(false);
  readonly #active = signal<TreeSelectId | null>(null);

  readonly search = this.#search.asReadonly();
  readonly activeId = this.#active.asReadonly();

  private readonly triggerRef = viewChild<ElementRef<HTMLElement>>('trigger');

  readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  /** Disabling the control while it is open hides the panel. */
  readonly isOpen = computed(() => this.#open() && !this.isDisabled());

  readonly #index = computed<TreeIndex>(() => {
    const byId = new Map<TreeSelectId, TreeSelectNode>();
    const parentOf = new Map<TreeSelectId, TreeSelectId | null>();
    const leavesOf = new Map<TreeSelectId, TreeSelectNode[]>();
    const walk = (node: TreeSelectNode, parent: TreeSelectId | null): TreeSelectNode[] => {
      byId.set(node.id, node);
      parentOf.set(node.id, parent);
      const leaves = node.children?.length
        ? node.children.flatMap((child) => walk(child, node.id))
        : [node];
      leavesOf.set(node.id, leaves);
      return leaves;
    };
    for (const node of this.nodes()) walk(node, null);
    return { byId, parentOf, leavesOf };
  });

  readonly selectedIds = computed<TreeSelectId[]>(() => {
    const v = this.value();
    if (v === null || v === undefined) return [];
    return Array.isArray(v) ? v : [v];
  });

  readonly #selectedSet = computed(() => new Set(this.selectedIds()));

  /** Selected nodes, in value order. Unknown ids are skipped. */
  readonly selectedNodes = computed(() => {
    const { byId } = this.#index();
    return this.selectedIds()
      .map((id) => byId.get(id))
      .filter((n): n is TreeSelectNode => !!n);
  });

  /** The visible rows: expanded branches, or the matches and their ancestors while searching. */
  readonly rows = computed<TreeSelectRow[]>(() => {
    const query = this.#search().trim().toLowerCase();
    const expanded = new Set(this.expanded());
    const matches = (n: TreeSelectNode) => n.label.toLowerCase().includes(query);
    const subtreeMatch = new Map<TreeSelectId, boolean>();
    const hasMatch = (n: TreeSelectNode): boolean => {
      let hit = subtreeMatch.get(n.id);
      if (hit === undefined) {
        hit = matches(n) || !!n.children?.some(hasMatch);
        subtreeMatch.set(n.id, hit);
      }
      return hit;
    };

    const out: TreeSelectRow[] = [];
    const walk = (
      list: TreeSelectNode[],
      level: number,
      parentId: TreeSelectId | null,
      showAll: boolean,
    ) => {
      const visible = query && !showAll ? list.filter(hasMatch) : list;
      visible.forEach((node, i) => {
        const hasChildren = !!node.children?.length;
        const descendantMatch = !!query && hasChildren && !!node.children!.some((c) => hasMatch(c));
        const isExpanded = hasChildren && (expanded.has(node.id) || descendantMatch);
        out.push({
          node,
          level,
          parentId,
          hasChildren,
          expanded: isExpanded,
          posinset: i + 1,
          setsize: visible.length,
        });
        if (isExpanded) {
          walk(node.children!, level + 1, node.id, showAll || (!!query && matches(node)));
        }
      });
    };
    walk(this.nodes(), 1, null, false);
    return out;
  });

  /** The row that takes Tab focus: the active one, else the first selected, else the first. */
  readonly focusableId = computed<TreeSelectId | null>(() => {
    const rows = this.rows();
    const active = this.#active();
    if (active !== null && rows.some((r) => r.node.id === active)) return active;
    const selected = this.#selectedSet();
    return (rows.find((r) => selected.has(r.node.id)) ?? rows[0])?.node.id ?? null;
  });

  /** What the combobox reads as its value: the selected labels, or the placeholder. */
  readonly valueText = computed(() => {
    const nodes = this.selectedNodes();
    if (nodes.length === 0) return this.placeholder() ?? this.i18n.selectPlaceholder;
    return nodes.map((n) => n.label).join(', ');
  });

  /** Live-region text while searching: how many nodes match, or "no results". */
  readonly searchStatus = computed(() => {
    const query = this.#search().trim().toLowerCase();
    if (!query) return '';
    const count = this.rows().filter((r) => r.node.label.toLowerCase().includes(query)).length;
    return count ? this.i18n.resultsCount(count) : this.i18n.noResults;
  });

  readonly hasError = computed(() =>
    fieldHasError(this.errorMessage(), this.errors(), this.touched()),
  );
  readonly errorText = computed(() =>
    fieldErrorText(this.errorMessage(), this.errors(), this.touched()),
  );

  readonly triggerClasses = computed(() => {
    const cls = ['ts__trigger', `ts__trigger--${this.size()}`];
    if (this.isOpen()) cls.push('ts__trigger--open');
    else if (this.hasError()) cls.push('ts__trigger--error');
    if (this.isDisabled()) cls.push('ts__trigger--disabled');
    return cls.join(' ');
  });

  constructor() {
    setupEscapeClose(() => {
      if (this.#open()) this.close(true);
    });
    setupClickOutside(() => {
      if (this.#open()) this.close(false);
    });
  }

  // ── Row state ────────────────────────────────────────────────
  checkState(node: TreeSelectNode): TreeSelectCheckState {
    const selected = this.#selectedSet();
    if (!this.multiple() || !this.cascade() || !node.children?.length) {
      return selected.has(node.id) ? 'checked' : 'unchecked';
    }
    // Disabled leaves can't be toggled from the parent, so they only count when
    // they are already selected. A parent whose enabled leaves are all checked
    // is checked, matching what a click on it does (it unchecks them).
    const leaves = (this.#index().leavesOf.get(node.id) ?? []).filter(
      (l) => !l.disabled || selected.has(l.id),
    );
    const count = leaves.filter((l) => selected.has(l.id)).length;
    if (count === 0) return 'unchecked';
    return count === leaves.length ? 'checked' : 'mixed';
  }

  /** `aria-checked` in multiple mode. */
  ariaChecked(node: TreeSelectNode): 'true' | 'false' | 'mixed' {
    const state = this.checkState(node);
    return state === 'checked' ? 'true' : state === 'mixed' ? 'mixed' : 'false';
  }

  rowDomId(index: number): string {
    return `${this.id}-row-${index}`;
  }

  // ── Open / close ─────────────────────────────────────────────
  toggleOpen(): void {
    if (this.#open()) this.close(false);
    else this.#openFromUser(false);
  }

  /** Opens from a click or key: focuses the search box when there is one, else the tree on request. */
  #openFromUser(focusTree: boolean): void {
    const searchable = this.searchable();
    this.open(focusTree && !searchable);
    if (searchable && this.isOpen()) {
      afterNextRender(() => document.getElementById(this.searchId)?.focus(), {
        injector: this.#injector,
      });
    }
  }

  open(focusTree = false): void {
    if (this.isDisabled() || this.#open()) return;
    this.#revealSelected();
    this.#active.set(null);
    this.#open.set(true);
    if (focusTree) this.#focusActiveAfterRender();
  }

  close(focusTrigger: boolean): void {
    if (this.#open()) this.onTouched();
    this.#open.set(false);
    this.#search.set('');
    this.#active.set(null);
    if (focusTrigger) this.triggerRef()?.nativeElement.focus();
  }

  /** Expands the ancestors of the selected nodes so they are visible on open. */
  #revealSelected(): void {
    const { parentOf } = this.#index();
    const next = new Set(this.expanded());
    const before = next.size;
    for (const id of this.selectedIds()) {
      let parent = parentOf.get(id) ?? null;
      while (parent !== null) {
        next.add(parent);
        parent = parentOf.get(parent) ?? null;
      }
    }
    if (next.size !== before) this.expanded.set([...next]);
  }

  // ── Actions ──────────────────────────────────────────────────
  toggleExpand(node: TreeSelectNode, force?: boolean): void {
    if (!node.children?.length) return;
    const current = this.expanded();
    const isExpanded = current.includes(node.id);
    const next = force ?? !isExpanded;
    if (next === isExpanded) return;
    this.expanded.set(next ? [...current, node.id] : current.filter((id) => id !== node.id));
  }

  /** Click or Enter / Space on a row. */
  activate(row: TreeSelectRow): void {
    const { node } = row;
    this.#active.set(node.id);
    if (this.multiple()) {
      this.toggleCheck(node);
    } else if (row.hasChildren && !this.selectableParents()) {
      this.toggleExpand(node);
    } else {
      this.select(node);
    }
  }

  select(node: TreeSelectNode): void {
    if (node.disabled) return;
    this.#commit(node.id);
    this.close(true);
  }

  toggleCheck(node: TreeSelectNode): void {
    if (node.disabled) return;
    const selected = new Set(this.selectedIds());
    if (this.cascade() && node.children?.length) {
      const leaves = (this.#index().leavesOf.get(node.id) ?? []).filter((l) => !l.disabled);
      const allOn = leaves.every((l) => selected.has(l.id));
      for (const leaf of leaves) {
        if (allOn) selected.delete(leaf.id);
        else selected.add(leaf.id);
      }
    } else if (selected.has(node.id)) {
      selected.delete(node.id);
    } else {
      selected.add(node.id);
    }
    this.#commit([...selected]);
  }

  remove(id: TreeSelectId, event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.#commit(this.selectedIds().filter((v) => v !== id));
    // The chip's button is about to leave the DOM: keep focus in the field.
    this.triggerRef()?.nativeElement.focus();
  }

  #commit(next: TreeSelectValue): void {
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
  }

  onSearch(event: Event): void {
    this.#search.set((event.target as HTMLInputElement).value);
    this.#active.set(null);
  }

  // ── Keyboard ─────────────────────────────────────────────────
  onTriggerKeydown(event: KeyboardEvent): void {
    // Ignore keys from nested controls (chip remove buttons).
    if (event.target !== event.currentTarget) return;
    const opens =
      event.key === 'ArrowDown' ||
      ((event.key === 'ArrowUp' || isActivationKey(event)) && !this.#open());
    if (opens) {
      event.preventDefault();
      if (this.#open()) this.#focusActiveAfterRender();
      else this.#openFromUser(true);
    } else if (isActivationKey(event)) {
      event.preventDefault();
      this.close(false);
    }
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.#focusActiveAfterRender();
    } else if (event.key === 'Tab' && (event.shiftKey || this.rows().length === 0)) {
      // Back to the trigger, or past an empty tree: focus leaves the panel.
      this.close(false);
    }
    // Plain Tab moves on to the tree's focusable row.
  }

  onRowKeydown(event: KeyboardEvent, row: TreeSelectRow, index: number): void {
    const rows = this.rows();
    let target: number | null = null;
    switch (event.key) {
      case 'ArrowDown':
        target = Math.min(index + 1, rows.length - 1);
        break;
      case 'ArrowUp':
        target = Math.max(index - 1, 0);
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = rows.length - 1;
        break;
      case 'ArrowRight':
        if (row.hasChildren && !row.expanded) this.toggleExpand(row.node, true);
        else if (row.expanded) target = index + 1;
        break;
      case 'ArrowLeft':
        if (row.expanded && !this.#search().trim()) this.toggleExpand(row.node, false);
        else if (row.parentId !== null) target = rows.findIndex((r) => r.node.id === row.parentId);
        break;
      case 'Enter':
      case ' ':
        this.activate(row);
        break;
      case 'Tab':
        // Shift+Tab goes back to the search box, which stays open.
        if (!(event.shiftKey && this.searchable())) this.close(false);
        return;
      default:
        target = this.#typeaheadTarget(event, index);
        if (target === null) return;
    }
    event.preventDefault();
    if (target !== null && rows[target]) {
      this.#active.set(rows[target].node.id);
      this.#focusActiveAfterRender();
    }
  }

  /** A printable key moves to the next visible row whose label starts with it. */
  #typeaheadTarget(event: KeyboardEvent, index: number): number | null {
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return null;
    const char = event.key.toLocaleLowerCase();
    const rows = this.rows();
    for (let step = 1; step <= rows.length; step++) {
      const i = (index + step) % rows.length;
      if (rows[i].node.label.trim().toLocaleLowerCase().startsWith(char)) return i;
    }
    return null;
  }

  #focusActiveAfterRender(): void {
    afterNextRender(
      () => {
        const id = this.focusableId();
        const index = this.rows().findIndex((r) => r.node.id === id);
        if (index >= 0) document.getElementById(this.rowDomId(index))?.focus();
      },
      { injector: this.#injector },
    );
  }

  // ── CVA ──────────────────────────────────────────────────────
  private onChange: (v: TreeSelectValue) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: TreeSelectValue | undefined): void {
    this.value.set(v ?? (this.multiple() ? [] : null));
  }
  registerOnChange(fn: (v: TreeSelectValue) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }
}
