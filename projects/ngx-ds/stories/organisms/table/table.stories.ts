import { Meta, StoryObj } from '@storybook/angular';
import { AfterViewInit, Component, signal, TemplateRef, viewChild } from '@angular/core';
import {
  TableComponent,
  TableAction,
  TableColumn,
  TableSort,
  TablePageEvent,
} from '../../../src/lib/organisms/table/table.component';
import { Pencil, Trash2, Eye, Copy } from 'lucide-angular';

// ── Mock data ─────────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  score: number;
  joinedAt: string;
  department: string;
}

const USERS: User[] = [
  {
    id: 1,
    name: 'Ana García',
    email: 'ana@example.com',
    role: 'Admin',
    active: true,
    score: 98,
    joinedAt: '2022-03-15',
    department: 'Ingeniería',
  },
  {
    id: 2,
    name: 'Luis Martínez',
    email: 'luis@example.com',
    role: 'Editor',
    active: true,
    score: 85,
    joinedAt: '2021-07-22',
    department: 'Diseño',
  },
  {
    id: 3,
    name: 'Carla López',
    email: 'carla@example.com',
    role: 'Viewer',
    active: false,
    score: 62,
    joinedAt: '2023-01-10',
    department: 'Marketing',
  },
  {
    id: 4,
    name: 'Pedro Sánchez',
    email: 'pedro@example.com',
    role: 'Admin',
    active: true,
    score: 77,
    joinedAt: '2020-11-05',
    department: 'Ingeniería',
  },
  {
    id: 5,
    name: 'María Torres',
    email: 'maria@example.com',
    role: 'Editor',
    active: true,
    score: 91,
    joinedAt: '2022-08-30',
    department: 'Ventas',
  },
  {
    id: 6,
    name: 'Jorge Ruiz',
    email: 'jorge@example.com',
    role: 'Viewer',
    active: false,
    score: 45,
    joinedAt: '2023-04-12',
    department: 'Soporte',
  },
  {
    id: 7,
    name: 'Sofía Díaz',
    email: 'sofia@example.com',
    role: 'Editor',
    active: true,
    score: 88,
    joinedAt: '2021-02-18',
    department: 'Diseño',
  },
  {
    id: 8,
    name: 'Miguel Fernández',
    email: 'miguel@example.com',
    role: 'Admin',
    active: true,
    score: 95,
    joinedAt: '2019-09-01',
    department: 'Ingeniería',
  },
  {
    id: 9,
    name: 'Elena Castro',
    email: 'elena@example.com',
    role: 'Viewer',
    active: true,
    score: 70,
    joinedAt: '2023-06-14',
    department: 'Marketing',
  },
  {
    id: 10,
    name: 'David Morales',
    email: 'david@example.com',
    role: 'Editor',
    active: false,
    score: 55,
    joinedAt: '2022-12-20',
    department: 'Ventas',
  },
  {
    id: 11,
    name: 'Isabel Vega',
    email: 'isabel@example.com',
    role: 'Admin',
    active: true,
    score: 83,
    joinedAt: '2020-05-07',
    department: 'Dirección',
  },
  {
    id: 12,
    name: 'Carlos Herrera',
    email: 'carlos@example.com',
    role: 'Viewer',
    active: true,
    score: 67,
    joinedAt: '2023-02-28',
    department: 'Soporte',
  },
  {
    id: 13,
    name: 'Lucía Jiménez',
    email: 'lucia@example.com',
    role: 'Editor',
    active: false,
    score: 79,
    joinedAt: '2021-10-15',
    department: 'Marketing',
  },
  {
    id: 14,
    name: 'Roberto Navarro',
    email: 'roberto@example.com',
    role: 'Viewer',
    active: true,
    score: 61,
    joinedAt: '2022-07-03',
    department: 'Soporte',
  },
  {
    id: 15,
    name: 'Patricia Molina',
    email: 'patricia@example.com',
    role: 'Admin',
    active: true,
    score: 92,
    joinedAt: '2020-01-20',
    department: 'Dirección',
  },
];

const BASE_COLUMNS: TableColumn<User>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '70px', align: 'center' },
  { key: 'name', label: 'Nombre', sortable: true, minWidth: '160px' },
  { key: 'email', label: 'Email', sortable: false, minWidth: '200px' },
  { key: 'role', label: 'Rol', sortable: true, width: '110px' },
  { key: 'department', label: 'Depto.', sortable: true, minWidth: '140px' },
  {
    key: 'score',
    label: 'Puntuación',
    sortable: true,
    width: '120px',
    align: 'right',
    type: 'number',
  },
  { key: 'joinedAt', label: 'Alta', sortable: true, width: '120px', type: 'date' },
  {
    key: 'active',
    label: 'Activo',
    sortable: true,
    width: '90px',
    align: 'center',
    type: 'boolean',
  },
];

// ── Wrapper components ────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-basic',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem;">
      <ngx-ds-table [data]="users" [columns]="columns" [hoverable]="true" />
    </div>
  `,
})
class BasicWrapper {
  users = USERS.slice(0, 6);
  columns = BASE_COLUMNS;
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-client',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem;">
      <ngx-ds-table
        [data]="users"
        [columns]="columns"
        [clientSide]="true"
        [paginated]="true"
        [pageSize]="5"
        [pageSizeOptions]="[5, 10, 15]"
        [hoverable]="true"
      />
    </div>
  `,
})
class ClientSideWrapper {
  users = USERS;
  columns = BASE_COLUMNS;
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-multiselect',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
      <ngx-ds-table
        [data]="users"
        [columns]="columns"
        [clientSide]="true"
        [paginated]="true"
        [pageSize]="5"
        [pageSizeOptions]="[5, 10]"
        [selectable]="true"
        selectMode="multi"
        rowKey="id"
        [(selectedRows)]="selected"
        [hoverable]="true"
      />
      <p style="font-size: 0.875rem; color: #6b7280;">
        Seleccionados: {{ selected().length }} — IDs: {{ selectedIds() }}
      </p>
    </div>
  `,
})
class MultiSelectWrapper {
  users = USERS;
  columns = BASE_COLUMNS;
  selected = signal<User[]>([]);
  selectedIds() {
    return (
      this.selected()
        .map((u) => u.id)
        .join(', ') || '—'
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-single',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
      <ngx-ds-table
        [data]="users"
        [columns]="columns"
        [selectable]="true"
        selectMode="single"
        rowKey="id"
        [(selectedRows)]="selected"
        [hoverable]="true"
      />
      @if (selected().length) {
        <p style="font-size: 0.875rem; color: #6b7280;">
          Seleccionado: <strong>{{ selected()[0].name }}</strong> — {{ selected()[0].role }}
        </p>
      }
    </div>
  `,
})
class SingleSelectWrapper {
  users = USERS.slice(0, 6);
  columns = BASE_COLUMNS.slice(0, 5);
  selected = signal<User[]>([]);
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-loading',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem;">
      <ngx-ds-table [data]="[]" [columns]="columns" [loading]="true" [loadingRows]="6" />
    </div>
  `,
})
class LoadingWrapper {
  columns = BASE_COLUMNS;
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-empty',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem;">
      <ngx-ds-table
        [data]="[]"
        [columns]="columns"
        emptyMessage="No se encontraron usuarios con los filtros aplicados"
      />
    </div>
  `,
})
class EmptyWrapper {
  columns = BASE_COLUMNS;
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-variants',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 2.5rem;">
      <div>
        <p
          style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin: 0 0 0.5rem;"
        >
          Striped + Dense
        </p>
        <ngx-ds-table [data]="users" [columns]="columns" [striped]="true" [dense]="true" />
      </div>
      <div>
        <p
          style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin: 0 0 0.5rem;"
        >
          Default (hoverable)
        </p>
        <ngx-ds-table [data]="users" [columns]="columns" [hoverable]="true" />
      </div>
    </div>
  `,
})
class VariantsWrapper {
  users = USERS.slice(0, 4);
  columns = BASE_COLUMNS.slice(0, 5);
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-custom',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem;">
      <ngx-ds-table
        [data]="users"
        [columns]="columns"
        [clientSide]="true"
        [paginated]="true"
        [pageSize]="5"
        [pageSizeOptions]="[5, 10]"
        [hoverable]="true"
        rowKey="id"
      />
    </div>

    <ng-template #roleTpl let-row="row">
      <span [style]="badgeStyle(row.role)">{{ row.role }}</span>
    </ng-template>

    <ng-template #scoreTpl let-value>
      <div style="display:flex;align-items:center;gap:0.5rem;min-width:120px;">
        <div style="flex:1;height:6px;background:#e5e7eb;border-radius:9999px;overflow:hidden;">
          <div
            [style.width.%]="value"
            style="height:100%;background:#3b82f6;border-radius:9999px;"
          ></div>
        </div>
        <span style="font-size:0.75rem;color:#6b7280;min-width:1.75rem;text-align:right;">{{
          value
        }}</span>
      </div>
    </ng-template>

    <ng-template #statusTpl let-value>
      <span
        style="display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;font-weight:500;"
        [style.color]="value ? '#16a34a' : '#dc2626'"
      >
        <span
          style="width:6px;height:6px;border-radius:50%;flex-shrink:0;"
          [style.background]="value ? '#22c55e' : '#ef4444'"
        ></span>
        {{ value ? 'Activo' : 'Inactivo' }}
      </span>
    </ng-template>
  `,
})
class CustomCellsWrapper implements AfterViewInit {
  users = USERS;

  columns: TableColumn<User>[] = [
    { key: 'id', label: 'ID', sortable: true, width: '70px', align: 'center' },
    { key: 'name', label: 'Nombre', sortable: true, minWidth: '160px' },
    { key: 'role', label: 'Rol', sortable: true, width: '120px' },
    { key: 'score', label: 'Puntuación', sortable: true, minWidth: '180px' },
    { key: 'active', label: 'Estado', sortable: true, width: '110px' },
  ];

  readonly roleTpl = viewChild<TemplateRef<any>>('roleTpl');
  readonly scoreTpl = viewChild<TemplateRef<any>>('scoreTpl');
  readonly statusTpl = viewChild<TemplateRef<any>>('statusTpl');

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'id', label: 'ID', sortable: true, width: '70px', align: 'center' },
      { key: 'name', label: 'Nombre', sortable: true, minWidth: '160px' },
      { key: 'role', label: 'Rol', sortable: true, width: '120px', cellTemplate: this.roleTpl()! },
      {
        key: 'score',
        label: 'Puntuación',
        sortable: true,
        minWidth: '180px',
        cellTemplate: this.scoreTpl()!,
      },
      {
        key: 'active',
        label: 'Estado',
        sortable: true,
        width: '110px',
        cellTemplate: this.statusTpl()!,
      },
    ];
  }

  badgeStyle(role: string): string {
    const map: Record<string, string> = {
      Admin: 'background:#dbeafe;color:#1d4ed8',
      Editor: 'background:#dcfce7;color:#15803d',
      Viewer: 'background:#f3f4f6;color:#374151',
    };
    return `display:inline-flex;align-items:center;padding:0.125rem 0.625rem;border-radius:9999px;font-size:0.75rem;font-weight:500;${map[role] ?? ''}`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-sticky',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem;">
      <ngx-ds-table
        [data]="users"
        [columns]="columns"
        [stickyHeader]="true"
        maxHeight="320px"
        [hoverable]="true"
      />
    </div>
  `,
})
class StickyWrapper {
  users = USERS;
  columns = BASE_COLUMNS;
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-server',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
      <ngx-ds-table
        [data]="pageData()"
        [columns]="columns"
        [paginated]="true"
        [page]="currentPage()"
        [pageSize]="pageSize()"
        [pageSizeOptions]="[5, 10]"
        [total]="total"
        [sort]="currentSort()"
        [loading]="loading()"
        [hoverable]="true"
        (pageChange)="onPage($event)"
        (sortChange)="onSort($event)"
      />
      <p style="font-size: 0.8125rem; color: #9ca3af;">
        Simulando servidor — página {{ currentPage() }}, {{ pageSize() }} por página
        @if (currentSort()) {
          — orden: <strong>{{ currentSort()!.column }}</strong> {{ currentSort()!.direction }}
        }
      </p>
    </div>
  `,
})
class ServerSideWrapper {
  readonly total = USERS.length;
  columns = BASE_COLUMNS;

  loading = signal(false);
  currentPage = signal(1);
  pageSize = signal(5);
  currentSort = signal<TableSort | null>(null);
  pageData = signal<User[]>([]);

  constructor() {
    this.fetchPage(1, 5, null);
  }

  onPage(evt: TablePageEvent): void {
    this.currentPage.set(evt.page);
    this.pageSize.set(evt.pageSize);
    this.fetchPage(evt.page, evt.pageSize, this.currentSort());
  }

  onSort(sort: TableSort): void {
    this.currentSort.set(sort);
    this.currentPage.set(1);
    this.fetchPage(1, this.pageSize(), sort);
  }

  private fetchPage(page: number, size: number, sort: TableSort | null): void {
    this.loading.set(true);
    setTimeout(() => {
      let rows = [...USERS];
      if (sort) {
        rows.sort((a: any, b: any) => {
          const cmp =
            a[sort.column] < b[sort.column] ? -1 : a[sort.column] > b[sort.column] ? 1 : 0;
          return sort.direction === 'asc' ? cmp : -cmp;
        });
      }
      this.pageData.set(rows.slice((page - 1) * size, page * size));
      this.loading.set(false);
    }, 600);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-actions',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
      <ngx-ds-table
        [data]="users"
        [columns]="columns"
        [actions]="actions"
        actionsLabel="Acciones"
        actionsWidth="140px"
        [clientSide]="true"
        [paginated]="true"
        [pageSize]="5"
        [pageSizeOptions]="[5, 10]"
        [hoverable]="true"
        rowKey="id"
      />

      @if (lastAction()) {
        <div
          style="padding: 0.75rem 1rem; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 0.875rem; color: #374151;"
        >
          <strong>Última acción:</strong> {{ lastAction() }}
        </div>
      }
    </div>
  `,
})
class ActionsWrapper {
  lastAction = signal('');

  users = USERS;

  columns: TableColumn<User>[] = [
    { key: 'id', label: 'ID', sortable: true, width: '70px', align: 'center' },
    { key: 'name', label: 'Nombre', sortable: true, minWidth: '160px' },
    { key: 'email', label: 'Email', minWidth: '200px' },
    { key: 'role', label: 'Rol', sortable: true, width: '110px' },
    {
      key: 'active',
      label: 'Activo',
      sortable: true,
      width: '90px',
      align: 'center',
      type: 'boolean',
    },
  ];

  actions: TableAction<User>[] = [
    {
      label: 'Ver detalle',
      icon: Eye,
      color: 'default',
      onClick: (row) => this.lastAction.set(`Ver → ${row.name}`),
    },
    {
      label: 'Editar',
      icon: Pencil,
      color: 'primary',
      onClick: (row) => this.lastAction.set(`Editar → ${row.name}`),
    },
    {
      label: 'Duplicar',
      icon: Copy,
      color: 'success',
      show: (row) => row.active,
      onClick: (row) => this.lastAction.set(`Duplicar → ${row.name}`),
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      color: 'danger',
      disabled: (row) => row.role === 'Admin',
      onClick: (row) => this.lastAction.set(`Eliminar → ${row.name}`),
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-expandable',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem;">
      <ngx-ds-table
        [data]="users"
        [columns]="columns"
        [hoverable]="true"
        rowKey="id"
        [expandable]="true"
        [expandTemplate]="detailTpl"
      />
    </div>

    <ng-template #detailTpl let-row>
      <div style="display:flex;gap:2rem;font-size:0.8125rem;color:#374151;">
        <span><strong>Email:</strong> {{ row.email }}</span>
        <span><strong>Departamento:</strong> {{ row.department }}</span>
        <span><strong>Alta:</strong> {{ row.joinedAt }}</span>
      </div>
    </ng-template>
  `,
})
class ExpandableRowsWrapper implements AfterViewInit {
  users = USERS.slice(0, 6);
  columns = BASE_COLUMNS.slice(0, 5);

  readonly detailTplRef = viewChild<TemplateRef<any>>('detailTpl');
  detailTpl: TemplateRef<any> | null = null;

  ngAfterViewInit(): void {
    this.detailTpl = this.detailTplRef()!;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-global-filter',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem;">
      <ngx-ds-table
        [data]="users"
        [columns]="columns"
        [clientSide]="true"
        [paginated]="true"
        [pageSize]="5"
        [pageSizeOptions]="[5, 10]"
        [hoverable]="true"
        [globalFilter]="true"
        filterPlaceholder="Buscar por nombre, email o rol…"
      />
    </div>
  `,
})
class GlobalFilterWrapper {
  users = USERS;
  columns = BASE_COLUMNS;
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-table-column-visibility',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div style="padding: 1.5rem;">
      <ngx-ds-table [data]="users" [columns]="columns" [hoverable]="true" [columnToggle]="true" />
    </div>
  `,
})
class ColumnVisibilityWrapper {
  users = USERS.slice(0, 6);
  columns: TableColumn<User>[] = [
    { key: 'id', label: 'ID', sortable: true, width: '70px', align: 'center', hideable: false },
    { key: 'name', label: 'Nombre', sortable: true, minWidth: '160px', hideable: false },
    { key: 'email', label: 'Email', minWidth: '200px' },
    { key: 'role', label: 'Rol', sortable: true, width: '110px' },
    { key: 'department', label: 'Depto.', sortable: true, minWidth: '140px' },
    {
      key: 'active',
      label: 'Activo',
      sortable: true,
      width: '90px',
      align: 'center',
      type: 'boolean',
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────

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
      <p style="font-size: 0.875rem; color: #6b7280;">Clicks agregar: {{ clicks() }}</p>
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

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Organisms/Table',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Basic',
  render: () => ({
    template: `<story-table-basic />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};

export const ClientSideSortPagination: Story = {
  name: 'Client-side Sort & Pagination',
  render: () => ({
    template: `<story-table-client />`,
    moduleMetadata: { imports: [ClientSideWrapper] },
  }),
};

export const MultiSelect: Story = {
  name: 'Multi-select',
  render: () => ({
    template: `<story-table-multiselect />`,
    moduleMetadata: { imports: [MultiSelectWrapper] },
  }),
};

export const SingleSelect: Story = {
  name: 'Single-select',
  render: () => ({
    template: `<story-table-single />`,
    moduleMetadata: { imports: [SingleSelectWrapper] },
  }),
};

export const Loading: Story = {
  name: 'Loading (skeleton)',
  render: () => ({
    template: `<story-table-loading />`,
    moduleMetadata: { imports: [LoadingWrapper] },
  }),
};

export const Empty: Story = {
  name: 'Empty state',
  render: () => ({
    template: `<story-table-empty />`,
    moduleMetadata: { imports: [EmptyWrapper] },
  }),
};

export const Variants: Story = {
  name: 'Striped + Dense',
  render: () => ({
    template: `<story-table-variants />`,
    moduleMetadata: { imports: [VariantsWrapper] },
  }),
};

export const CustomCells: Story = {
  name: 'Custom cell templates',
  render: () => ({
    template: `<story-table-custom />`,
    moduleMetadata: { imports: [CustomCellsWrapper] },
  }),
};

export const StickyHeader: Story = {
  name: 'Sticky header',
  render: () => ({
    template: `<story-table-sticky />`,
    moduleMetadata: { imports: [StickyWrapper] },
  }),
};

export const ServerSide: Story = {
  name: 'Server-side (simulated)',
  render: () => ({
    template: `<story-table-server />`,
    moduleMetadata: { imports: [ServerSideWrapper] },
  }),
};

export const WithActions: Story = {
  name: 'Columna de acciones',
  render: () => ({
    template: `<story-table-actions />`,
    moduleMetadata: { imports: [ActionsWrapper] },
  }),
};

export const ExpandableRows: Story = {
  name: 'Filas expandibles',
  render: () => ({
    template: `<story-table-expandable />`,
    moduleMetadata: { imports: [ExpandableRowsWrapper] },
  }),
};

export const GlobalFilter: Story = {
  name: 'Filtro global',
  render: () => ({
    template: `<story-table-global-filter />`,
    moduleMetadata: { imports: [GlobalFilterWrapper] },
  }),
};

export const ColumnVisibility: Story = {
  name: 'Visibilidad de columnas',
  render: () => ({
    template: `<story-table-column-visibility />`,
    moduleMetadata: { imports: [ColumnVisibilityWrapper] },
  }),
};

// Pass [showAddButton]="false" to hide toolbar and empty-state add actions.
export const WithAddButton: Story = {
  name: 'With add button',
  render: () => ({
    template: `<story-table-add />`,
    moduleMetadata: { imports: [AddButtonWrapper] },
  }),
};
