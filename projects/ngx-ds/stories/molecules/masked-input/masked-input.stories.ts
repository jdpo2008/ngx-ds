import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  LucideCalendar as Calendar,
  LucideCreditCard as CreditCard,
  LucidePhone as Phone,
} from '@lucide/angular';
import { MaskedInputComponent } from '../../../src/lib/molecules/masked-input/masked-input.component';

const COLUMN = 'display: flex; flex-direction: column; gap: 1.25rem; max-width: 360px;';

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'masked-input-default-wrapper',
  standalone: true,
  imports: [MaskedInputComponent],
  template: `
    <div style="${COLUMN}">
      <ngx-ds-masked-input
        label="Teléfono"
        mask="(999) 999-9999"
        [iconLeft]="phone"
        autocomplete="tel-national"
        [(value)]="tel"
        [hint]="'Valor: ' + (tel || '—')"
      />
      <ngx-ds-masked-input
        label="Fecha de nacimiento"
        mask="99/99/9999"
        [iconLeft]="calendar"
        [keepLiterals]="true"
        [(value)]="date"
        [hint]="'Valor: ' + (date || '—')"
      />
      <ngx-ds-masked-input
        label="IBAN"
        mask="AA99 9999 9999 9999 9999 9999"
        [iconLeft]="card"
        [(value)]="iban"
        [hint]="'Valor: ' + (iban || '—')"
      />
    </div>
  `,
})
class DefaultWrapper {
  readonly phone = Phone;
  readonly calendar = Calendar;
  readonly card = CreditCard;
  tel = '5551234567';
  date = '';
  iban = 'es9121000418450200051332';
}

// ── Floating Label Wrapper ────────────────────────────────────────────────────

@Component({
  selector: 'masked-input-floating-wrapper',
  standalone: true,
  imports: [MaskedInputComponent],
  template: `
    <div style="${COLUMN}">
      <ngx-ds-masked-input label="Código postal" mask="99999" [floatingLabel]="true" />
      <ngx-ds-masked-input
        label="Matrícula"
        mask="9999 AAA"
        [floatingLabel]="true"
        value="1234BCD"
      />
    </div>
  `,
})
class FloatingWrapper {}

// ── States Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'masked-input-states-wrapper',
  standalone: true,
  imports: [MaskedInputComponent],
  template: `
    <div style="${COLUMN}">
      <ngx-ds-masked-input label="Small" mask="999-999" size="sm" />
      <ngx-ds-masked-input label="Large" mask="999-999" size="lg" />
      <ngx-ds-masked-input
        label="Con error"
        mask="99/99/9999"
        value="0105"
        errorMessage="La fecha está incompleta"
      />
      <ngx-ds-masked-input
        label="Deshabilitado"
        mask="(999) 999-9999"
        value="5551234567"
        [disabled]="true"
      />
      <ngx-ds-masked-input
        label="Solo lectura"
        mask="(999) 999-9999"
        value="5551234567"
        [readonly]="true"
      />
    </div>
  `,
})
class StatesWrapper {}

// ── Reactive Form Wrapper ─────────────────────────────────────────────────────

@Component({
  selector: 'masked-input-form-wrapper',
  standalone: true,
  imports: [MaskedInputComponent, ReactiveFormsModule],
  template: `
    <div style="${COLUMN}">
      <ngx-ds-masked-input
        label="Tarjeta"
        mask="9999 9999 9999 9999"
        [iconLeft]="card"
        [formControl]="ctrl"
        [errorMessage]="ctrl.touched && ctrl.hasError('mask') ? 'Faltan dígitos' : ''"
      />
      <p style="margin: 0; font-size: 0.875rem; color: var(--text-secondary, #374151);">
        value: {{ ctrl.value || '—' }} · valid: {{ ctrl.valid }}
      </p>
    </div>
  `,
})
class FormWrapper {
  readonly card = CreditCard;
  readonly ctrl = new FormControl('4111');
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/MaskedInput',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<masked-input-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const FloatingLabel: Story = {
  render: () => ({
    template: `<masked-input-floating-wrapper />`,
    moduleMetadata: { imports: [FloatingWrapper] },
  }),
};

export const States: Story = {
  render: () => ({
    template: `<masked-input-states-wrapper />`,
    moduleMetadata: { imports: [StatesWrapper] },
  }),
};

export const ReactiveForm: Story = {
  render: () => ({
    template: `<masked-input-form-wrapper />`,
    moduleMetadata: { imports: [FormWrapper] },
  }),
};
