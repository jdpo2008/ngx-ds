import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  SearchInputComponent,
  SearchSize,
} from '../../../src/lib/molecules/search-input/search-input.component';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'search-basic-wrapper',
  standalone: true,
  imports: [SearchInputComponent],
  template: `
    <div class="p-6" style="max-width: 24rem;">
      <ngx-ds-search-input
        placeholder="Buscar productos..."
        [(value)]="query"
        (search)="onSearch($event)"
        (cleared)="onClear()"
      />
      @if (query) {
        <p class="text-xs text-gray-400 mt-3">Buscando: "{{ query }}"</p>
      }
    </div>
  `,
})
class BasicWrapper {
  query = '';
  onSearch(q: string): void {
    console.log('search:', q);
  }
  onClear(): void {
    console.log('cleared');
  }
}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'search-sizes-wrapper',
  standalone: true,
  imports: [SearchInputComponent],
  template: `
    <div class="p-6" style="max-width: 24rem; display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <p class="text-xs text-gray-400 mb-1">Small</p>
        <ngx-ds-search-input size="sm" placeholder="Small..." />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">Medium (default)</p>
        <ngx-ds-search-input size="md" placeholder="Medium..." />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">Large</p>
        <ngx-ds-search-input size="lg" placeholder="Large..." />
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── Loading Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'search-loading-wrapper',
  standalone: true,
  imports: [SearchInputComponent],
  template: `
    <div class="p-6" style="max-width: 24rem;">
      <ngx-ds-search-input
        [loading]="true"
        [value]="'Angular components'"
        placeholder="Buscando..."
      />
    </div>
  `,
})
class LoadingWrapper {}

// ── States Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'search-states-wrapper',
  standalone: true,
  imports: [SearchInputComponent],
  template: `
    <div class="p-6" style="max-width: 24rem; display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <p class="text-xs text-gray-400 mb-1">Normal</p>
        <ngx-ds-search-input placeholder="Buscar..." />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">Con texto</p>
        <ngx-ds-search-input [value]="'design system'" placeholder="Buscar..." />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">Deshabilitado</p>
        <ngx-ds-search-input [disabled]="true" placeholder="No disponible" />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">Sin botón de limpiar</p>
        <ngx-ds-search-input [clearable]="false" [value]="'texto fijo'" placeholder="Buscar..." />
      </div>
    </div>
  `,
})
class StatesWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/SearchInput',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    placeholder: 'Buscar...',
    size: 'md' as SearchSize,
    disabled: false,
    loading: false,
    clearable: true,
    value: '',
  },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    clearable: { control: 'boolean' },
    value: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 1.5rem; max-width: 24rem;">
        <ngx-ds-search-input
          [placeholder]="placeholder"
          [size]="size"
          [disabled]="disabled"
          [loading]="loading"
          [clearable]="clearable"
          [value]="value"
        />
      </div>
    `,
    moduleMetadata: { imports: [SearchInputComponent] },
  }),
};

export const Basic: Story = {
  render: () => ({
    template: `<search-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<search-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `<search-loading-wrapper />`,
    moduleMetadata: { imports: [LoadingWrapper] },
  }),
};

export const States: Story = {
  render: () => ({
    template: `<search-states-wrapper />`,
    moduleMetadata: { imports: [StatesWrapper] },
  }),
};
