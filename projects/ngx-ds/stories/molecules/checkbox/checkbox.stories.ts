import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { CheckboxComponent } from '../../../src/lib/molecules/checkbox/checkbox.component';

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'chk-default-wrapper',
  standalone: true,
  imports: [CheckboxComponent],
  template: `
    <div class="p-6 space-y-3">
      <ngx-ds-checkbox label="Opción sin marcar" [(checked)]="a" />
      <ngx-ds-checkbox label="Opción marcada" [(checked)]="b" />
      <ngx-ds-checkbox label="Indeterminado" [indeterminate]="true" />
      <ngx-ds-checkbox label="Deshabilitado" [checked]="false" />
    </div>
  `,
})
class DefaultWrapper {
  a = signal(false);
  b = signal(true);
}

// ── Colors Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'chk-colors-wrapper',
  standalone: true,
  imports: [CheckboxComponent],
  template: `
    <div class="p-6 space-y-3">
      <ngx-ds-checkbox label="Primary" color="primary" [checked]="true" />
      <ngx-ds-checkbox label="Secondary" color="secondary" [checked]="true" />
      <ngx-ds-checkbox label="Danger" color="danger" [checked]="true" />
      <ngx-ds-checkbox label="Success" color="success" [checked]="true" />
      <ngx-ds-checkbox label="Warning" color="warning" [checked]="true" />
    </div>
  `,
})
class ColorsWrapper {}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'chk-sizes-wrapper',
  standalone: true,
  imports: [CheckboxComponent],
  template: `
    <div class="p-6 space-y-4">
      <div class="flex items-center gap-6">
        <ngx-ds-checkbox label="Small" size="sm" [checked]="true" />
        <ngx-ds-checkbox label="Medium" size="md" [checked]="true" />
        <ngx-ds-checkbox label="Large" size="lg" [checked]="true" />
      </div>
      <div class="flex items-center gap-6">
        <ngx-ds-checkbox label="Small sin marcar" size="sm" />
        <ngx-ds-checkbox label="Medium sin marcar" size="md" />
        <ngx-ds-checkbox label="Large sin marcar" size="lg" />
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── States Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'chk-states-wrapper',
  standalone: true,
  imports: [CheckboxComponent],
  template: `
    <div class="p-6 space-y-3">
      <p class="text-sm text-gray-500 mb-2">Estados</p>
      <ngx-ds-checkbox label="Sin marcar (normal)" />
      <ngx-ds-checkbox label="Marcado" [checked]="true" />
      <ngx-ds-checkbox label="Indeterminado" [indeterminate]="true" />
      <ngx-ds-checkbox label="Sin marcar — deshabilitado" [checked]="false" />
      <ngx-ds-checkbox label="Marcado — deshabilitado" [checked]="true" />
    </div>
  `,
})
class StatesWrapper {}

// ── Label Position Wrapper ────────────────────────────────────────────────────

@Component({
  selector: 'chk-label-pos-wrapper',
  standalone: true,
  imports: [CheckboxComponent],
  template: `
    <div class="p-6 space-y-4">
      <div>
        <p class="text-sm text-gray-500 mb-3">Etiqueta a la derecha (por defecto)</p>
        <div class="space-y-2">
          <ngx-ds-checkbox label="Opción A" labelPosition="right" [checked]="true" />
          <ngx-ds-checkbox label="Opción B" labelPosition="right" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Etiqueta a la izquierda</p>
        <div class="space-y-2">
          <ngx-ds-checkbox label="Opción A" labelPosition="left" [checked]="true" />
          <ngx-ds-checkbox label="Opción B" labelPosition="left" />
        </div>
      </div>
    </div>
  `,
})
class LabelPositionWrapper {}

// ── Interactive Wrapper ───────────────────────────────────────────────────────

@Component({
  selector: 'chk-interactive-wrapper',
  standalone: true,
  imports: [CheckboxComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-2">Selecciona tus intereses:</p>
      <div class="space-y-2">
        @for (item of items; track item.label) {
          <ngx-ds-checkbox [label]="item.label" [(checked)]="item.checked" />
        }
      </div>
      <p class="text-xs text-gray-500 mt-3">
        Seleccionados: {{ selectedCount() }} / {{ items.length }}
      </p>
    </div>
  `,
})
class InteractiveWrapper {
  items = [
    { label: 'Angular', checked: signal(true) },
    { label: 'TypeScript', checked: signal(true) },
    { label: 'Tailwind CSS', checked: signal(false) },
    { label: 'Storybook', checked: signal(false) },
    { label: 'RxJS', checked: signal(false) },
  ];

  selectedCount = signal(0);

  constructor() {
    this.updateCount();
  }

  updateCount(): void {
    this.selectedCount.set(this.items.filter((i) => i.checked()).length);
  }
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/Checkbox',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<chk-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `<chk-colors-wrapper />`,
    moduleMetadata: { imports: [ColorsWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<chk-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const States: Story = {
  render: () => ({
    template: `<chk-states-wrapper />`,
    moduleMetadata: { imports: [StatesWrapper] },
  }),
};

export const LabelPosition: Story = {
  render: () => ({
    template: `<chk-label-pos-wrapper />`,
    moduleMetadata: { imports: [LabelPositionWrapper] },
  }),
};

export const Interactive: Story = {
  render: () => ({
    template: `<chk-interactive-wrapper />`,
    moduleMetadata: { imports: [InteractiveWrapper] },
  }),
};
