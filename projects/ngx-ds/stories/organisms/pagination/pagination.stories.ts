import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { PaginationComponent } from '../../../src/lib/organisms/pagination/pagination.component';

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'pg-default-wrapper',
  standalone: true,
  imports: [PaginationComponent],
  template: `
    <div class="p-6 space-y-4">
      <ngx-ds-pagination [totalPages]="10" [(currentPage)]="page" />
      <p class="text-sm text-gray-500">Página actual: {{ page() }}</p>
    </div>
  `,
})
class DefaultWrapper {
  page = signal(1);
}

// ── Few Pages Wrapper ─────────────────────────────────────────────────────────

@Component({
  selector: 'pg-few-wrapper',
  standalone: true,
  imports: [PaginationComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-2">3 páginas</p>
        <ngx-ds-pagination [totalPages]="3" />
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">5 páginas</p>
        <ngx-ds-pagination [totalPages]="5" />
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">7 páginas (sin elipsis)</p>
        <ngx-ds-pagination [totalPages]="7" />
      </div>
    </div>
  `,
})
class FewWrapper {}

// ── Ellipsis Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'pg-ellipsis-wrapper',
  standalone: true,
  imports: [PaginationComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-2">Inicio (página 1 de 20)</p>
        <ngx-ds-pagination [totalPages]="20" [(currentPage)]="p1" />
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">Centro (página 10 de 20)</p>
        <ngx-ds-pagination [totalPages]="20" [(currentPage)]="p2" />
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">Final (página 20 de 20)</p>
        <ngx-ds-pagination [totalPages]="20" [(currentPage)]="p3" />
      </div>
    </div>
  `,
})
class EllipsisWrapper {
  p1 = signal(1);
  p2 = signal(10);
  p3 = signal(20);
}

// ── Siblings Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'pg-siblings-wrapper',
  standalone: true,
  imports: [PaginationComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-2">1 hermano (por defecto)</p>
        <ngx-ds-pagination [totalPages]="20" [siblings]="1" [(currentPage)]="page" />
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">2 hermanos</p>
        <ngx-ds-pagination [totalPages]="20" [siblings]="2" [(currentPage)]="page" />
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">3 hermanos</p>
        <ngx-ds-pagination [totalPages]="20" [siblings]="3" [(currentPage)]="page" />
      </div>
    </div>
  `,
})
class SiblingsWrapper {
  page = signal(10);
}

// ── Interactive Wrapper ───────────────────────────────────────────────────────

@Component({
  selector: 'pg-interactive-wrapper',
  standalone: true,
  imports: [PaginationComponent],
  template: `
    <div class="p-6 space-y-6">
      <p class="text-sm text-gray-500 mb-2">Tabla de resultados simulada</p>

      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Nombre</th>
              <th class="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (row of visibleRows(); track row.id) {
              <tr>
                <td class="px-4 py-3 text-gray-500">{{ row.id }}</td>
                <td class="px-4 py-3 text-gray-800 font-medium">{{ row.name }}</td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-0.5 text-xs rounded-full font-medium"
                    [class]="row.statusClass"
                    >{{ row.status }}</span
                  >
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between">
        <p class="text-xs text-gray-500">
          Mostrando {{ (page() - 1) * pageSize + 1 }}–{{ page() * pageSize }} de
          {{ allRows.length }} resultados
        </p>
        <ngx-ds-pagination [totalPages]="totalPages" [(currentPage)]="page" />
      </div>
    </div>
  `,
})
class InteractiveWrapper {
  pageSize = 5;

  allRows = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Usuario ${i + 1}`,
    status: i % 3 === 0 ? 'Activo' : i % 3 === 1 ? 'Pendiente' : 'Inactivo',
    statusClass:
      i % 3 === 0
        ? 'bg-green-100 text-green-700'
        : i % 3 === 1
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-gray-100 text-gray-700',
  }));

  page = signal(1);
  totalPages = Math.ceil(this.allRows.length / this.pageSize);

  visibleRows = () => {
    const p = this.page();
    return this.allRows.slice((p - 1) * this.pageSize, p * this.pageSize);
  };
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Organisms/Pagination',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<pg-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const FewPages: Story = {
  render: () => ({
    template: `<pg-few-wrapper />`,
    moduleMetadata: { imports: [FewWrapper] },
  }),
};

export const WithEllipsis: Story = {
  render: () => ({
    template: `<pg-ellipsis-wrapper />`,
    moduleMetadata: { imports: [EllipsisWrapper] },
  }),
};

export const Siblings: Story = {
  render: () => ({
    template: `<pg-siblings-wrapper />`,
    moduleMetadata: { imports: [SiblingsWrapper] },
  }),
};

export const Interactive: Story = {
  render: () => ({
    template: `<pg-interactive-wrapper />`,
    moduleMetadata: { imports: [InteractiveWrapper] },
  }),
};
