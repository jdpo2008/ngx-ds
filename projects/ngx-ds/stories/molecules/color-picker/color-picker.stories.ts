import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { ColorPickerComponent } from '../../../src/lib/molecules/color-picker/color-picker.component';

@Component({
  selector: 'color-picker-wrapper',
  standalone: true,
  imports: [ColorPickerComponent],
  template: `
    <div class="p-6" style="display:flex; gap:2rem; flex-wrap:wrap;">
      <ngx-ds-color-picker label="Color primario" [(value)]="color" />
      <ngx-ds-color-picker label="Deshabilitado" [value]="'#22c55e'" [disabled]="true" />
      <p style="font-size:0.8rem;color:var(--text-muted, #6b7280); align-self:flex-end;">
        Valor: <code>{{ color() }}</code>
      </p>
    </div>
  `,
})
class Wrapper {
  color = signal('#6366f1');
}

const meta: Meta = { title: 'Molecules/ColorPicker' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<color-picker-wrapper />`,
    moduleMetadata: { imports: [Wrapper] },
  }),
};
