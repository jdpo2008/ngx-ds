import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal, computed } from '@angular/core';
import { DateRangePickerComponent } from '../../../src/lib/molecules/date-range-picker/date-range-picker.component';

function fmt(d: Date | null): string {
  if (!d) return '—';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

@Component({
  selector: 'drp-wrapper',
  standalone: true,
  imports: [DateRangePickerComponent],
  template: `
    <div class="p-6" style="display:flex; flex-direction:column; gap:1.5rem; max-width:600px;">
      <ngx-ds-date-range-picker
        label="Período de fechas"
        [(start)]="start"
        [(end)]="end"
        hint="Selecciona inicio y fin"
      />
      <ngx-ds-date-range-picker label="Tamaño sm" [(start)]="start" [(end)]="end" size="sm" />
      <ngx-ds-date-range-picker label="Tamaño lg" [(start)]="start" [(end)]="end" size="lg" />
      <p style="font-size:0.8rem;color:var(--text-muted, #6b7280);">
        Inicio: {{ startLabel() }} — Fin: {{ endLabel() }}
      </p>
    </div>
  `,
})
class Wrapper {
  start = signal<Date | null>(null);
  end = signal<Date | null>(null);
  startLabel = computed(() => fmt(this.start()));
  endLabel = computed(() => fmt(this.end()));
}

const meta: Meta = { title: 'Molecules/DateRangePicker' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<drp-wrapper />`,
    moduleMetadata: { imports: [Wrapper] },
  }),
};
