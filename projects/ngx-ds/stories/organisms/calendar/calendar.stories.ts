import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal, computed } from '@angular/core';
import { CalendarComponent } from '../../../src/lib/organisms/calendar/calendar.component';

function fmt(d: Date | null): string {
  if (!d) return '—';
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

@Component({
  selector: 'calendar-wrapper',
  standalone: true,
  imports: [CalendarComponent],
  template: `
    <div
      class="p-6"
      style="display:flex; flex-direction:column; gap:1.5rem; align-items:flex-start;"
    >
      <ngx-ds-calendar [(value)]="selected" />
      <p style="font-size:0.8rem;color:#6b7280;">Seleccionado: {{ selectedLabel() }}</p>
    </div>
  `,
})
class Wrapper {
  selected = signal<Date | null>(null);
  selectedLabel = computed(() => fmt(this.selected()));
}

const meta: Meta = { title: 'Organisms/Calendar' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<calendar-wrapper />`,
    moduleMetadata: { imports: [Wrapper] },
  }),
};
