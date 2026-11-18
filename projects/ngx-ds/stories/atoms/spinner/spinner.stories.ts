import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  SpinnerComponent,
  SpinnerColor,
  SpinnerSize,
} from '../../../src/lib/atoms/spinner/spinner.component';

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'spinner-sizes-wrapper',
  standalone: true,
  imports: [SpinnerComponent],
  template: `
    <div class="p-6 space-y-6">
      <p class="text-sm text-gray-500 mb-4">Tamaños</p>
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-spinner size="xs" color="primary" />
          <span class="text-xs text-gray-500">xs</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-spinner size="sm" color="primary" />
          <span class="text-xs text-gray-500">sm</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-spinner size="md" color="primary" />
          <span class="text-xs text-gray-500">md</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-spinner size="lg" color="primary" />
          <span class="text-xs text-gray-500">lg</span>
        </div>
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── Colors Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'spinner-colors-wrapper',
  standalone: true,
  imports: [SpinnerComponent],
  template: `
    <div class="p-6 space-y-6">
      <p class="text-sm text-gray-500 mb-4">Colores</p>
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-spinner size="md" color="primary" />
          <span class="text-xs text-gray-500">primary</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-spinner size="md" color="secondary" />
          <span class="text-xs text-gray-500">secondary</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-spinner size="md" color="danger" />
          <span class="text-xs text-gray-500">danger</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-spinner size="md" color="success" />
          <span class="text-xs text-gray-500">success</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-spinner size="md" color="warning" />
          <span class="text-xs text-gray-500">warning</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-spinner size="md" color="info" />
          <span class="text-xs text-gray-500">info</span>
        </div>
        <div class="flex flex-col items-center gap-2" style="color: #8b5cf6">
          <ngx-ds-spinner size="md" color="current" />
          <span class="text-xs text-gray-500">current</span>
        </div>
      </div>
    </div>
  `,
})
class ColorsWrapper {}

// ── Inline Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'spinner-inline-wrapper',
  standalone: true,
  imports: [SpinnerComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-4">Uso inline — en textos y filas</p>
      <div class="flex items-center gap-2 text-sm text-gray-700">
        <ngx-ds-spinner size="xs" color="primary" />
        <span>Cargando datos…</span>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-700">
        <ngx-ds-spinner size="sm" color="secondary" />
        <span>Procesando solicitud…</span>
      </div>
      <div class="flex items-center gap-2 text-sm" style="color: var(--fill-success, #047857)">
        <ngx-ds-spinner size="sm" color="current" />
        <span>Guardando cambios…</span>
      </div>
      <div
        class="flex items-center justify-center gap-3 p-6 border border-dashed border-gray-300 rounded-lg"
      >
        <ngx-ds-spinner size="lg" color="primary" />
        <span class="text-sm text-gray-500">Cargando contenido…</span>
      </div>
    </div>
  `,
})
class InlineWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Atoms/Spinner',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    size: 'md' as SpinnerSize,
    color: 'primary' as SpinnerColor,
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    color: {
      control: 'select',
      options: ['current', 'primary', 'secondary', 'danger', 'success', 'warning'],
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
        <ngx-ds-spinner [size]="size" [color]="color" />
      </div>
    `,
    moduleMetadata: { imports: [SpinnerComponent] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<spinner-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `<spinner-colors-wrapper />`,
    moduleMetadata: { imports: [ColorsWrapper] },
  }),
};

export const Inline: Story = {
  render: () => ({
    template: `<spinner-inline-wrapper />`,
    moduleMetadata: { imports: [InlineWrapper] },
  }),
};
