import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { NumberInputComponent } from '../../../src/lib/molecules/number-input/number-input.component';

@Component({
  selector: 'number-input-wrapper',
  standalone: true,
  imports: [NumberInputComponent],
  template: `
    <div class="p-6" style="display:flex; flex-direction:column; gap:1.5rem;">
      <ngx-ds-number-input label="Cantidad" [(value)]="qty" [min]="0" [max]="100" />
      <ngx-ds-number-input label="Precio" [(value)]="price" [step]="0.5" hint="Incremento de 0.5" />
      <ngx-ds-number-input size="sm" [(value)]="qty" [min]="0" />
      <ngx-ds-number-input size="lg" [(value)]="qty" [min]="0" />
      <ngx-ds-number-input label="Deshabilitado" [value]="5" [disabled]="true" />
      <p style="font-size:0.8rem; color:var(--text-muted, #6b7280);">Qty: {{ qty() }}</p>
    </div>
  `,
})
class Wrapper {
  qty = signal(0);
  price = signal(10);
}

const meta: Meta = { title: 'Molecules/NumberInput' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { min: 0, max: 100, step: 1, size: 'md', label: 'Cantidad' },
  argTypes: { size: { control: 'radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => ({
    props: { ...args, value: 0 },
    template: `<div style="padding:1.5rem;"><ngx-ds-number-input [(value)]="value" [min]="min" [max]="max" [step]="step" [size]="size" [label]="label" /></div>`,
    moduleMetadata: { imports: [NumberInputComponent] },
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `<number-input-wrapper />`,
    moduleMetadata: { imports: [Wrapper] },
  }),
};
