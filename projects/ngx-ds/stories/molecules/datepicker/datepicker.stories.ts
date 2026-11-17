import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { DatepickerComponent } from '../../../src/lib/molecules/datepicker/datepicker.component';

// ── Default ───────────────────────────────────────────────────

@Component({
  selector: 'dp-default-wrapper',
  standalone: true,
  imports: [DatepickerComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-xs">
      <ngx-ds-datepicker label="Fecha de nacimiento" />
      <ngx-ds-datepicker label="Con hint" hint="Selecciona una fecha del calendario." />
      <ngx-ds-datepicker label="Con error" errorMessage="La fecha es obligatoria." />
      <ngx-ds-datepicker label="Deshabilitado" [disabled]="true" />
    </div>
  `,
})
class DefaultWrapper {}

// ── Floating Label ────────────────────────────────────────────

@Component({
  selector: 'dp-floating-wrapper',
  standalone: true,
  imports: [DatepickerComponent],
  template: `
    <div class="p-6 flex flex-col gap-6 max-w-xs">
      <p class="text-sm text-gray-500">Haz clic para ver el label flotando</p>
      <ngx-ds-datepicker label="Fecha de inicio" [floatingLabel]="true" />
      <ngx-ds-datepicker
        label="Fecha de fin"
        [floatingLabel]="true"
        hint="No puede ser anterior a la fecha de inicio."
      />
      <ngx-ds-datepicker label="Con error" [floatingLabel]="true" errorMessage="Fecha no válida." />
      <ngx-ds-datepicker label="Deshabilitado" [floatingLabel]="true" [disabled]="true" />
    </div>
  `,
})
class FloatingWrapper {}

// ── Sizes ─────────────────────────────────────────────────────

@Component({
  selector: 'dp-sizes-wrapper',
  standalone: true,
  imports: [DatepickerComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-xs">
      <div>
        <p class="text-xs text-gray-400 mb-1">Small</p>
        <ngx-ds-datepicker label="Fecha" size="sm" />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">Medium (por defecto)</p>
        <ngx-ds-datepicker label="Fecha" size="md" />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">Large</p>
        <ngx-ds-datepicker label="Fecha" size="lg" />
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── Min / Max dates ───────────────────────────────────────────

@Component({
  selector: 'dp-minmax-wrapper',
  standalone: true,
  imports: [DatepickerComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-xs">
      <p class="text-sm font-medium text-gray-700">Restricciones de fecha</p>

      <div>
        <p class="text-xs text-gray-400 mb-1">Solo a partir de hoy (minDate = hoy)</p>
        <ngx-ds-datepicker
          label="Fecha futura"
          [floatingLabel]="true"
          [minDate]="today"
          hint="No puedes elegir fechas pasadas."
        />
      </div>

      <div>
        <p class="text-xs text-gray-400 mb-1">Solo hasta hoy (maxDate = hoy)</p>
        <ngx-ds-datepicker
          label="Fecha pasada"
          [floatingLabel]="true"
          [maxDate]="today"
          hint="No puedes elegir fechas futuras."
        />
      </div>

      <div>
        <p class="text-xs text-gray-400 mb-1">Rango: del 1 al 20 del mes actual</p>
        <ngx-ds-datepicker
          label="Rango acotado"
          [floatingLabel]="true"
          [minDate]="rangeStart"
          [maxDate]="rangeEnd"
        />
      </div>
    </div>
  `,
})
class MinMaxWrapper {
  today = new Date();
  rangeStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  rangeEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 20);
}

// ── Disabled days ─────────────────────────────────────────────

@Component({
  selector: 'dp-disabled-wrapper',
  standalone: true,
  imports: [DatepickerComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-xs">
      <p class="text-sm font-medium text-gray-700">Días inhabilitados</p>

      <div>
        <p class="text-xs text-gray-400 mb-1">Sin fines de semana (0=Dom, 6=Sáb)</p>
        <ngx-ds-datepicker
          label="Día laborable"
          [floatingLabel]="true"
          [disabledDaysOfWeek]="[0, 6]"
          hint="Solo días de lunes a viernes."
        />
      </div>

      <div>
        <p class="text-xs text-gray-400 mb-1">Fechas específicas bloqueadas</p>
        <ngx-ds-datepicker
          label="Disponibilidad"
          [floatingLabel]="true"
          [disabledDates]="blockedDates"
          hint="Algunas fechas no están disponibles."
        />
      </div>
    </div>
  `,
})
class DisabledWrapper {
  // Block the 5th, 15th, and 25th of the current month
  blockedDates = [5, 15, 25].map(
    (d) => new Date(new Date().getFullYear(), new Date().getMonth(), d),
  );
}

// ── Signal Form ───────────────────────────────────────────────

@Component({
  selector: 'dp-signal-wrapper',
  standalone: true,
  imports: [DatepickerComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-xs">
      <p class="text-sm font-medium text-gray-700">
        Signal Forms — <code class="text-xs bg-gray-100 px-1 rounded">[(value)]</code>
      </p>

      <ngx-ds-datepicker
        label="Fecha de inicio"
        [floatingLabel]="true"
        [(value)]="startDate"
        [minDate]="today"
      />
      <ngx-ds-datepicker
        label="Fecha de fin"
        [floatingLabel]="true"
        [(value)]="endDate"
        [minDate]="startDate() ?? today"
        hint="Debe ser posterior a la fecha de inicio."
      />

      <div class="mt-2 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
        <p class="text-gray-500 text-xs font-medium mb-1">Estado del signal</p>
        <p>
          Inicio: <span class="font-medium text-gray-800">{{ format(startDate()) }}</span>
        </p>
        <p>
          Fin: <span class="font-medium text-gray-800">{{ format(endDate()) }}</span>
        </p>
        @if (startDate() && endDate()) {
          <p>
            Días: <span class="font-medium text-blue-700">{{ daysBetween() }}</span>
          </p>
        }
      </div>
    </div>
  `,
})
class SignalWrapper {
  today = new Date();
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);

  format(d: Date | null): string {
    if (!d) return '—';
    return [
      String(d.getDate()).padStart(2, '0'),
      String(d.getMonth() + 1).padStart(2, '0'),
      d.getFullYear(),
    ].join('/');
  }

  daysBetween(): string {
    const s = this.startDate();
    const e = this.endDate();
    if (!s || !e) return '—';
    const ms = e.getTime() - s.getTime();
    const days = Math.round(ms / 86_400_000);
    return `${days} día${days !== 1 ? 's' : ''}`;
  }
}

// ── Template Form ─────────────────────────────────────────────

@Component({
  selector: 'dp-template-wrapper',
  standalone: true,
  imports: [DatepickerComponent, FormsModule],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-xs">
      <p class="text-sm font-medium text-gray-700">
        Template-Driven Forms — <code class="text-xs bg-gray-100 px-1 rounded">[(ngModel)]</code>
      </p>

      <form #myForm="ngForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <ngx-ds-datepicker
          name="birthdate"
          label="Fecha de nacimiento"
          [floatingLabel]="true"
          [(ngModel)]="model.birthdate"
          [maxDate]="today"
          required
        />
        <ngx-ds-datepicker
          name="startDate"
          label="Fecha de incorporación"
          [floatingLabel]="true"
          [(ngModel)]="model.startDate"
          [minDate]="today"
          hint="Selecciona una fecha futura."
        />

        <button
          type="submit"
          class="py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md
                 hover:bg-blue-700 disabled:opacity-50"
          [disabled]="myForm.invalid"
        >
          Enviar
        </button>
      </form>

      @if (submitted) {
        <div class="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <p class="text-gray-500 text-xs font-medium mb-1">Modelo</p>
          <p>
            Nacimiento: <span class="font-medium text-gray-800">{{ format(model.birthdate) }}</span>
          </p>
          <p>
            Incorporación:
            <span class="font-medium text-gray-800">{{ format(model.startDate) }}</span>
          </p>
        </div>
      }
    </div>
  `,
})
class TemplateWrapper {
  today = new Date();
  submitted = false;
  model = { birthdate: null as Date | null, startDate: null as Date | null };

  format(d: Date | null): string {
    if (!d) return '—';
    return [
      String(d.getDate()).padStart(2, '0'),
      String(d.getMonth() + 1).padStart(2, '0'),
      d.getFullYear(),
    ].join('/');
  }

  onSubmit(): void {
    this.submitted = true;
  }
}

// ── Reactive Form ─────────────────────────────────────────────

@Component({
  selector: 'dp-reactive-wrapper',
  standalone: true,
  imports: [DatepickerComponent, ReactiveFormsModule],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-xs">
      <p class="text-sm font-medium text-gray-700">
        Reactive Forms — <code class="text-xs bg-gray-100 px-1 rounded">formControlName</code>
      </p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <ngx-ds-datepicker
          label="Fecha de nacimiento"
          [floatingLabel]="true"
          formControlName="birthdate"
          [maxDate]="today"
          [errorMessage]="birthdateError()"
        />
        <ngx-ds-datepicker
          label="Fecha de inicio"
          [floatingLabel]="true"
          formControlName="startDate"
          [minDate]="today"
          [disabledDaysOfWeek]="[0, 6]"
          [errorMessage]="startDateError()"
          hint="Solo días laborables."
        />

        <button
          type="submit"
          class="py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md
                 hover:bg-blue-700 disabled:opacity-50"
          [disabled]="form.invalid"
        >
          Guardar
        </button>
      </form>

      @if (submitted) {
        <div class="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <p class="text-gray-500 text-xs font-medium mb-1">Formulario</p>
          @for (entry of formEntries(); track entry.key) {
            <p>
              {{ entry.key }}:
              <span class="font-medium text-gray-800">{{ format(entry.value) }}</span>
            </p>
          }
        </div>
      }
    </div>
  `,
})
class ReactiveWrapper {
  today = new Date();
  submitted = false;

  form = new FormGroup({
    birthdate: new FormControl<Date | null>(null, Validators.required),
    startDate: new FormControl<Date | null>(null, Validators.required),
  });

  birthdateError = () => {
    const c = this.form.get('birthdate');
    return c?.touched && c?.hasError('required') ? 'La fecha de nacimiento es obligatoria.' : '';
  };

  startDateError = () => {
    const c = this.form.get('startDate');
    return c?.touched && c?.hasError('required') ? 'La fecha de inicio es obligatoria.' : '';
  };

  formEntries = () =>
    Object.entries(this.form.value).map(([key, value]) => ({ key, value: value as Date | null }));

  format(d: Date | null): string {
    if (!d) return '—';
    return [
      String(d.getDate()).padStart(2, '0'),
      String(d.getMonth() + 1).padStart(2, '0'),
      d.getFullYear(),
    ].join('/');
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.submitted = true;
      console.log('Datepicker form submitted', this.form.value);
    }
  }
}

// ── Meta ──────────────────────────────────────────────────────

const meta: Meta = { title: 'Molecules/Datepicker' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<dp-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const FloatingLabel: Story = {
  render: () => ({
    template: `<dp-floating-wrapper />`,
    moduleMetadata: { imports: [FloatingWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({ template: `<dp-sizes-wrapper />`, moduleMetadata: { imports: [SizesWrapper] } }),
};

export const MinMaxDates: Story = {
  render: () => ({
    template: `<dp-minmax-wrapper />`,
    moduleMetadata: { imports: [MinMaxWrapper] },
  }),
};

export const DisabledDays: Story = {
  render: () => ({
    template: `<dp-disabled-wrapper />`,
    moduleMetadata: { imports: [DisabledWrapper] },
  }),
};

export const SignalForm: Story = {
  render: () => ({
    template: `<dp-signal-wrapper />`,
    moduleMetadata: { imports: [SignalWrapper] },
  }),
};

export const TemplateForm: Story = {
  render: () => ({
    template: `<dp-template-wrapper />`,
    moduleMetadata: { imports: [TemplateWrapper] },
  }),
};

export const ReactiveForm: Story = {
  render: () => ({
    template: `<dp-reactive-wrapper />`,
    moduleMetadata: { imports: [ReactiveWrapper] },
  }),
};
