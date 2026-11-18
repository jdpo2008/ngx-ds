import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { BadgeComponent } from '../../../src/lib/atoms/badge/badge.component';

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'badge-default-wrapper',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div class="p-6 flex flex-wrap gap-3 items-center">
      <ngx-ds-badge label="New" />
      <ngx-ds-badge label="Beta" color="secondary" />
      <ngx-ds-badge label="Error" color="danger" />
      <ngx-ds-badge label="Activo" color="success" />
      <ngx-ds-badge label="Pendiente" color="warning" />
    </div>
  `,
})
class DefaultWrapper {}

// ── Variants Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'badge-variants-wrapper',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div class="p-6 space-y-4">
      <div>
        <p class="text-sm text-gray-500 mb-2">Solid</p>
        <div class="flex flex-wrap gap-3 items-center">
          <ngx-ds-badge label="Primary" color="primary" variant="solid" />
          <ngx-ds-badge label="Secondary" color="secondary" variant="solid" />
          <ngx-ds-badge label="Danger" color="danger" variant="solid" />
          <ngx-ds-badge label="Success" color="success" variant="solid" />
          <ngx-ds-badge label="Warning" color="warning" variant="solid" />
          <ngx-ds-badge label="Info" color="info" variant="solid" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">Soft</p>
        <div class="flex flex-wrap gap-3 items-center">
          <ngx-ds-badge label="Primary" color="primary" variant="soft" />
          <ngx-ds-badge label="Secondary" color="secondary" variant="soft" />
          <ngx-ds-badge label="Danger" color="danger" variant="soft" />
          <ngx-ds-badge label="Success" color="success" variant="soft" />
          <ngx-ds-badge label="Warning" color="warning" variant="soft" />
          <ngx-ds-badge label="Info" color="info" variant="soft" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">Outline</p>
        <div class="flex flex-wrap gap-3 items-center">
          <ngx-ds-badge label="Primary" color="primary" variant="outline" />
          <ngx-ds-badge label="Secondary" color="secondary" variant="outline" />
          <ngx-ds-badge label="Danger" color="danger" variant="outline" />
          <ngx-ds-badge label="Success" color="success" variant="outline" />
          <ngx-ds-badge label="Warning" color="warning" variant="outline" />
          <ngx-ds-badge label="Info" color="info" variant="outline" />
        </div>
      </div>
    </div>
  `,
})
class VariantsWrapper {}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'badge-sizes-wrapper',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div class="p-6 flex flex-wrap gap-4 items-center">
      <ngx-ds-badge label="Small" size="sm" />
      <ngx-ds-badge label="Medium" size="md" />
      <ngx-ds-badge label="Large" size="lg" />
    </div>
  `,
})
class SizesWrapper {}

// ── Count Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'badge-count-wrapper',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div class="p-6 space-y-4">
      <div>
        <p class="text-sm text-gray-500 mb-2">Conteo numérico</p>
        <div class="flex flex-wrap gap-3 items-center">
          <ngx-ds-badge [count]="3" color="primary" />
          <ngx-ds-badge [count]="12" color="danger" />
          <ngx-ds-badge [count]="99" color="success" />
          <ngx-ds-badge [count]="150" color="warning" />
          <ngx-ds-badge [count]="999" [max]="99" color="secondary" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">Punto (dot)</p>
        <div class="flex flex-wrap gap-3 items-center">
          <ngx-ds-badge [dot]="true" color="primary" />
          <ngx-ds-badge [dot]="true" color="danger" />
          <ngx-ds-badge [dot]="true" color="success" />
          <ngx-ds-badge [dot]="true" color="warning" size="lg" />
        </div>
      </div>
    </div>
  `,
})
class CountWrapper {}

// ── Rounded Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'badge-rounded-wrapper',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div class="p-6 space-y-4">
      <div>
        <p class="text-sm text-gray-500 mb-2">Redondeado (por defecto)</p>
        <div class="flex flex-wrap gap-3 items-center">
          <ngx-ds-badge label="Primary" color="primary" [rounded]="true" />
          <ngx-ds-badge label="Secondary" color="secondary" [rounded]="true" />
          <ngx-ds-badge label="Danger" color="danger" [rounded]="true" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">Cuadrado</p>
        <div class="flex flex-wrap gap-3 items-center">
          <ngx-ds-badge label="Primary" color="primary" [rounded]="false" />
          <ngx-ds-badge label="Secondary" color="secondary" [rounded]="false" />
          <ngx-ds-badge label="Danger" color="danger" [rounded]="false" />
        </div>
      </div>
    </div>
  `,
})
class RoundedWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Atoms/Badge',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<badge-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `<badge-variants-wrapper />`,
    moduleMetadata: { imports: [VariantsWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<badge-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const Count: Story = {
  render: () => ({
    template: `<badge-count-wrapper />`,
    moduleMetadata: { imports: [CountWrapper] },
  }),
};

export const Rounded: Story = {
  render: () => ({
    template: `<badge-rounded-wrapper />`,
    moduleMetadata: { imports: [RoundedWrapper] },
  }),
};
