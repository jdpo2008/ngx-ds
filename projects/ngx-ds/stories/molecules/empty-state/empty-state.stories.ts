import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { EmptyStateComponent } from '../../../src/lib/molecules/empty-state/empty-state.component';
import { ButtonComponent } from '../../../src/lib/atoms/button/button.component';
import { Inbox, Search, FileX } from 'lucide-angular';

@Component({
  selector: 'empty-state-basic-wrapper',
  standalone: true,
  imports: [EmptyStateComponent, ButtonComponent],
  template: `
    <div
      class="p-6"
      style="display:flex; flex-direction:column; gap:2rem; max-width:400px; margin:auto;"
    >
      <ngx-ds-empty-state
        [icon]="inboxIcon"
        title="Sin resultados"
        description="No encontramos elementos que coincidan con tu búsqueda."
        size="sm"
      >
        <ngx-ds-button empty-action variant="outline" size="sm">Limpiar filtros</ngx-ds-button>
      </ngx-ds-empty-state>

      <hr style="border:none; border-top:1px solid var(--border-base, #e5e7eb);" />

      <ngx-ds-empty-state
        [icon]="searchIcon"
        title="No hay datos"
        description="Parece que aún no tienes ningún elemento. Crea el primero para comenzar."
      >
        <ngx-ds-button empty-action>Crear elemento</ngx-ds-button>
      </ngx-ds-empty-state>

      <hr style="border:none; border-top:1px solid var(--border-base, #e5e7eb);" />

      <ngx-ds-empty-state
        [icon]="fileXIcon"
        title="Error al cargar"
        description="Ocurrió un problema al obtener los datos. Intenta de nuevo."
        size="lg"
      >
        <ngx-ds-button empty-action variant="danger">Reintentar</ngx-ds-button>
      </ngx-ds-empty-state>
    </div>
  `,
})
class BasicWrapper {
  readonly inboxIcon = Inbox;
  readonly searchIcon = Search;
  readonly fileXIcon = FileX;
}

const meta: Meta = { title: 'Molecules/EmptyState' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    title: 'Sin resultados',
    description: 'No encontramos elementos que coincidan.',
    size: 'md',
  },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    props: { ...args, icon: Inbox },
    template: `
      <div style="padding:2rem; max-width:380px; margin:auto;">
        <ngx-ds-empty-state [icon]="icon" [title]="title" [description]="description" [size]="size" />
      </div>
    `,
    moduleMetadata: { imports: [EmptyStateComponent] },
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `<empty-state-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};
