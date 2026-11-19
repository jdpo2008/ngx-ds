import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  DescriptionItem,
  DescriptionListComponent,
} from '../../../src/lib/molecules/description-list/description-list.component';

const BOX = 'max-width: 640px;';

const CUSTOMER: DescriptionItem[] = [
  { label: 'Nombre', value: 'Ana García López' },
  { label: 'Email', value: 'ana.garcia@ejemplo.com', copyable: true },
  { label: 'Teléfono', value: '+34 612 345 678', copyable: true },
  { label: 'Plan', value: 'Pro (anual)' },
  { label: 'Empresa', value: null },
  { label: 'ID de cliente', value: 'cus_9fK2mQ81', copyable: true },
];

// ── Horizontal Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'description-list-horizontal-wrapper',
  standalone: true,
  imports: [DescriptionListComponent],
  template: `
    <div style="${BOX}">
      <ngx-ds-description-list [items]="items" />
    </div>
  `,
})
class HorizontalWrapper {
  readonly items = CUSTOMER;
}

// ── Grid Wrapper ──────────────────────────────────────────────────────────────

@Component({
  selector: 'description-list-grid-wrapper',
  standalone: true,
  imports: [DescriptionListComponent],
  template: `
    <div style="${BOX}">
      <ngx-ds-description-list [items]="items" layout="vertical" [columns]="2" />
    </div>
  `,
})
class GridWrapper {
  readonly items: DescriptionItem[] = [
    { label: 'Pedido', value: '#10482' },
    { label: 'Estado', value: 'Enviado' },
    { label: 'Fecha', value: '19/11/2026' },
    { label: 'Total', value: '248,90 €' },
    {
      label: 'Dirección de envío',
      value: 'Calle Mayor 12, 3.º B, 28013 Madrid',
      fullWidth: true,
    },
    { label: 'Seguimiento', value: 'ES2026XK48213', copyable: true, fullWidth: true },
  ];
}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'description-list-sizes-wrapper',
  standalone: true,
  imports: [DescriptionListComponent],
  template: `
    <div style="${BOX} display: flex; flex-direction: column; gap: 2rem;">
      <ngx-ds-description-list [items]="items" size="sm" />
      <ngx-ds-description-list [items]="items" size="lg" [divided]="false" />
    </div>
  `,
})
class SizesWrapper {
  readonly items: DescriptionItem[] = [
    { label: 'Versión', value: '1.1.0' },
    { label: 'Licencia', value: 'MIT' },
    { label: 'Mantenedor', value: undefined },
  ];
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/DescriptionList',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Horizontal: Story = {
  render: () => ({
    template: `<description-list-horizontal-wrapper />`,
    moduleMetadata: { imports: [HorizontalWrapper] },
  }),
};

export const VerticalGrid: Story = {
  render: () => ({
    template: `<description-list-grid-wrapper />`,
    moduleMetadata: { imports: [GridWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<description-list-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};
