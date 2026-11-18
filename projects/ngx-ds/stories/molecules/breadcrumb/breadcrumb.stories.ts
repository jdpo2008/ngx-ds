import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbSize,
} from '../../../src/lib/molecules/breadcrumb/breadcrumb.component';
import { LayoutDashboard, ShoppingCart, Package } from 'lucide-angular';
import { Slash } from 'lucide-angular';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'breadcrumb-basic-wrapper',
  standalone: true,
  imports: [BreadcrumbComponent],
  template: `
    <div class="p-6" style="display:flex; flex-direction:column; gap:1.5rem;">
      <ngx-ds-breadcrumb [items]="items" />
      <ngx-ds-breadcrumb [items]="items" size="sm" />
      <ngx-ds-breadcrumb [items]="items" size="lg" />
    </div>
  `,
})
class BasicWrapper {
  items: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Productos', href: '/productos' },
    { label: 'Electrónica', href: '/productos/electronica' },
    { label: 'Laptops' },
  ];
}

// ── With Icons Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'breadcrumb-icons-wrapper',
  standalone: true,
  imports: [BreadcrumbComponent],
  template: `
    <div class="p-6">
      <ngx-ds-breadcrumb [items]="items" (itemClick)="onNav($event)" />
    </div>
  `,
})
class IconsWrapper {
  items: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Pedidos', href: '/pedidos', icon: ShoppingCart },
    { label: 'Detalle del pedido #4521', icon: Package },
  ];
  onNav(item: BreadcrumbItem): void {
    console.log('navigate to', item.label);
  }
}

// ── Collapsed Wrapper ─────────────────────────────────────────────────────────

@Component({
  selector: 'breadcrumb-collapsed-wrapper',
  standalone: true,
  imports: [BreadcrumbComponent],
  template: `
    <div class="p-6" style="display:flex; flex-direction:column; gap:1rem;">
      <p class="text-xs text-gray-500">Ruta completa (sin colapso)</p>
      <ngx-ds-breadcrumb [items]="items" />

      <p class="text-xs text-gray-500 mt-2">Colapsada — máximo 4 ítems</p>
      <ngx-ds-breadcrumb [items]="items" [maxItems]="4" />
    </div>
  `,
})
class CollapsedWrapper {
  items: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Electrónica', href: '/catalogo/electronica' },
    { label: 'Computación', href: '/catalogo/electronica/computacion' },
    { label: 'Laptops', href: '/catalogo/electronica/computacion/laptops' },
    { label: 'MacBook Pro 14"' },
  ];
}

// ── Custom Separator Wrapper ──────────────────────────────────────────────────

@Component({
  selector: 'breadcrumb-separator-wrapper',
  standalone: true,
  imports: [BreadcrumbComponent],
  template: `
    <div class="p-6" style="display:flex; flex-direction:column; gap:1rem;">
      <p class="text-xs text-gray-500">Separador "/" (texto)</p>
      <ngx-ds-breadcrumb [items]="items" separator="/" />

      <p class="text-xs text-gray-500 mt-2">Separador icono Slash</p>
      <ngx-ds-breadcrumb [items]="items" [separator]="slashIcon" />
    </div>
  `,
})
class SeparatorWrapper {
  readonly slashIcon = Slash;
  items: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Ajustes', href: '/ajustes' },
    { label: 'Cuenta' },
  ];
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/Breadcrumb',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    size: 'md' as BreadcrumbSize,
    maxItems: 0,
  },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    maxItems: { control: 'number' },
  },
  render: (args) => ({
    props: {
      ...args,
      items: [
        { label: 'Inicio', href: '/' },
        { label: 'Proyectos', href: '/proyectos' },
        { label: 'Mi proyecto' },
      ] as BreadcrumbItem[],
    },
    template: `
      <div style="padding: 1.5rem;">
        <ngx-ds-breadcrumb [items]="items" [size]="size" [maxItems]="maxItems" />
      </div>
    `,
    moduleMetadata: { imports: [BreadcrumbComponent] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<breadcrumb-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};

export const WithIcons: Story = {
  render: () => ({
    template: `<breadcrumb-icons-wrapper />`,
    moduleMetadata: { imports: [IconsWrapper] },
  }),
};

export const Collapsed: Story = {
  render: () => ({
    template: `<breadcrumb-collapsed-wrapper />`,
    moduleMetadata: { imports: [CollapsedWrapper] },
  }),
};

export const CustomSeparator: Story = {
  render: () => ({
    template: `<breadcrumb-separator-wrapper />`,
    moduleMetadata: { imports: [SeparatorWrapper] },
  }),
};
