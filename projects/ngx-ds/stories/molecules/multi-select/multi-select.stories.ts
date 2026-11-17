import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import {
  MultiSelectComponent,
  MultiSelectOption,
} from '../../../src/lib/molecules/multi-select/multi-select.component';

const FRUITS: MultiSelectOption[] = [
  { value: 'apple', label: 'Manzana' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cereza' },
  { value: 'grape', label: 'Uva' },
  { value: 'mango', label: 'Mango' },
  { value: 'peach', label: 'Durazno', disabled: true },
];

@Component({
  selector: 'multi-select-wrapper',
  standalone: true,
  imports: [MultiSelectComponent],
  template: `
    <div class="p-6" style="display:flex; flex-direction:column; gap:1.5rem; max-width:360px;">
      <ngx-ds-multi-select
        label="Frutas"
        [options]="opts"
        [(value)]="selected"
        placeholder="Elige frutas..."
      />
      <ngx-ds-multi-select
        label="Máx 2"
        [options]="opts"
        [(value)]="limited"
        [maxSelected]="2"
        hint="Máximo 2 opciones"
      />
      <ngx-ds-multi-select
        label="Sin búsqueda"
        [options]="opts"
        [(value)]="noSearch"
        [searchable]="false"
      />
      <p style="font-size:0.8rem;color:var(--text-muted, #6b7280);">
        Seleccionados: {{ selected().join(', ') }}
      </p>
    </div>
  `,
})
class Wrapper {
  opts = FRUITS;
  selected = signal<(string | number)[]>([]);
  limited = signal<(string | number)[]>([]);
  noSearch = signal<(string | number)[]>([]);
}

const meta: Meta = { title: 'Molecules/MultiSelect' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<multi-select-wrapper />`,
    moduleMetadata: { imports: [Wrapper] },
  }),
};
