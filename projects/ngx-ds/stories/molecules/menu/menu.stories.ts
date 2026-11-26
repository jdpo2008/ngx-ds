import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  LucideCopy as Copy,
  LucidePencil as Pencil,
  LucideTrash2 as Trash2,
  LucideShare2 as Share2,
  LucideDownload as Download,
} from '@lucide/angular';
import { MenuComponent } from '../../../src/lib/molecules/menu/menu.component';
import type { MenuItem } from '../../../src/lib/molecules/menu/menu.types';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'menu-basic-wrapper',
  standalone: true,
  imports: [MenuComponent],
  template: `
    <div class="p-6">
      <ngx-ds-menu [items]="items" ariaLabel="Acciones" (itemClick)="onClick($event)" />
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
    { id: 'edit', label: 'Editar', icon: Pencil, kbd: 'Ctrl+E' },
    { id: 'share', label: 'Compartir', icon: Share2 },
    { id: 'delete', label: 'Eliminar', icon: Trash2, danger: true, separator: true },
  ];

  onClick(item: MenuItem): void {
    this.lastClicked = item.label;
  }
}

// ── Submenu Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'menu-submenu-wrapper',
  standalone: true,
  imports: [MenuComponent],
  template: `
    <div class="p-6">
      <ngx-ds-menu [items]="items" ariaLabel="Archivo" (itemClick)="onClick($event)" />
      @if (lastClicked) {
        <p class="text-xs text-gray-500 mt-3">Último click: {{ lastClicked }}</p>
      }
    </div>
  `,
})
class SubmenuWrapper {
  lastClicked = '';

  readonly items: MenuItem[] = [
    {
      id: 'export',
      label: 'Exportar como',
      icon: Download,
      children: [
        { id: 'export-pdf', label: 'PDF' },
        { id: 'export-csv', label: 'CSV' },
        { id: 'export-json', label: 'JSON' },
      ],
    },
    { id: 'share', label: 'Compartir', icon: Share2 },
    { id: 'delete', label: 'Eliminar', icon: Trash2, danger: true, separator: true },
  ];

  onClick(item: MenuItem): void {
    this.lastClicked = item.label;
  }
}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'menu-sizes-wrapper',
  standalone: true,
  imports: [MenuComponent],
  template: `
    <div class="p-6" style="display: flex; gap: 2rem; align-items: flex-start;">
      <ngx-ds-menu [items]="items" size="sm" ariaLabel="Pequeño" />
      <ngx-ds-menu [items]="items" size="md" ariaLabel="Mediano" />
      <ngx-ds-menu [items]="items" size="lg" ariaLabel="Grande" />
    </div>
  `,
})
class SizesWrapper {
  readonly items: MenuItem[] = [
    { id: 'copy', label: 'Copiar', icon: Copy },
    { id: 'edit', label: 'Editar', icon: Pencil },
  ];
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/Menu',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<menu-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};

export const WithSubmenu: Story = {
  render: () => ({
    template: `<menu-submenu-wrapper />`,
    moduleMetadata: { imports: [SubmenuWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<menu-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};
