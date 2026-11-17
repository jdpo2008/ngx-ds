import { TestBed } from '@angular/core/testing';
import { TableColumn, TableComponent } from './table.component';

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

  it('paginates client-side', () => {
    const { cmp } = setup({ paginated: true });
    cmp.onPageSizeChange({ target: { value: '2' } } as unknown as Event);
    expect(cmp.totalPages()).toBe(2);
    expect(names(cmp.processedData())).toEqual(['Ana', 'Luis']);
    cmp.onPageChange(2);
    expect(names(cmp.processedData())).toEqual(['Bea']);
    expect([cmp.pageStart(), cmp.pageEnd()]).toEqual([3, 3]);
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
