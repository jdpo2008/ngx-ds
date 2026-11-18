import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, required } from '@angular/forms/signals';
import { TimePickerComponent } from '../../../src/lib/molecules/time-picker/time-picker.component';

// ── Default ───────────────────────────────────────────────────

@Component({
  selector: 'tp-default-wrapper',
  standalone: true,
  imports: [TimePickerComponent, ReactiveFormsModule],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-xs" style="min-height: 22rem">
      <ngx-ds-time-picker label="Hora de inicio" [(value)]="time" />
      <ngx-ds-time-picker label="Con hint" hint="Intervalos de 5 minutos." />
      <ngx-ds-time-picker label="Con error" errorMessage="La hora es obligatoria." />
      <ngx-ds-time-picker label="Deshabilitado" [formControl]="disabledCtrl" />
      <p class="text-sm text-gray-500">Valor: {{ time() ?? '—' }}</p>
    </div>
  `,
})
class DefaultWrapper {
  time = signal<string | null>('09:30');
  disabledCtrl = new FormControl({ value: '18:00', disabled: true });
}

// ── 12-hour format ────────────────────────────────────────────

@Component({
  selector: 'tp-12h-wrapper',
  standalone: true,
  imports: [TimePickerComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-xs" style="min-height: 22rem">
      <ngx-ds-time-picker label="Recordatorio" hourFormat="12" [(value)]="time" />
      <p class="text-sm text-gray-500">
        Valor (siempre 24 h): <code>{{ time() ?? '—' }}</code>
      </p>
    </div>
  `,
})
class TwelveHourWrapper {
  time = signal<string | null>('14:30');
}

// ── Min / max and step ────────────────────────────────────────

@Component({
  selector: 'tp-range-wrapper',
  standalone: true,
  imports: [TimePickerComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-xs" style="min-height: 22rem">
      <ngx-ds-time-picker
        label="Cita"
        minTime="09:00"
        maxTime="17:30"
        [minuteStep]="15"
        hint="Horario de 09:00 a 17:30, cada 15 minutos."
        [(value)]="time"
      />
    </div>
  `,
})
class RangeWrapper {
  time = signal<string | null>(null);
}

// ── Sizes / floating label ────────────────────────────────────

@Component({
  selector: 'tp-sizes-wrapper',
  standalone: true,
  imports: [TimePickerComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-xs" style="min-height: 22rem">
      <ngx-ds-time-picker size="sm" label="Small" />
      <ngx-ds-time-picker size="md" label="Medium" />
      <ngx-ds-time-picker size="lg" label="Large" />
    </div>
  `,
})
class SizesWrapper {}

@Component({
  selector: 'tp-floating-wrapper',
  standalone: true,
  imports: [TimePickerComponent],
  template: `
    <div class="p-6 flex flex-col gap-6 max-w-xs" style="min-height: 22rem">
      <ngx-ds-time-picker label="Hora de salida" [floatingLabel]="true" />
      <ngx-ds-time-picker label="Hora de llegada" [floatingLabel]="true" [value]="'21:15'" />
      <ngx-ds-time-picker label="Con error" [floatingLabel]="true" errorMessage="Hora no válida." />
    </div>
  `,
})
class FloatingWrapper {}

// ── Signal Forms ──────────────────────────────────────────────

@Component({
  selector: 'tp-signal-wrapper',
  standalone: true,
  imports: [TimePickerComponent, FormField, JsonPipe],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-xs" style="min-height: 22rem">
      <p class="text-sm font-medium text-gray-700">
        Signal Forms — <code class="text-xs bg-gray-100 px-1 rounded">[formField]</code>
      </p>
      <ngx-ds-time-picker label="Apertura" [floatingLabel]="true" [formField]="f.open" />
      <ngx-ds-time-picker
        label="Cierre"
        [floatingLabel]="true"
        [formField]="f.close"
        [minTime]="model().open"
      />
      <div class="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
        <pre class="text-xs">{{ model() | json }}</pre>
        <p class="text-xs">Válido: {{ f().valid() ? 'sí' : 'no' }}</p>
      </div>
    </div>
  `,
})
class SignalWrapper {
  model = signal({ open: null as string | null, close: null as string | null });
  f = form(this.model, (p) => {
    required(p.open, { message: 'La hora de apertura es obligatoria' });
    required(p.close, { message: 'La hora de cierre es obligatoria' });
  });
}

// ── Meta ──────────────────────────────────────────────────────

const meta: Meta = { title: 'Molecules/TimePicker' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<tp-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const TwelveHour: Story = {
  render: () => ({
    template: `<tp-12h-wrapper />`,
    moduleMetadata: { imports: [TwelveHourWrapper] },
  }),
};

export const MinMaxAndStep: Story = {
  render: () => ({
    template: `<tp-range-wrapper />`,
    moduleMetadata: { imports: [RangeWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({ template: `<tp-sizes-wrapper />`, moduleMetadata: { imports: [SizesWrapper] } }),
};

export const FloatingLabel: Story = {
  render: () => ({
    template: `<tp-floating-wrapper />`,
    moduleMetadata: { imports: [FloatingWrapper] },
  }),
};

export const SignalForm: Story = {
  render: () => ({
    template: `<tp-signal-wrapper />`,
    moduleMetadata: { imports: [SignalWrapper] },
  }),
};
