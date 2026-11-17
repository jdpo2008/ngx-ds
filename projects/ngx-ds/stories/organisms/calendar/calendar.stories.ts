import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal, computed } from '@angular/core';
import { CalendarComponent } from '../../../src/lib/organisms/calendar/calendar.component';
import { DatepickerComponent } from '../../../src/lib/molecules/datepicker/datepicker.component';
import { provideNgxDsLocale } from '../../../src/lib/shared/locale';
import { NGX_DS_LABELS_EN, provideNgxDsLabels } from '../../../src/lib/shared/labels';

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

@Component({
  selector: 'calendar-locale-wrapper',
  standalone: true,
  imports: [CalendarComponent, DatepickerComponent],
  // Component-level providers scope locale and labels to this subtree; apps usually
  // call provideNgxDsLocale() / provideNgxDsLabels() once in bootstrapApplication.
  providers: [provideNgxDsLocale('en-US'), provideNgxDsLabels(NGX_DS_LABELS_EN)],
  template: `
    <div class="p-6 space-y-6" style="max-width: 360px">
      <p class="text-sm text-gray-500">
        Locale <code>en-US</code> + English labels via <code>provideNgxDsLocale</code> and
        <code>provideNgxDsLabels(NGX_DS_LABELS_EN)</code>
      </p>
      <ngx-ds-calendar [(value)]="selected" />
      <ngx-ds-datepicker label="Date" [(value)]="selected" [firstDayOfWeek]="0" />
    </div>
  `,
})
class LocaleWrapper {
  selected = signal<Date | null>(new Date());
}

export const CustomLocale: Story = {
  render: () => ({
    template: `<calendar-locale-wrapper />`,
    moduleMetadata: { imports: [LocaleWrapper] },
  }),
};
