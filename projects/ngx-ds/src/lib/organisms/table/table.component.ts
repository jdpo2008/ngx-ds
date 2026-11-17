import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';
import { IconButtonComponent } from '../../atoms/icon-button/icon-button.component';
import { MenuButtonComponent } from '../../atoms/menu-button/menu-button.component';
import { BadgeComponent, BadgeColor, BadgeVariant } from '../../atoms/badge/badge.component';
import { CheckboxComponent } from '../../molecules/checkbox/checkbox.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { EmptyStateComponent } from '../../molecules/empty-state/empty-state.component';
import { SearchInputComponent } from '../../molecules/search-input/search-input.component';
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Check,
  X,
  MoreVertical,
  ChevronRight,
  Columns3,
  Plus,
  LucideIconData,
  Inbox,
} from 'lucide-angular';
import { ButtonComponent } from '../../atoms/button/button.component';
import { setupClickOutside } from '../../shared/click-outside';

// ── Public types ─────────────────────────────────────────────────────────────

export type ColumnAlign = 'left' | 'center' | 'right';
export type ColumnType = 'text' | 'number' | 'date' | 'boolean' | 'badge' | 'custom';
export type SortDirection = 'asc' | 'desc';
export type SelectMode = 'single' | 'multi';
export type ActionColor = 'default' | 'primary' | 'danger' | 'success' | 'warning';

export interface TableAction<T = any> {
  label: string;
  icon?: LucideIconData;
  color?: ActionColor;
  /** Return false to hide this action for a specific row. */
  show?: (row: T) => boolean;
  /** Return true to disable this action for a specific row. */
  disabled?: (row: T) => boolean;
  onClick: (row: T, event: Event) => void;
}

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: ColumnAlign;
  type?: ColumnType;
  dateFormat?: string;
  hidden?: boolean;
  sticky?: boolean;
  /** Whether this column can be hidden via the column-visibility toggle. Defaults to true. */
  hideable?: boolean;
  /** Color for badge cells (type === 'badge'). Defaults to 'primary'. */
  badgeColor?: BadgeColor;
  /** Variant for badge cells (type === 'badge'). Defaults to 'soft'. */
  badgeVariant?: BadgeVariant;
  cellTemplate?: TemplateRef<{ $implicit: T; value: any; row: T }>;
  headerTemplate?: TemplateRef<{ column: TableColumn<T> }>;
  valueFormatter?: (value: any, row: T) => string;
}

export interface TableSort {
  column: string;
  direction: SortDirection;
}

export interface TablePageEvent {
  page: number;
  pageSize: number;
}

// ── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'ngx-ds-table',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    IconComponent,
    IconButtonComponent,
    MenuButtonComponent,
    BadgeComponent,
    CheckboxComponent,
    PaginationComponent,
    EmptyStateComponent,
    SearchInputComponent,
    ButtonComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T extends Record<string, any> = Record<string, any>> {
  protected readonly icons = {
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    Check,
    X,
    MoreVertical,
    ChevronRight,
    Columns3,
    Plus,
  };

  readonly #openMenuId = signal<any>(null);
  readonly #columnMenuOpen = signal(false);

  constructor() {
    setupClickOutside(() => {
      this.#openMenuId.set(null);
      this.#columnMenuOpen.set(false);
    });
  }

  // ── Data ─────────────────────────────────────────────────────────────────
  readonly data = input<T[]>([]);
  readonly columns = input<TableColumn<T>[]>([]);
  readonly loading = input(false);
  readonly loadingRows = input(5);

  // ── Mode ──────────────────────────────────────────────────────────────────
  /** When true, sorting and pagination are handled internally. */
  readonly clientSide = input(false);

  // ── Selection ─────────────────────────────────────────────────────────────
  readonly selectable = input(false);
  readonly selectMode = input<SelectMode>('multi');
  readonly selectedRows = model<T[]>([]);
  /** Dot-notation field used as unique row identifier. Falls back to object reference. */
  readonly rowKey = input<string | null>(null);

  // ── Sort (server-side) ───────────────────────────────────────────────────
  readonly sort = input<TableSort | null>(null);

  // ── Pagination ────────────────────────────────────────────────────────────
  readonly paginated = input(false);
  readonly page = input(1);
  readonly pageSize = input(10);
  readonly pageSizeOptions = input<number[]>([10, 25, 50, 100]);
  /** Total items for server-side pagination. Ignored when clientSide is true. */
  readonly total = input(0);

  // ── Appearance ────────────────────────────────────────────────────────────
  readonly striped = input(false);
  readonly hoverable = input(true);
  readonly dense = input(false);
  readonly stickyHeader = input(false);
  readonly maxHeight = input<string>('');
  readonly emptyMessage = input('No hay datos disponibles');
  readonly emptyDescription = input<string>(
    'Aun no hay elementos para mostrar. Intenta ajustando tus filtros o creando un nuevo elemento.',
  );
  readonly emptyIcon = input<LucideIconData | null>(Inbox);
  readonly emptyTemplate = input<TemplateRef<void> | null>(null);
  readonly rowClickable = input(false);

  // ── Actions ───────────────────────────────────────────────────────────────
  readonly addLabel = input<string>('Agregar');
  readonly showAddButton = input(true);
  readonly actions = input<TableAction<T>[]>([]);
  /** Header label for the actions column. Empty string hides the label. */
  readonly actionsLabel = input('');
  /** Fixed width for the actions column, e.g. "160px". Auto-sized when empty. */
  readonly actionsWidth = input<string>('');

  // ── Global filter ─────────────────────────────────────────────────────────
  readonly globalFilter = input(false);
  readonly filterPlaceholder = input('Buscar...');
  /** Column keys searched by the global filter. Defaults to all visible columns. */
  readonly filterKeys = input<string[] | null>(null);
  readonly filterValue = model<string>('');

  // ── Column visibility ─────────────────────────────────────────────────────
  readonly columnToggle = input(false);
  /** null = all hideable columns visible (default). Materialized on first toggle. */
  readonly visibleColumnKeys = model<string[] | null>(null);

  // ── Expandable rows ───────────────────────────────────────────────────────
  readonly expandable = input(false);
  readonly expandTemplate = input<TemplateRef<{ $implicit: T; row: T }> | null>(null);
  readonly singleExpand = input(false);
  readonly expandedRows = model<T[]>([]);

  // ── Outputs ───────────────────────────────────────────────────────────────
  readonly sortChange = output<TableSort>();
  readonly pageChange = output<TablePageEvent>();
  readonly selectionChange = output<T[]>();
  readonly rowClick = output<T>();
  readonly addClick = output<void>();
  readonly filterChange = output<string>();
  readonly columnVisibilityChange = output<string[]>();
  readonly rowExpandChange = output<T[]>();

  // ── Internal signals ──────────────────────────────────────────────────────
  readonly #internalSort = signal<TableSort | null>(null);
  readonly #internalPage = signal(1);
  readonly #internalPageSize = signal(10);

  // ── Effective state ───────────────────────────────────────────────────────
  readonly effectiveSort = computed(() => (this.clientSide() ? this.#internalSort() : this.sort()));
  readonly effectivePage = computed(() => (this.clientSide() ? this.#internalPage() : this.page()));
  readonly effectivePageSize = computed(() =>
    this.clientSide() ? this.#internalPageSize() : this.pageSize(),
  );
  readonly totalItems = computed(() =>
    this.clientSide() ? this.filteredData().length : this.total(),
  );
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.effectivePageSize())),
  );
  readonly pageStart = computed(() => {
    const total = this.totalItems();
    return total === 0 ? 0 : (this.effectivePage() - 1) * this.effectivePageSize() + 1;
  });
  readonly pageEnd = computed(() =>
    Math.min(this.effectivePage() * this.effectivePageSize(), this.totalItems()),
  );

  // ── Derived ───────────────────────────────────────────────────────────────
  readonly hideableColumns = computed(() =>
    this.columns().filter((c) => c.hideable !== false && !c.hidden),
  );

  readonly visibleColumns = computed(() => {
    const keys = this.visibleColumnKeys();
    return this.columns().filter((c) => {
      if (c.hidden) return false;
      if (c.hideable === false) return true;
      return keys === null ? true : keys.includes(c.key);
    });
  });

  readonly hasActions = computed(() => this.actions().length > 0);

  readonly skeletonRowsArr = computed(() => Array.from({ length: this.loadingRows() }));
  readonly skeletonColsArr = computed(() => Array.from({ length: this.colSpanCount() }));

  /** Client-side global filter applied over `data()`, before sort/pagination. */
  readonly filteredData = computed((): T[] => {
    const query = this.filterValue().trim().toLowerCase();
    if (!this.clientSide() || !this.globalFilter() || !query) return this.data();

    const keys = this.filterKeys() ?? this.visibleColumns().map((c) => c.key);
    const cols = this.columns();
    return this.data().filter((row) =>
      keys.some((key) => {
        const col = cols.find((c) => c.key === key);
        const text = col ? this.formatCell(row, col) : String(deepGet(row, key) ?? '');
        return text.toLowerCase().includes(query);
      }),
    );
  });

  readonly processedData = computed((): T[] => {
    if (!this.clientSide()) return this.filteredData();

    let rows = [...this.filteredData()];

    const sort = this.#internalSort();
    if (sort) {
      rows.sort((a, b) => {
        const av = deepGet(a, sort.column);
        const bv = deepGet(b, sort.column);
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sort.direction === 'asc' ? cmp : -cmp;
      });
    }

    if (this.paginated()) {
      const ps = this.#internalPageSize();
      const pg = this.#internalPage();
      rows = rows.slice((pg - 1) * ps, pg * ps);
    }

    return rows;
  });

  // ── Selection ─────────────────────────────────────────────────────────────
  readonly #selectedSet = computed((): Set<any> => {
    const key = this.rowKey();
    const selected = this.selectedRows();
    return key ? new Set(selected.map((r) => deepGet(r, key))) : new Set(selected);
  });

  readonly allSelected = computed(() => {
    const rows = this.processedData();
    return rows.length > 0 && rows.every((r) => this.isSelected(r));
  });

  readonly someSelected = computed(() => {
    const rows = this.processedData();
    return rows.some((r) => this.isSelected(r)) && !this.allSelected();
  });

  isSelected(row: T): boolean {
    const key = this.rowKey();
    return key ? this.#selectedSet().has(deepGet(row, key)) : this.#selectedSet().has(row);
  }

  toggleAll(checked: boolean): void {
    const rows = this.processedData();
    const key = this.rowKey();
    if (checked) {
      const existing = this.selectedRows();
      const existingIds = key ? new Set(existing.map((r) => deepGet(r, key))) : new Set(existing);
      const toAdd = rows.filter((r) =>
        key ? !existingIds.has(deepGet(r, key)) : !existingIds.has(r),
      );
      const next = [...existing, ...toAdd];
      this.selectedRows.set(next);
      this.selectionChange.emit(next);
    } else {
      const pageIds = key ? new Set(rows.map((r) => deepGet(r, key))) : new Set(rows);
      const next = key
        ? this.selectedRows().filter((r) => !pageIds.has(deepGet(r, key)))
        : this.selectedRows().filter((r) => !pageIds.has(r));
      this.selectedRows.set(next);
      this.selectionChange.emit(next);
    }
  }

  toggleRow(row: T, event?: Event): void {
    event?.stopPropagation();
    const key = this.rowKey();
    const selected = this.selectedRows();
    if (this.isSelected(row)) {
      const next = key
        ? selected.filter((r) => deepGet(r, key) !== deepGet(row, key))
        : selected.filter((r) => r !== row);
      this.selectedRows.set(next);
      this.selectionChange.emit(next);
    } else {
      const next = this.selectMode() === 'multi' ? [...selected, row] : [row];
      this.selectedRows.set(next);
      this.selectionChange.emit(next);
    }
  }

  // ── Sort ─────────────────────────────────────────────────────────────────
  onSort(col: TableColumn<T>): void {
    if (!col.sortable) return;
    const current = this.effectiveSort();
    const next: TableSort =
      current?.column === col.key
        ? { column: col.key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { column: col.key, direction: 'asc' };
    if (this.clientSide()) {
      this.#internalSort.set(next);
      this.#internalPage.set(1);
    }
    this.sortChange.emit(next);
  }

  sortIconFor(col: TableColumn<T>) {
    const sort = this.effectiveSort();
    if (sort?.column !== col.key) return this.icons.ArrowUpDown;
    return sort.direction === 'asc' ? this.icons.ArrowUp : this.icons.ArrowDown;
  }

  isSortActive(col: TableColumn<T>): boolean {
    return this.effectiveSort()?.column === col.key;
  }

  isSortAsc(col: TableColumn<T>): boolean {
    const sort = this.effectiveSort();
    return sort?.column === col.key && sort.direction === 'asc';
  }

  // ── Pagination ────────────────────────────────────────────────────────────
  onPageChange(page: number): void {
    if (this.clientSide()) this.#internalPage.set(page);
    this.pageChange.emit({ page, pageSize: this.effectivePageSize() });
  }

  onPageSizeChange(event: Event): void {
    const size = +(event.target as HTMLSelectElement).value;
    if (this.clientSide()) {
      this.#internalPageSize.set(size);
      this.#internalPage.set(1);
    }
    this.pageChange.emit({ page: 1, pageSize: size });
  }

  // ── Cell rendering ────────────────────────────────────────────────────────
  getCellValue(row: T, col: TableColumn<T>): any {
    const raw = deepGet(row, col.key);
    return col.valueFormatter ? col.valueFormatter(raw, row) : raw;
  }

  formatCell(row: T, col: TableColumn<T>): string {
    const val = this.getCellValue(row, col);
    if (val == null) return '—';
    switch (col.type) {
      case 'date':
        return formatDate(val, col.dateFormat ?? 'dd/MM/yyyy');
      case 'number':
        return typeof val === 'number' ? val.toLocaleString('es-ES') : String(val);
      default:
        return String(val);
    }
  }

  // ── Row interaction ───────────────────────────────────────────────────────
  onRowClick(row: T): void {
    this.rowClick.emit(row);
    if (this.selectable() && this.selectMode() === 'single') {
      this.toggleRow(row);
    }
  }

  rowTrack(row: T, index: number): any {
    const key = this.rowKey();
    return key ? deepGet(row, key) : index;
  }

  colSpanCount(): number {
    return (
      this.visibleColumns().length +
      (this.selectable() ? 1 : 0) +
      (this.hasActions() ? 1 : 0) +
      (this.expandable() ? 1 : 0)
    );
  }

  // ── Global filter ─────────────────────────────────────────────────────────
  onFilterChange(value: string): void {
    this.filterValue.set(value);
    if (this.clientSide()) this.#internalPage.set(1);
    this.filterChange.emit(value);
  }

  // ── Column visibility ─────────────────────────────────────────────────────
  isColumnMenuOpen(): boolean {
    return this.#columnMenuOpen();
  }

  toggleColumnMenu(event: Event): void {
    event.stopPropagation();
    this.#openMenuId.set(null);
    this.#columnMenuOpen.set(!this.#columnMenuOpen());
  }

  isColumnVisible(key: string): boolean {
    const keys = this.visibleColumnKeys();
    return keys === null ? true : keys.includes(key);
  }

  toggleColumn(key: string): void {
    const keys = this.visibleColumnKeys() ?? this.hideableColumns().map((c) => c.key);
    const next = keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key];
    this.visibleColumnKeys.set(next);
    this.columnVisibilityChange.emit(next);
  }

  // ── Expandable rows ───────────────────────────────────────────────────────
  readonly #expandedSet = computed((): Set<any> => {
    const key = this.rowKey();
    const expanded = this.expandedRows();
    return key ? new Set(expanded.map((r) => deepGet(r, key))) : new Set(expanded);
  });

  isExpanded(row: T): boolean {
    const key = this.rowKey();
    return key ? this.#expandedSet().has(deepGet(row, key)) : this.#expandedSet().has(row);
  }

  toggleExpand(row: T, event?: Event): void {
    event?.stopPropagation();
    const key = this.rowKey();
    const expanded = this.expandedRows();
    let next: T[];
    if (this.isExpanded(row)) {
      next = key
        ? expanded.filter((r) => deepGet(r, key) !== deepGet(row, key))
        : expanded.filter((r) => r !== row);
    } else {
      next = this.singleExpand() ? [row] : [...expanded, row];
    }
    this.expandedRows.set(next);
    this.rowExpandChange.emit(next);
  }

  // ── Action menu ───────────────────────────────────────────────────────────
  #rowMenuId(row: T): any {
    const key = this.rowKey();
    return key ? deepGet(row, key) : row;
  }

  isMenuOpen(row: T): boolean {
    return this.#openMenuId() === this.#rowMenuId(row);
  }

  toggleMenu(row: T, event: Event): void {
    event.stopPropagation();
    this.#columnMenuOpen.set(false);
    const id = this.#rowMenuId(row);
    this.#openMenuId.set(this.#openMenuId() === id ? null : id);
  }

  isActionVisible(action: TableAction<T>, row: T): boolean {
    return action.show ? action.show(row) : true;
  }

  isActionDisabled(action: TableAction<T>, row: T): boolean {
    return action.disabled ? action.disabled(row) : false;
  }

  onActionClick(action: TableAction<T>, row: T, event: Event): void {
    event.stopPropagation();
    if (!this.isActionDisabled(action, row)) {
      this.#openMenuId.set(null);
      action.onClick(row, event);
    }
  }
  onAddClick(): void {
    this.addClick.emit();
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function deepGet(obj: any, path: string): any {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

function formatDate(value: any, fmt: string): string {
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return String(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return fmt
    .replace('dd', pad(d.getDate()))
    .replace('MM', pad(d.getMonth() + 1))
    .replace('yyyy', String(d.getFullYear()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()));
}
