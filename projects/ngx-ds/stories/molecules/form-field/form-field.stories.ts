import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { FormFieldComponent } from '../../../src/lib/molecules/form-field/form-field.component';

// ── Auto-wiring Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'form-field-autowire-wrapper',
  standalone: true,
  imports: [FormFieldComponent],
  template: `
    <div style="max-width: 20rem;">
      <ngx-ds-form-field label="Correo electrónico" hint="Nunca lo compartiremos" [required]="true">
        <input
          type="email"
          placeholder="tu@email.com"
          style="width: 100%; padding: 0.5rem 0.75rem; border: 1.5px solid var(--border-input, #d1d5db); border-radius: 0.375rem; font: inherit;"
        />
      </ngx-ds-form-field>
      <p style="font-size: 0.75rem; color: var(--text-muted, #6b7280); margin-top: 1rem;">
        Inspecciona el &lt;input&gt; — id/aria-describedby/aria-invalid se asignan automáticamente.
      </p>
    </div>
  `,
})
class AutowireWrapper {}

// ── States Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'form-field-states-wrapper',
  standalone: true,
  imports: [FormFieldComponent],
  template: `
    <div style="max-width: 20rem; display: flex; flex-direction: column; gap: 1.5rem;">
      <ngx-ds-form-field label="Con hint" hint="Texto de ayuda">
        <input
          style="width: 100%; padding: 0.5rem 0.75rem; border: 1.5px solid var(--border-input, #d1d5db); border-radius: 0.375rem; font: inherit;"
        />
      </ngx-ds-form-field>

      <ngx-ds-form-field label="Con error" errorMessage="Este campo es obligatorio">
        <input
          style="width: 100%; padding: 0.5rem 0.75rem; border: 1.5px solid var(--border-input, #d1d5db); border-radius: 0.375rem; font: inherit;"
        />
      </ngx-ds-form-field>

      <ngx-ds-form-field label="Requerido" [required]="true">
        <input
          style="width: 100%; padding: 0.5rem 0.75rem; border: 1.5px solid var(--border-input, #d1d5db); border-radius: 0.375rem; font: inherit;"
        />
      </ngx-ds-form-field>

      <ngx-ds-form-field label="Deshabilitado" [disabled]="true" hint="No editable">
        <input
          disabled
          style="width: 100%; padding: 0.5rem 0.75rem; border: 1.5px solid var(--border-input, #d1d5db); border-radius: 0.375rem; font: inherit;"
        />
      </ngx-ds-form-field>
    </div>
  `,
})
class StatesWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/FormField',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Autowiring: Story = {
  render: () => ({
    template: `<form-field-autowire-wrapper />`,
    moduleMetadata: { imports: [AutowireWrapper] },
  }),
};

export const States: Story = {
  render: () => ({
    template: `<form-field-states-wrapper />`,
    moduleMetadata: { imports: [StatesWrapper] },
  }),
};
