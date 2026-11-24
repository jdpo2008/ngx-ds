import { Component, TemplateRef, computed, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TableAction, TableColumn, TableComponent } from './table.component';
import { NGX_DS_LABELS, NGX_DS_LABELS_EN } from '../../shared/labels';

interface Row {
  id: number;
  name: string;
  city: { name: string };
  age: number | null;
}

const ROWS: Row[] = [
  { id: 1, name: 'Ana', city: { name: 'Madrid' }, age: 30 },
  { id: 2, name: 'Luis', city: { name: 'Sevilla' }, age: null },
  { id: 3, name: 'Bea', city: { name: 'Bilbao' }, age: 25 },
];

const COLUMNS: TableColumn<Row>[] = [
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'city.name', label: 'Ciudad' },
  { key: 'age', label: 'Edad', sortable: true, type: 'number' },
];

describe('TableComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent<TableComponent<Row>>(TableComponent);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('clientSide', true);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return { fixture, cmp: fixture.componentInstance };
  }
  const names = (rows: Row[]) => rows.map((r) => r.name);

  it('reads nested keys and formats empty cells', () => {
    const { cmp } = setup();
    expect(cmp.formatCell(ROWS[0], COLUMNS[1])).toBe('Madrid');
    expect(cmp.formatCell(ROWS[1], COLUMNS[2])).toBe('—');
  });

  it('sorts client-side, toggling direction and keeping nulls last', () => {
    const { cmp } = setup();
    cmp.onSort(COLUMNS[0]);
    expect(names(cmp.processedData())).toEqual(['Ana', 'Bea', 'Luis']);
    cmp.onSort(COLUMNS[0]);
    expect(names(cmp.processedData())).toEqual(['Luis', 'Bea', 'Ana']);
    cmp.onSort(COLUMNS[2]);
    expect(names(cmp.processedData())).toEqual(['Bea', 'Ana', 'Luis']);
  });

  it('ignores non-sortable columns', () => {
    const { cmp } = setup();
    cmp.onSort(COLUMNS[1]);
    expect(cmp.effectiveSort()).toBeNull();
  });

  it('applies the global filter over visible columns', () => {
    const { cmp } = setup({ globalFilter: true });
    cmp.onFilterChange('sevi');
    expect(names(cmp.processedData())).toEqual(['Luis']);
  });

  it('filters by filterKeys only, including keys that are not columns', () => {
    const { cmp } = setup({ globalFilter: true, filterKeys: ['id'] });
    cmp.onFilterChange('2');
    expect(names(cmp.processedData())).toEqual(['Luis']);
    cmp.onFilterChange('ana');
    expect(cmp.processedData()).toEqual([]);
  });

  it('paginates client-side', () => {
    const { cmp } = setup({ paginated: true });
    cmp.onPageSizeChange({ target: { value: '2' } } as unknown as Event);
    expect(cmp.totalPages()).toBe(2);
    expect(names(cmp.processedData())).toEqual(['Ana', 'Luis']);
    cmp.onPageChange(2);
    expect(names(cmp.processedData())).toEqual(['Bea']);
    expect([cmp.pageStart(), cmp.pageEnd()]).toEqual([3, 3]);
  });

  it('starts client-side pagination from the page and pageSize inputs', () => {
    const { fixture, cmp } = setup({ paginated: true, pageSize: 2, page: 2 });
    expect(cmp.effectivePageSize()).toBe(2);
    expect(cmp.effectivePage()).toBe(2);
    expect(names(cmp.processedData())).toEqual(['Bea']);
    fixture.componentRef.setInput('pageSize', 1);
    fixture.componentRef.setInput('page', 1);
    expect(names(cmp.processedData())).toEqual(['Ana']);
  });

  it('stays on the last page when client-side data shrinks below the current page', () => {
    const { fixture, cmp } = setup({ paginated: true, pageSize: 2, page: 2 });
    fixture.componentRef.setInput('data', ROWS.slice(0, 2));
    expect(cmp.effectivePage()).toBe(1);
    expect(names(cmp.processedData())).toEqual(['Ana', 'Luis']);
    expect([cmp.pageStart(), cmp.pageEnd()]).toEqual([1, 2]);
  });

  it('sorts text with the locale, ignoring case and accents', () => {
    const data = [
      { id: 1, name: 'beto', city: { name: 'X' }, age: 1 },
      { id: 2, name: 'Álvaro', city: { name: 'X' }, age: 2 },
      { id: 3, name: 'Carla', city: { name: 'X' }, age: 3 },
      { id: 4, name: 'item 10', city: { name: 'X' }, age: 4 },
      { id: 5, name: 'item 9', city: { name: 'X' }, age: 5 },
    ];
    const { cmp } = setup({ data });
    cmp.onSort(COLUMNS[0]);
    expect(names(cmp.processedData())).toEqual(['Álvaro', 'beto', 'Carla', 'item 9', 'item 10']);
  });

  it('uses the server-side total for the page count', () => {
    const { cmp } = setup({ clientSide: false, paginated: true, total: 95, page: 3 });
    expect(cmp.totalPages()).toBe(10);
    expect([cmp.pageStart(), cmp.pageEnd()]).toEqual([21, 30]);
    expect(cmp.processedData()).toHaveLength(3);
  });

  it('selects rows by rowKey and toggles all', () => {
    const { cmp } = setup({ selectable: true, rowKey: 'id' });
    cmp.toggleRow({ ...ROWS[0] });
    expect(cmp.isSelected(ROWS[0])).toBe(true);
    expect(cmp.someSelected()).toBe(true);
    cmp.toggleAll(true);
    expect(cmp.allSelected()).toBe(true);
    expect(cmp.selectedRows()).toHaveLength(3);
    cmp.toggleAll(false);
    expect(cmp.selectedRows()).toEqual([]);
  });

  it('keeps a single row in single select mode', () => {
    const { cmp } = setup({ selectable: true, selectMode: 'single' });
    cmp.onRowClick(ROWS[0]);
    cmp.onRowClick(ROWS[1]);
    expect(cmp.selectedRows()).toEqual([ROWS[1]]);
  });

  it('hides columns not in visibleColumnKeys', () => {
    const { cmp } = setup({ visibleColumnKeys: ['name'] });
    expect(cmp.visibleColumns().map((c) => c.key)).toEqual(['name']);
  });
});

describe('TableComponent rendering', () => {
  function render(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent<TableComponent<Row>>(TableComponent);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('columns', COLUMNS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const cells = (row: number) =>
      Array.from(el.querySelectorAll('tbody tr')[row].querySelectorAll('td')).map((td) =>
        td.textContent!.trim(),
      );
    return { fixture, cmp: fixture.componentInstance, el, cells };
  }

  it('renders headers and formatted cells', () => {
    const { el, cells } = render();
    expect(Array.from(el.querySelectorAll('th')).map((th) => th.textContent!.trim())).toEqual([
      'Nombre',
      'Ciudad',
      'Edad',
    ]);
    expect(cells(0)).toEqual(['Ana', 'Madrid', '30']);
    expect(cells(1)).toEqual(['Luis', 'Sevilla', '—']);
  });

  it('sorts from a header click and exposes aria-sort', () => {
    const { fixture, el, cells } = render({ clientSide: true });
    const th = el.querySelectorAll('th')[0];
    th.click();
    fixture.detectChanges();
    expect(th.getAttribute('aria-sort')).toBe('ascending');
    expect(cells(0)[0]).toBe('Ana');
    th.click();
    fixture.detectChanges();
    expect(th.getAttribute('aria-sort')).toBe('descending');
    expect(cells(0)[0]).toBe('Luis');
    expect(el.querySelectorAll('th')[1].getAttribute('aria-sort')).toBeNull();
    el.querySelectorAll('th')[1].click();
    fixture.detectChanges();
    expect(th.getAttribute('aria-sort')).toBe('descending');
  });

  it('only emits sortChange in server-side mode, leaving the rows as given', () => {
    const { fixture, cmp, el, cells } = render({ sort: { column: 'name', direction: 'asc' } });
    const sorts: unknown[] = [];
    cmp.sortChange.subscribe((s) => sorts.push(s));
    expect(el.querySelectorAll('th')[0].getAttribute('aria-sort')).toBe('ascending');
    el.querySelectorAll('th')[0].click();
    fixture.detectChanges();
    expect(sorts).toEqual([{ column: 'name', direction: 'desc' }]);
    expect(cells(0)[0]).toBe('Ana');
  });

  it('renders date, number, boolean, badge and formatted cells', () => {
    type Any = Record<string, unknown>;
    const columns: TableColumn<Any>[] = [
      { key: 'when', label: 'When', type: 'date' },
      { key: 'at', label: 'At', type: 'date', dateFormat: 'yyyy-MM-dd HH:mm' },
      { key: 'bad', label: 'Bad', type: 'date' },
      { key: 'n', label: 'N', type: 'number' },
      { key: 'ok', label: 'Ok', type: 'boolean' },
      { key: 'status', label: 'Status', type: 'badge', badgeColor: 'success' },
      { key: 'price', label: 'Price', valueFormatter: (v: number) => `${v} €` },
    ];
    const fixture = TestBed.createComponent<TableComponent<Any>>(TableComponent);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('data', [
      {
        when: new Date(2024, 0, 5),
        at: new Date(2024, 11, 31, 9, 7).getTime(),
        bad: 'nope',
        n: 1234.5,
        ok: true,
        status: 'Activo',
        price: 10,
      },
    ]);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const tds = Array.from(el.querySelectorAll('tbody td'));
    expect(tds[0].textContent!.trim()).toBe('05/01/2024');
    expect(tds[1].textContent!.trim()).toBe('2024-12-31 09:07');
    expect(tds[2].textContent!.trim()).toBe('nope');
    expect(tds[3].textContent!.trim()).toBe((1234.5).toLocaleString('es-ES'));
    expect(tds[4].querySelector('.ngx-table__bool--true')).not.toBeNull();
    expect(tds[5].querySelector('ngx-ds-badge')!.textContent!.trim()).toBe('Activo');
    expect(tds[6].textContent!.trim()).toBe('10 €');
  });

  it('shows skeleton rows while loading', () => {
    const { el } = render({ loading: true, loadingRows: 2, selectable: true });
    const rows = el.querySelectorAll('tbody .ngx-table__row--skeleton');
    expect(rows.length).toBe(2);
    expect(rows[0].querySelectorAll('td').length).toBe(4); // 3 columns + checkbox
  });

  it('shows the empty state with the add button, and emits addClick', () => {
    const { cmp, el } = render({ data: [], emptyMessage: 'Nada', addLabel: 'Nuevo' });
    const adds: unknown[] = [];
    cmp.addClick.subscribe(() => adds.push(1));
    expect(el.querySelector('ngx-ds-empty-state')!.textContent).toContain('Nada');
    const buttons = el.querySelectorAll<HTMLElement>('ngx-ds-button');
    expect(buttons.length).toBe(2); // toolbar + empty state
    expect(buttons[0].textContent!.trim()).toBe('Nuevo');
    buttons[0].querySelector('button')!.click();
    buttons[1].querySelector('button')!.click();
    expect(adds.length).toBe(2);
  });

  it('hides the toolbar when it has nothing to show', () => {
    const { el } = render({ showAddButton: false });
    expect(el.querySelector('.ngx-table__toolbar')).toBeNull();
  });

  it('filters from the toolbar search input', () => {
    const { fixture, cmp, el } = render({ clientSide: true, globalFilter: true });
    const filters: string[] = [];
    cmp.filterChange.subscribe((v) => filters.push(v));
    const input = el.querySelector<HTMLInputElement>('.ngx-table__toolbar input')!;
    input.value = 'bil';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(filters.at(-1)).toBe('bil');
    expect(el.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('toggles columns from the column menu', () => {
    const columns = [...COLUMNS, { key: 'id', label: 'Id', hideable: false }];
    const { fixture, cmp, el } = render({ columnToggle: true, columns });
    const changes: string[][] = [];
    cmp.columnVisibilityChange.subscribe((k) => changes.push(k));
    el.querySelector<HTMLElement>('.ngx-table__column-menu ngx-ds-icon-button')!.click();
    fixture.detectChanges();
    const boxes = el.querySelectorAll('.ngx-table__column-panel ngx-ds-checkbox');
    expect(boxes.length).toBe(3); // the non-hideable column is not listed
    boxes[1].querySelector('input')!.click();
    fixture.detectChanges();
    expect(changes).toEqual([['name', 'age']]);
    expect(cmp.visibleColumns().map((c) => c.key)).toEqual(['name', 'age', 'id']);
    expect(el.querySelectorAll('thead th').length).toBe(3);
    cmp.toggleColumn('city.name');
    expect(cmp.isColumnVisible('city.name')).toBe(true);
  });

  it('closes the column menu on an outside click', () => {
    const { fixture, cmp } = render({ columnToggle: true });
    cmp.toggleColumnMenu(new Event('click'));
    expect(cmp.isColumnMenuOpen()).toBe(true);
    document.body.click();
    expect(cmp.isColumnMenuOpen()).toBe(false);
    fixture.destroy();
  });

  it('selects rows from the checkboxes and the header checkbox', () => {
    const { fixture, cmp, el } = render({ selectable: true, rowKey: 'id' });
    const changes: Row[][] = [];
    cmp.selectionChange.subscribe((r) => changes.push(r));
    const rowBoxes = () => el.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]');
    rowBoxes()[1].click();
    fixture.detectChanges();
    expect(changes.at(-1)!.map((r) => r.id)).toEqual([2]);
    expect(el.querySelectorAll('.ngx-table__row--selected').length).toBe(1);
    el.querySelector<HTMLInputElement>('thead input[type="checkbox"]')!.click();
    fixture.detectChanges();
    expect(cmp.allSelected()).toBe(true);
    rowBoxes()[1].click();
    fixture.detectChanges();
    expect(changes.at(-1)!.map((r) => r.id)).not.toContain(2);
    expect(changes.at(-1)).toHaveLength(2);
  });

  it('uses radio buttons in single select mode without a double toggle', () => {
    const { fixture, cmp, el } = render({ selectable: true, selectMode: 'single' });
    const clicks: Row[] = [];
    cmp.rowClick.subscribe((r) => clicks.push(r));
    expect(el.querySelector('thead input[type="checkbox"]')).toBeNull();
    const radios = el.querySelectorAll<HTMLButtonElement>('.ngx-table__radio');
    radios[2].click();
    fixture.detectChanges();
    expect(cmp.selectedRows()).toEqual([ROWS[2]]);
    expect(radios[2].getAttribute('aria-checked')).toBe('true');
    expect(clicks).toEqual([]);
    (el.querySelectorAll('tbody tr')[0] as HTMLElement).click();
    expect(cmp.selectedRows()).toEqual([ROWS[0]]);
    expect(clicks).toEqual([ROWS[0]]);
  });

  it('opens one row action menu at a time and runs enabled actions', () => {
    const ran: string[] = [];
    const actions: TableAction<Row>[] = [
      { label: 'Edit', onClick: (r) => ran.push(`edit ${r.id}`) },
      { label: 'Delete', disabled: (r) => r.id === 1, onClick: (r) => ran.push(`del ${r.id}`) },
      { label: 'Hidden', show: () => false, onClick: () => ran.push('hidden') },
    ];
    const { fixture, cmp, el } = render({ actions, rowKey: 'id' });
    const toggles = () =>
      el.querySelectorAll<HTMLElement>('.ngx-table__action-menu > ngx-ds-icon-button');
    const items = () =>
      Array.from(el.querySelectorAll<HTMLButtonElement>('.ngx-table__action-panel button'));
    toggles()[0].click();
    fixture.detectChanges();
    expect(items().map((b) => b.textContent!.trim())).toEqual(['Edit', 'Delete']);
    expect(items()[1].disabled).toBe(true);
    cmp.onActionClick(actions[1], ROWS[0], new Event('click'));
    expect(ran).toEqual([]);
    expect(cmp.isMenuOpen(ROWS[0])).toBe(true);
    toggles()[1].click();
    fixture.detectChanges();
    expect(cmp.isMenuOpen(ROWS[0])).toBe(false);
    expect(cmp.isMenuOpen(ROWS[1])).toBe(true);
    items()[1].click();
    fixture.detectChanges();
    expect(ran).toEqual(['del 2']);
    expect(el.querySelector('.ngx-table__action-panel')).toBeNull();
  });

  it('paginates from the footer and shows the range', () => {
    const { fixture, cmp, el } = render({
      clientSide: true,
      paginated: true,
      pageSizeOptions: [2, 5],
    });
    const pages: unknown[] = [];
    cmp.pageChange.subscribe((p) => pages.push(p));
    const info = () => el.querySelector('.ngx-table__page-info')!.textContent!.trim();
    const select = el.querySelector<HTMLSelectElement>('.ngx-table__page-size-select')!;
    select.value = '2';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(pages).toEqual([{ page: 1, pageSize: 2 }]);
    expect(info()).toBe('1–2 de 3');
    cmp.onPageChange(2);
    fixture.detectChanges();
    expect(info()).toBe('3–3 de 3');
    expect(pages.at(-1)).toEqual({ page: 2, pageSize: 2 });
  });

  it('shows zero results in the footer when there is no data', () => {
    const { el } = render({ data: [], paginated: true });
    expect(el.querySelector('.ngx-table__page-info')!.textContent!.trim()).toBe('0 resultados');
  });
});

describe('TableComponent templates and expandable rows', () => {
  @Component({
    standalone: true,
    imports: [TableComponent],
    template: `
      <ng-template #cell let-row let-value="value">[{{ value }}:{{ row.id }}]</ng-template>
      <ng-template #header let-column="column">H-{{ column.label }}</ng-template>
      <ng-template #detail let-row>Detalle {{ row.name }}</ng-template>
      <ng-template #empty>Vacío propio</ng-template>
      <ngx-ds-table
        [data]="data()"
        [columns]="columns()"
        [expandable]="true"
        [singleExpand]="single()"
        [expandTemplate]="detail"
        [emptyTemplate]="empty"
        rowKey="id"
      />
    `,
  })
  class TemplateHost {
    readonly cell = viewChild.required<TemplateRef<unknown>>('cell');
    readonly header = viewChild.required<TemplateRef<unknown>>('header');
    readonly data = signal<Row[]>(ROWS);
    readonly single = signal(false);
    readonly columns = computed<TableColumn<Row>[]>(() => [
      {
        key: 'name',
        label: 'Nombre',
        cellTemplate: this.cell() as TableColumn<Row>['cellTemplate'],
        headerTemplate: this.header() as TableColumn<Row>['headerTemplate'],
      },
    ]);
  }

  function setup() {
    const fixture = TestBed.createComponent(TemplateHost);
    fixture.detectChanges();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const table = fixture.debugElement.query(By.directive(TableComponent))
      .componentInstance as TableComponent<Row>;
    return { fixture, host: fixture.componentInstance, el, table };
  }

  it('renders cell and header templates', () => {
    const { el } = setup();
    expect(el.querySelectorAll('th')[1].textContent!.trim()).toBe('H-Nombre');
    expect(el.querySelector('tbody tr td:nth-child(2)')!.textContent!.trim()).toBe('[Ana:1]');
  });

  it('expands rows with the detail template, several at a time', () => {
    const { fixture, el, table } = setup();
    const changes: Row[][] = [];
    table.rowExpandChange.subscribe((r) => changes.push(r));
    const toggles = () =>
      el.querySelectorAll<HTMLElement>('.ngx-table__td--expand ngx-ds-icon-button');
    toggles()[0].click();
    fixture.detectChanges();
    toggles()[1].click();
    fixture.detectChanges();
    expect(
      Array.from(el.querySelectorAll('.ngx-table__row--detail')).map((r) => r.textContent!.trim()),
    ).toEqual(['Detalle Ana', 'Detalle Luis']);
    expect(toggles()[0].querySelector('button')!.getAttribute('aria-expanded')).toBe('true');
    expect(changes.at(-1)!.map((r) => r.id)).toEqual([1, 2]);
    table.toggleExpand({ ...ROWS[0] });
    expect(table.isExpanded(ROWS[0])).toBe(false);
    expect(table.isExpanded(ROWS[1])).toBe(true);
  });

  it('keeps one expanded row with singleExpand', () => {
    const { fixture, host, table } = setup();
    host.single.set(true);
    fixture.detectChanges();
    table.toggleExpand(ROWS[0]);
    table.toggleExpand(ROWS[2]);
    expect(table.expandedRows()).toEqual([ROWS[2]]);
  });

  it('renders a custom empty template', () => {
    const { fixture, host, el } = setup();
    host.data.set([]);
    fixture.detectChanges();
    const td = el.querySelector('.ngx-table__td--empty')!;
    expect(td.textContent!.trim()).toBe('Vacío propio');
    expect(td.getAttribute('colspan')).toBe('2');
  });
});

describe('TableComponent keyboard and ARIA', () => {
  function render(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent<TableComponent<Row>>(TableComponent);
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.componentRef.setInput('rowKey', 'id');
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    document.body.appendChild(el);
    return { fixture, cmp: fixture.componentInstance, el };
  }
  const escape = () =>
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

  afterEach(() => document.body.querySelectorAll('ngx-ds-table').forEach((n) => n.remove()));

  it('sets aria-expanded on the buttons that open menus and rows', () => {
    const actions: TableAction<Row>[] = [{ label: 'Edit', onClick: () => undefined }];
    const { fixture, el } = render({ actions, columnToggle: true, expandable: true });
    const expand = el.querySelector<HTMLButtonElement>('.ngx-table__td--expand button')!;
    const columns = el.querySelector<HTMLButtonElement>('.ngx-table__column-menu button')!;
    const rowMenu = el.querySelector<HTMLButtonElement>('.ngx-table__action-menu button')!;
    expect([expand, columns, rowMenu].map((b) => b.getAttribute('aria-expanded'))).toEqual([
      'false',
      'false',
      'false',
    ]);
    expand.click();
    columns.click();
    fixture.detectChanges();
    expect(expand.getAttribute('aria-expanded')).toBe('true');
    expect(columns.getAttribute('aria-expanded')).toBe('true');
    rowMenu.click();
    fixture.detectChanges();
    expect(rowMenu.getAttribute('aria-expanded')).toBe('true');
  });

  it('Escape closes the row action menu and returns focus to its button', () => {
    const actions: TableAction<Row>[] = [{ label: 'Edit', onClick: () => undefined }];
    const { fixture, cmp, el } = render({ actions });
    const toggle = el.querySelectorAll<HTMLButtonElement>('.ngx-table__action-menu button')[1];
    toggle.click();
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('.ngx-table__action-panel button')!.focus();
    escape();
    fixture.detectChanges();
    expect(cmp.isMenuOpen(ROWS[1])).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it('Escape closes the column menu and returns focus to its button', () => {
    const { fixture, cmp, el } = render({ columnToggle: true });
    const toggle = el.querySelector<HTMLButtonElement>('.ngx-table__column-menu button')!;
    toggle.click();
    fixture.detectChanges();
    el.querySelector<HTMLInputElement>('.ngx-table__column-panel input')!.focus();
    escape();
    fixture.detectChanges();
    expect(cmp.isColumnMenuOpen()).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it('Escape leaves focus alone when it is outside the table', () => {
    const { fixture, cmp } = render({ columnToggle: true });
    cmp.toggleColumnMenu(new Event('click'));
    fixture.detectChanges();
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();
    escape();
    expect(cmp.isColumnMenuOpen()).toBe(false);
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });

  it('sortable headers can be focused and sorted with Enter and Space', () => {
    const { fixture, cmp, el } = render({ clientSide: true });
    const [name, city] = Array.from(el.querySelectorAll<HTMLElement>('th'));
    expect(name.tabIndex).toBe(0);
    expect(city.hasAttribute('tabindex')).toBe(false);
    const sorts: unknown[] = [];
    cmp.sortChange.subscribe((s) => sorts.push(s));
    name.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
    const space = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
    name.dispatchEvent(space);
    city.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(sorts).toEqual([
      { column: 'name', direction: 'asc' },
      { column: 'name', direction: 'desc' },
    ]);
    expect(space.defaultPrevented).toBe(true);
    expect(name.getAttribute('aria-sort')).toBe('descending');
  });

  const key = (target: HTMLElement, k: string) => {
    const event = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
  };
  const bodyRows = (el: HTMLElement) =>
    Array.from(el.querySelectorAll<HTMLElement>('tbody tr.ngx-table__row'));

  it('clickable rows are focusable and activate with Enter and Space', () => {
    const { cmp, el } = render({ rowClickable: true });
    const clicks: Row[] = [];
    cmp.rowClick.subscribe((r) => clicks.push(r));
    const rows = bodyRows(el);
    expect(rows.map((r) => r.tabIndex)).toEqual([0, 0, 0]);
    key(rows[0], 'Enter');
    const space = key(rows[2], ' ');
    key(rows[1], 'a');
    expect(clicks).toEqual([ROWS[0], ROWS[2]]);
    expect(space.defaultPrevented).toBe(true);
  });

  it('ignores row keys that come from controls inside the row', () => {
    const actions: TableAction<Row>[] = [{ label: 'Edit', onClick: () => undefined }];
    const { cmp, el } = render({ rowClickable: true, selectable: true, actions });
    const clicks: Row[] = [];
    cmp.rowClick.subscribe((r) => clicks.push(r));
    key(el.querySelector<HTMLInputElement>('tbody input[type="checkbox"]')!, 'Enter');
    key(el.querySelector<HTMLButtonElement>('.ngx-table__action-menu button')!, ' ');
    expect(clicks).toEqual([]);
  });

  it('leaves rows that are not clickable out of the tab order', () => {
    const { cmp, el } = render();
    const clicks: Row[] = [];
    cmp.rowClick.subscribe((r) => clicks.push(r));
    const rows = bodyRows(el);
    expect(rows.some((r) => r.hasAttribute('tabindex'))).toBe(false);
    key(rows[0], 'Enter');
    expect(clicks).toEqual([]);
  });

  it('gives each row control a label with its row number, across pages', () => {
    const actions: TableAction<Row>[] = [{ label: 'Edit', onClick: () => undefined }];
    const { fixture, el } = render({
      actions,
      selectable: true,
      expandable: true,
      clientSide: true,
      paginated: true,
      pageSize: 2,
    });
    const labels = (selector: string) =>
      Array.from(el.querySelectorAll(selector)).map((n) => n.getAttribute('aria-label'));
    expect(labels('.ngx-table__td--expand button')).toEqual(['Expandir fila 1', 'Expandir fila 2']);
    expect(labels('tbody input[type="checkbox"]')).toEqual([
      'Seleccionar fila 1',
      'Seleccionar fila 2',
    ]);
    expect(labels('.ngx-table__action-menu button')).toEqual([
      'Acciones de la fila 1',
      'Acciones de la fila 2',
    ]);
    fixture.componentInstance.onPageChange(2);
    fixture.detectChanges();
    expect(labels('tbody input[type="checkbox"]')).toEqual(['Seleccionar fila 3']);
  });

  it('keeps consumer label overrides, adding the row number', () => {
    TestBed.overrideProvider(NGX_DS_LABELS, {
      useValue: { ...NGX_DS_LABELS_EN, selectRow: 'Pick' },
    });
    const { el } = render({ selectable: true, selectMode: 'single' });
    const radios = Array.from(el.querySelectorAll('.ngx-table__radio'));
    expect(radios.map((r) => r.getAttribute('aria-label'))).toEqual(['Pick 1', 'Pick 2', 'Pick 3']);
  });

  it('the radio of the selected row keeps the selection', () => {
    const { fixture, cmp, el } = render({ selectable: true, selectMode: 'single' });
    const radio = () => el.querySelectorAll<HTMLButtonElement>('.ngx-table__radio')[1];
    radio().click();
    fixture.detectChanges();
    radio().click();
    fixture.detectChanges();
    expect(cmp.selectedRows()).toEqual([ROWS[1]]);
    expect(radio().getAttribute('aria-checked')).toBe('true');
  });

  it('the row action button exposes popup semantics and the panel it controls', () => {
    const actions: TableAction<Row>[] = [{ label: 'Edit', onClick: () => undefined }];
    const { fixture, el } = render({ actions });
    const toggle = el.querySelectorAll<HTMLButtonElement>('.ngx-table__action-menu button')[1];
    expect(toggle.getAttribute('aria-haspopup')).toBe('true');
    expect(toggle.hasAttribute('aria-controls')).toBe(false);
    toggle.click();
    fixture.detectChanges();
    const panel = el.querySelector<HTMLElement>('.ngx-table__action-panel')!;
    expect(panel.id).toBeTruthy();
    expect(toggle.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('role')).toBe('group');
  });

  it('moves focus into the row action menu when it opens, skipping disabled actions', () => {
    const actions: TableAction<Row>[] = [
      { label: 'Delete', disabled: () => true, onClick: () => undefined },
      { label: 'Edit', onClick: () => undefined },
    ];
    const { fixture, el } = render({ actions });
    const toggle = el.querySelectorAll<HTMLButtonElement>('.ngx-table__action-menu button')[0];
    toggle.focus();
    toggle.click();
    fixture.detectChanges();
    expect(document.activeElement!.textContent!.trim()).toBe('Edit');
    toggle.click();
    fixture.detectChanges();
    expect(el.querySelector('.ngx-table__action-panel')).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });

  it('returns focus to the row action button when an action runs', () => {
    let focusedDuringAction: Element | null = null;
    const actions: TableAction<Row>[] = [
      { label: 'Edit', onClick: () => (focusedDuringAction = document.activeElement) },
    ];
    const { fixture, el } = render({ actions });
    const toggle = el.querySelectorAll<HTMLButtonElement>('.ngx-table__action-menu button')[2];
    toggle.click();
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('.ngx-table__action-panel button')!.click();
    fixture.detectChanges();
    expect(el.querySelector('.ngx-table__action-panel')).toBeNull();
    expect(focusedDuringAction).toBe(toggle);
    expect(document.activeElement).toBe(toggle);
  });

  it('marks the table busy while loading and announces the page range', () => {
    const { fixture, el } = render({ loading: true, paginated: true });
    const table = el.querySelector('table')!;
    expect(table.getAttribute('aria-busy')).toBe('true');
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    expect(table.hasAttribute('aria-busy')).toBe(false);
    expect(el.querySelector('.ngx-table__page-info')!.getAttribute('aria-live')).toBe('polite');
  });

  it('names the actions header with actionsLabel, keeping the visible dots', () => {
    const actions: TableAction<Row>[] = [{ label: 'Edit', onClick: () => undefined }];
    const { fixture, el } = render({ actions });
    const th = () => el.querySelector('.ngx-table__th--actions')!;
    expect(th().querySelector('.ngx-table__sr-only')!.textContent!.trim()).toBe(
      'Acciones de la fila',
    );
    expect(th().querySelector('[aria-hidden="true"]')!.textContent).toBe('...');
    fixture.componentRef.setInput('actionsLabel', 'Opciones');
    fixture.detectChanges();
    expect(th().querySelector('.ngx-table__sr-only')!.textContent!.trim()).toBe('Opciones');
  });
});
