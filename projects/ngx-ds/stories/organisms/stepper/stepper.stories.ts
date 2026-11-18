import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  StepperComponent,
  StepComponent,
  StepperOrientation,
} from '../../../src/lib/organisms/stepper';
import { ButtonComponent } from '../../../src/lib/atoms/button/button.component';

// ── Horizontal Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'stepper-horizontal-wrapper',
  standalone: true,
  imports: [StepperComponent, StepComponent, ButtonComponent],
  template: `
    <div class="p-6" style="max-width: 52rem;">
      <ngx-ds-stepper [(active)]="step" orientation="horizontal">
        <ngx-ds-step label="Información personal" description="Nombre, email y teléfono">
          <div
            style="padding: 1.25rem; border: 1.5px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem; margin-top: 0.5rem;"
          >
            <p style="font-size: 0.875rem; color: var(--text-secondary, #374151); margin: 0;">
              Formulario con datos básicos de contacto. Completa todos los campos obligatorios antes
              de continuar.
            </p>
          </div>
        </ngx-ds-step>
        <ngx-ds-step label="Dirección" description="Dirección de facturación y envío">
          <div
            style="padding: 1.25rem; border: 1.5px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem; margin-top: 0.5rem;"
          >
            <p style="font-size: 0.875rem; color: var(--text-secondary, #374151); margin: 0;">
              Ingresa la dirección de envío. Puedes usar la misma para facturación.
            </p>
          </div>
        </ngx-ds-step>
        <ngx-ds-step label="Método de pago" description="Tarjeta o transferencia">
          <div
            style="padding: 1.25rem; border: 1.5px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem; margin-top: 0.5rem;"
          >
            <p style="font-size: 0.875rem; color: var(--text-secondary, #374151); margin: 0;">
              Selecciona tu método de pago preferido y confirma los datos.
            </p>
          </div>
        </ngx-ds-step>
        <ngx-ds-step label="Confirmación" description="Revisa y envía tu pedido">
          <div
            style="padding: 1.25rem; border: 1.5px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem; margin-top: 0.5rem;"
          >
            <p style="font-size: 0.875rem; color: var(--text-secondary, #374151); margin: 0;">
              Revisa el resumen de tu pedido. Al confirmar se procesará el pago.
            </p>
          </div>
        </ngx-ds-step>
      </ngx-ds-stepper>

      <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
        <ngx-ds-button variant="outline" color="secondary" [disabled]="step === 0" (click)="prev()">
          Anterior
        </ngx-ds-button>
        <ngx-ds-button color="primary" (click)="next()">
          {{ step === 3 ? 'Finalizar' : 'Siguiente' }}
        </ngx-ds-button>
      </div>
    </div>
  `,
})
class HorizontalWrapper {
  step = 0;
  next(): void {
    if (this.step < 3) this.step++;
  }
  prev(): void {
    if (this.step > 0) this.step--;
  }
}

// ── Vertical Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'stepper-vertical-wrapper',
  standalone: true,
  imports: [StepperComponent, StepComponent, ButtonComponent],
  template: `
    <div class="p-6" style="max-width: 52rem;">
      <ngx-ds-stepper [(active)]="step" orientation="vertical">
        <ngx-ds-step label="Crear cuenta" description="Elige usuario y contraseña">
          <div
            style="padding: 1.25rem; border: 1.5px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem;"
          >
            <p
              style="font-size: 0.875rem; color: var(--text-secondary, #374151); margin: 0 0 1rem;"
            >
              Ingresa los datos para crear tu cuenta de acceso.
            </p>
            <div style="display: flex; gap: 0.75rem;">
              <ngx-ds-button
                variant="outline"
                color="secondary"
                [disabled]="step === 0"
                (click)="prev()"
                >Anterior</ngx-ds-button
              >
              <ngx-ds-button color="primary" (click)="next()">Siguiente</ngx-ds-button>
            </div>
          </div>
        </ngx-ds-step>
        <ngx-ds-step label="Verificar email" description="Código enviado a tu correo">
          <div
            style="padding: 1.25rem; border: 1.5px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem;"
          >
            <p
              style="font-size: 0.875rem; color: var(--text-secondary, #374151); margin: 0 0 1rem;"
            >
              Ingresa el código de 6 dígitos que enviamos a tu email.
            </p>
            <div style="display: flex; gap: 0.75rem;">
              <ngx-ds-button variant="outline" color="secondary" (click)="prev()"
                >Anterior</ngx-ds-button
              >
              <ngx-ds-button color="primary" (click)="next()">Siguiente</ngx-ds-button>
            </div>
          </div>
        </ngx-ds-step>
        <ngx-ds-step label="Configurar perfil" description="Personaliza tu experiencia">
          <div
            style="padding: 1.25rem; border: 1.5px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem;"
          >
            <p
              style="font-size: 0.875rem; color: var(--text-secondary, #374151); margin: 0 0 1rem;"
            >
              Sube tu foto de perfil y elige tus preferencias.
            </p>
            <div style="display: flex; gap: 0.75rem;">
              <ngx-ds-button variant="outline" color="secondary" (click)="prev()"
                >Anterior</ngx-ds-button
              >
              <ngx-ds-button color="success" (click)="next()">Finalizar</ngx-ds-button>
            </div>
          </div>
        </ngx-ds-step>
      </ngx-ds-stepper>
    </div>
  `,
})
class VerticalWrapper {
  step = 0;
  next(): void {
    if (this.step < 2) this.step++;
  }
  prev(): void {
    if (this.step > 0) this.step--;
  }
}

// ── Clickable Wrapper ─────────────────────────────────────────────────────────

@Component({
  selector: 'stepper-clickable-wrapper',
  standalone: true,
  imports: [StepperComponent, StepComponent, ButtonComponent],
  template: `
    <div class="p-6" style="max-width: 52rem;">
      <p class="text-sm text-gray-500 mb-4">
        Haz clic en cualquier burbuja para navegar directamente al paso.
      </p>
      <ngx-ds-stepper [(active)]="step" [clickable]="true">
        <ngx-ds-step label="Datos básicos">
          <div
            style="padding: 1.25rem; border: 1.5px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem; margin-top: 0.5rem;"
          >
            <p style="font-size: 0.875rem; color: var(--text-secondary, #374151); margin: 0;">
              Paso 1 — Datos básicos del formulario.
            </p>
          </div>
        </ngx-ds-step>
        <ngx-ds-step label="Detalles">
          <div
            style="padding: 1.25rem; border: 1.5px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem; margin-top: 0.5rem;"
          >
            <p style="font-size: 0.875rem; color: var(--text-secondary, #374151); margin: 0;">
              Paso 2 — Información detallada.
            </p>
          </div>
        </ngx-ds-step>
        <ngx-ds-step label="Documentos">
          <div
            style="padding: 1.25rem; border: 1.5px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem; margin-top: 0.5rem;"
          >
            <p style="font-size: 0.875rem; color: var(--text-secondary, #374151); margin: 0;">
              Paso 3 — Adjunta los documentos requeridos.
            </p>
          </div>
        </ngx-ds-step>
        <ngx-ds-step label="Revisión">
          <div
            style="padding: 1.25rem; border: 1.5px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem; margin-top: 0.5rem;"
          >
            <p style="font-size: 0.875rem; color: var(--text-secondary, #374151); margin: 0;">
              Paso 4 — Revisa y confirma la información.
            </p>
          </div>
        </ngx-ds-step>
        <ngx-ds-step label="Envío">
          <div
            style="padding: 1.25rem; border: 1.5px dashed var(--border-base, #e5e7eb); border-radius: 0.5rem; margin-top: 0.5rem;"
          >
            <p style="font-size: 0.875rem; color: var(--text-secondary, #374151); margin: 0;">
              Paso 5 — Tu solicitud ha sido enviada.
            </p>
          </div>
        </ngx-ds-step>
      </ngx-ds-stepper>

      <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
        <ngx-ds-button variant="outline" color="secondary" [disabled]="step === 0" (click)="prev()"
          >Anterior</ngx-ds-button
        >
        <ngx-ds-button color="primary" [disabled]="step === 4" (click)="next()"
          >Siguiente</ngx-ds-button
        >
      </div>
    </div>
  `,
})
class ClickableWrapper {
  step = 0;
  next(): void {
    if (this.step < 4) this.step++;
  }
  prev(): void {
    if (this.step > 0) this.step--;
  }
}

// ── Error Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'stepper-error-wrapper',
  standalone: true,
  imports: [StepperComponent, StepComponent, ButtonComponent],
  template: `
    <div class="p-6" style="max-width: 52rem;">
      <p class="text-sm text-gray-500 mb-4">El paso 2 tiene un error de validación.</p>
      <ngx-ds-stepper [active]="1" orientation="horizontal">
        <ngx-ds-step label="Información personal" description="Completado">
          <p style="font-size: 0.875rem;">Paso completado.</p>
        </ngx-ds-step>
        <ngx-ds-step label="Dirección" description="Error de validación" [error]="true">
          <div
            style="padding: 1.25rem; border: 1.5px solid rgba(239,68,68,0.4); border-radius: 0.5rem; background: rgba(239,68,68,0.04); margin-top: 0.5rem;"
          >
            <p style="font-size: 0.875rem; color: var(--fill-danger, #dc2626); margin: 0;">
              El código postal ingresado no corresponde a la región seleccionada.
            </p>
          </div>
        </ngx-ds-step>
        <ngx-ds-step label="Pago" description="Pendiente">
          <p style="font-size: 0.875rem;">Paso pendiente.</p>
        </ngx-ds-step>
        <ngx-ds-step label="Confirmación" description="Pendiente">
          <p style="font-size: 0.875rem;">Paso pendiente.</p>
        </ngx-ds-step>
      </ngx-ds-stepper>
    </div>
  `,
})
class ErrorWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Organisms/Stepper',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    orientation: 'horizontal' as StepperOrientation,
    clickable: false,
    active: 0,
  },
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    clickable: { control: 'boolean' },
    active: { control: 'number' },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 1.5rem; max-width: 52rem;">
        <ngx-ds-stepper [orientation]="orientation" [clickable]="clickable" [active]="active">
          <ngx-ds-step label="Información" description="Datos de contacto">
            <div style="padding:1rem;border:1.5px dashed var(--border-base, #e5e7eb);border-radius:0.5rem;margin-top:0.5rem;font-size:0.875rem;color:var(--text-secondary, #374151);">
              Contenido del paso 1.
            </div>
          </ngx-ds-step>
          <ngx-ds-step label="Dirección" description="Datos de envío">
            <div style="padding:1rem;border:1.5px dashed var(--border-base, #e5e7eb);border-radius:0.5rem;margin-top:0.5rem;font-size:0.875rem;color:var(--text-secondary, #374151);">
              Contenido del paso 2.
            </div>
          </ngx-ds-step>
          <ngx-ds-step label="Pago" description="Método de pago">
            <div style="padding:1rem;border:1.5px dashed var(--border-base, #e5e7eb);border-radius:0.5rem;margin-top:0.5rem;font-size:0.875rem;color:var(--text-secondary, #374151);">
              Contenido del paso 3.
            </div>
          </ngx-ds-step>
          <ngx-ds-step label="Confirmación">
            <div style="padding:1rem;border:1.5px dashed var(--border-base, #e5e7eb);border-radius:0.5rem;margin-top:0.5rem;font-size:0.875rem;color:var(--text-secondary, #374151);">
              Contenido del paso 4.
            </div>
          </ngx-ds-step>
        </ngx-ds-stepper>
      </div>
    `,
    moduleMetadata: { imports: [StepperComponent, StepComponent] },
  }),
};

export const Horizontal: Story = {
  render: () => ({
    template: `<stepper-horizontal-wrapper />`,
    moduleMetadata: { imports: [HorizontalWrapper] },
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `<stepper-vertical-wrapper />`,
    moduleMetadata: { imports: [VerticalWrapper] },
  }),
};

export const Clickable: Story = {
  render: () => ({
    template: `<stepper-clickable-wrapper />`,
    moduleMetadata: { imports: [ClickableWrapper] },
  }),
};

export const WithError: Story = {
  render: () => ({
    template: `<stepper-error-wrapper />`,
    moduleMetadata: { imports: [ErrorWrapper] },
  }),
};
