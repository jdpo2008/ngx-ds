import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  DividerComponent,
  DividerOrientation,
  DividerVariant,
  DividerAlign,
} from '../../../src/lib/atoms/divider/divider.component';

// ── Labeled Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'divider-labeled-wrapper',
  standalone: true,
  imports: [DividerComponent],
  template: `
    <div class="p-6" style="max-width: 28rem; display:flex; flex-direction:column; gap:1.5rem;">
      <ngx-ds-divider label="O continúa con" />
      <ngx-ds-divider label="Inicio" align="start" />
      <ngx-ds-divider label="Fin" align="end" />
    </div>
  `,
})
class LabeledWrapper {}

// ── Variants Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'divider-variants-wrapper',
  standalone: true,
  imports: [DividerComponent],
  template: `
    <div class="p-6" style="max-width: 28rem; display:flex; flex-direction:column; gap:1.5rem;">
      <div>
        <p style="font-size:0.75rem;color:var(--text-placeholder, #6b7280);margin:0 0 0.5rem;">
          Solid
        </p>
        <ngx-ds-divider variant="solid" />
      </div>
      <div>
        <p style="font-size:0.75rem;color:var(--text-placeholder, #6b7280);margin:0 0 0.5rem;">
          Dashed
        </p>
        <ngx-ds-divider variant="dashed" />
      </div>
      <div>
        <p style="font-size:0.75rem;color:var(--text-placeholder, #6b7280);margin:0 0 0.5rem;">
          Dotted
        </p>
        <ngx-ds-divider variant="dotted" />
      </div>
    </div>
  `,
})
class VariantsWrapper {}

// ── Vertical Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'divider-vertical-wrapper',
  standalone: true,
  imports: [DividerComponent],
  template: `
    <div class="p-6" style="display:flex; align-items:center; gap:0; height:3rem;">
      <span style="font-size:0.875rem;color:var(--text-secondary, #374151);">Inicio</span>
      <ngx-ds-divider orientation="vertical" />
      <span style="font-size:0.875rem;color:var(--text-secondary, #374151);">Productos</span>
      <ngx-ds-divider orientation="vertical" />
      <span style="font-size:0.875rem;color:var(--text-secondary, #374151);">Detalle</span>
    </div>
  `,
})
class VerticalWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Atoms/Divider',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    orientation: 'horizontal' as DividerOrientation,
    variant: 'solid' as DividerVariant,
    label: '',
    align: 'center' as DividerAlign,
  },
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    variant: { control: 'radio', options: ['solid', 'dashed', 'dotted'] },
    label: { control: 'text' },
    align: { control: 'radio', options: ['start', 'center', 'end'] },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 2rem 1.5rem;">
        <ngx-ds-divider
          [orientation]="orientation"
          [variant]="variant"
          [label]="label"
          [align]="align"
        />
      </div>
    `,
    moduleMetadata: { imports: [DividerComponent] },
  }),
};

export const WithLabel: Story = {
  render: () => ({
    template: `<divider-labeled-wrapper />`,
    moduleMetadata: { imports: [LabeledWrapper] },
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `<divider-variants-wrapper />`,
    moduleMetadata: { imports: [VariantsWrapper] },
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `<divider-vertical-wrapper />`,
    moduleMetadata: { imports: [VerticalWrapper] },
  }),
};
