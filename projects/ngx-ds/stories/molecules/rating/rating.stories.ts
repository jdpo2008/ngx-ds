import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { RatingComponent } from '../../../src/lib/molecules/rating/rating.component';

@Component({
  selector: 'rating-wrapper',
  standalone: true,
  imports: [RatingComponent],
  template: `
    <div class="p-6" style="display:flex; flex-direction:column; gap:1.5rem;">
      <ngx-ds-rating label="Calificación" [(value)]="val" />
      <ngx-ds-rating [(value)]="val" size="sm" />
      <ngx-ds-rating [(value)]="val" size="lg" />
      <ngx-ds-rating [value]="4" [readonly]="true" label="Solo lectura" />
      <ngx-ds-rating [value]="3" [disabled]="true" label="Deshabilitado" />
      <p style="font-size:0.8rem;color:#6b7280;">Valor: {{ val() }}</p>
    </div>
  `,
})
class Wrapper {
  val = signal(3);
}

const meta: Meta = { title: 'Molecules/Rating' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { max: 5, size: 'md', readonly: false, disabled: false },
  argTypes: { size: { control: 'radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => ({
    props: { ...args, value: 3 },
    template: `<div style="padding:1.5rem;"><ngx-ds-rating [(value)]="value" [max]="max" [size]="size" [readonly]="readonly" [disabled]="disabled" /></div>`,
    moduleMetadata: { imports: [RatingComponent] },
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `<rating-wrapper />`,
    moduleMetadata: { imports: [Wrapper] },
  }),
};
