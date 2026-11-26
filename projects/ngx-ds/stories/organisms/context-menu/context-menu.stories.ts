import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  LucideCopy as Copy,
  LucidePencil as Pencil,
  LucideTrash2 as Trash2,
  LucideShare2 as Share2,
} from '@lucide/angular';
import { ContextMenuComponent } from '../../../src/lib/organisms/context-menu/context-menu.component';
import type { MenuItem } from '../../../src/lib/molecules/menu/menu.types';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'context-menu-basic-wrapper',
  standalone: true,
  imports: [ContextMenuComponent],
  template: `
    <div class="p-6">
      <ngx-ds-context-menu [items]="items" (itemClick)="onClick($event)">
        <div
          tabindex="0"
          style="width: 20rem; height: 12rem; display: flex; align-items: center; justify-content: center;
                    border: 2px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem; color: var(--text-muted, #6b7280);"
        >
          Clic derecho aquí
        </div>
      </ngx-ds-context-menu>
      @if (lastClicked) {
        <p class="text-xs text-gray-500 mt-3">Último click: {{ lastClicked }}</p>
      }
    </div>
  `,
})
class BasicWrapper {
  lastClicked = '';

  readonly items: MenuItem[] = [
    { id: 'copy', label: 'Copiar', icon: Copy, kbd: 'Ctrl+C' },
    { id: 'edit', label: 'Editar', icon: Pencil },
    { id: 'share', label: 'Compartir', icon: Share2 },
    { id: 'delete', label: 'Eliminar', icon: Trash2, danger: true, separator: true },
  ];

  onClick(item: MenuItem): void {
    this.lastClicked = item.label;
  }
}

// ── Near Edge Wrapper ─────────────────────────────────────────────────────────

@Component({
  selector: 'context-menu-edge-wrapper',
  standalone: true,
  imports: [ContextMenuComponent],
  template: `
    <div class="p-6">
      <p class="text-sm text-gray-500 mb-3">
        La zona está pegada a la esquina inferior derecha — el menú se auto-ajusta (flip) para no
        salirse del viewport.
      </p>
      <div style="display: flex; justify-content: flex-end;">
        <ngx-ds-context-menu [items]="items">
          <div
            tabindex="0"
            style="width: 12rem; height: 8rem; display: flex; align-items: center; justify-content: center;
                      border: 2px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem; color: var(--text-muted, #6b7280);"
          >
            Clic derecho (borde)
          </div>
        </ngx-ds-context-menu>
      </div>
    </div>
  `,
})
class EdgeWrapper {
  readonly items: MenuItem[] = [
    { id: 'copy', label: 'Copiar', icon: Copy },
    { id: 'edit', label: 'Editar', icon: Pencil },
    { id: 'delete', label: 'Eliminar', icon: Trash2, danger: true },
  ];
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Organisms/ContextMenu',
  parameters: {
    docs: {
      description: {
        component:
          'Abre un menú con clic derecho, Shift+F10 o la tecla Menú sobre el contenido proyectado. Para que funcione con teclado el destino debe ser enfocable (`tabindex="0"` o un elemento interactivo).',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<context-menu-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};

export const NearEdge: Story = {
  render: () => ({
    template: `<context-menu-edge-wrapper />`,
    moduleMetadata: { imports: [EdgeWrapper] },
  }),
};
