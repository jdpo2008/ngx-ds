import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  OtpInputComponent,
  OtpSize,
  OtpType,
} from '../../../src/lib/molecules/otp-input/otp-input.component';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'otp-basic-wrapper',
  standalone: true,
  imports: [OtpInputComponent],
  template: `
    <div class="p-6">
      <p class="text-sm text-gray-500 mb-3">Código de 6 dígitos numérico</p>
      <ngx-ds-otp-input [(value)]="code" (complete)="onComplete($event)" />
      @if (code) {
        <p class="text-xs text-gray-500 mt-3">Valor: {{ code }}</p>
      }
      @if (completed) {
        <p class="text-xs text-green-600 mt-1">¡Código completo!</p>
      }
    </div>
  `,
})
class BasicWrapper {
  code = '';
  completed = false;
  onComplete(v: string): void {
    this.completed = true;
    console.log('complete:', v);
  }
}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'otp-sizes-wrapper',
  standalone: true,
  imports: [OtpInputComponent],
  template: `
    <div class="p-6" style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div>
        <p class="text-xs text-gray-500 mb-2">Small</p>
        <ngx-ds-otp-input size="sm" [length]="4" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-2">Medium (default)</p>
        <ngx-ds-otp-input size="md" [length]="6" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-2">Large</p>
        <ngx-ds-otp-input size="lg" [length]="6" />
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── Alphanumeric Wrapper ──────────────────────────────────────────────────────

@Component({
  selector: 'otp-alpha-wrapper',
  standalone: true,
  imports: [OtpInputComponent],
  template: `
    <div class="p-6">
      <p class="text-sm text-gray-500 mb-3">Código alfanumérico de 8 caracteres</p>
      <ngx-ds-otp-input type="alphanumeric" [length]="8" [(value)]="code" />
      @if (code) {
        <p class="text-xs text-gray-500 mt-3">Valor: {{ code }}</p>
      }
    </div>
  `,
})
class AlphanumericWrapper {
  code = '';
}

// ── States Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'otp-states-wrapper',
  standalone: true,
  imports: [OtpInputComponent],
  template: `
    <div class="p-6" style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div>
        <p class="text-xs text-gray-500 mb-2">Normal</p>
        <ngx-ds-otp-input />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-2">Error</p>
        <ngx-ds-otp-input errorMessage="El código no es válido" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-2">Enmascarado (PIN)</p>
        <ngx-ds-otp-input [masked]="true" [length]="4" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-2">Deshabilitado</p>
        <ngx-ds-otp-input [disabled]="true" />
      </div>
    </div>
  `,
})
class StatesWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/OtpInput',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    length: 6,
    type: 'numeric' as OtpType,
    size: 'md' as OtpSize,
    disabled: false,
    masked: false,
    errorMessage: '',
  },
  argTypes: {
    length: { control: 'number' },
    type: { control: 'radio', options: ['numeric', 'alphanumeric'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    masked: { control: 'boolean' },
    errorMessage: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 1.5rem;">
        <ngx-ds-otp-input
          [length]="length"
          [type]="type"
          [size]="size"
          [disabled]="disabled"
          [masked]="masked"
          [errorMessage]="errorMessage"
        />
      </div>
    `,
    moduleMetadata: { imports: [OtpInputComponent] },
  }),
};

export const Numeric: Story = {
  render: () => ({
    template: `<otp-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<otp-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const Alphanumeric: Story = {
  render: () => ({
    template: `<otp-alpha-wrapper />`,
    moduleMetadata: { imports: [AlphanumericWrapper] },
  }),
};

export const States: Story = {
  render: () => ({
    template: `<otp-states-wrapper />`,
    moduleMetadata: { imports: [StatesWrapper] },
  }),
};

// ── Reactive Forms ────────────────────────────────────────────────────────────

@Component({
  selector: 'otp-forms-wrapper',
  standalone: true,
  imports: [OtpInputComponent, ReactiveFormsModule],
  template: `
    <div class="p-6 space-y-4">
      <ngx-ds-otp-input
        [formControl]="code"
        [errorMessage]="code.invalid && code.touched ? 'Introduce los 6 dígitos' : ''"
      />
      <p class="text-sm text-gray-500">
        value: <code>{{ code.value || '—' }}</code> · valid: {{ code.valid }} · touched:
        {{ code.touched }}
      </p>
      <div class="flex gap-2">
        <button type="button" (click)="code.setValue('123456')">Set 123456</button>
        <button type="button" (click)="code.reset()">Reset</button>
        <button type="button" (click)="code.disabled ? code.enable() : code.disable()">
          Toggle disabled
        </button>
      </div>
    </div>
  `,
})
class OtpFormsWrapper {
  code = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });
}

export const ReactiveForms: Story = {
  render: () => ({
    template: `<otp-forms-wrapper />`,
    moduleMetadata: { imports: [OtpFormsWrapper] },
  }),
};
