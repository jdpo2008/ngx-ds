import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { AlertComponent } from '../../../src/lib/molecules/alert/alert.component';

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'alert-default-wrapper',
  standalone: true,
  imports: [AlertComponent],
  template: `
    <div class="p-6 flex flex-col gap-2 max-w-md">
      <ngx-ds-alert type="info"> Tu sesión expirará en 10 minutos. </ngx-ds-alert>
      <ngx-ds-alert type="success"> Los cambios se guardaron correctamente. </ngx-ds-alert>
      <ngx-ds-alert type="warning"> Este archivo supera el tamaño recomendado. </ngx-ds-alert>
      <ngx-ds-alert type="danger"> No se pudo completar la operación. </ngx-ds-alert>
    </div>
  `,
})
class DefaultWrapper {}

// ── Variants Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'alert-variants-wrapper',
  standalone: true,
  imports: [AlertComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Soft (por defecto)</p>
        <div class="flex flex-col gap-2">
          <ngx-ds-alert type="info" variant="soft"
            >Información importante para el usuario.</ngx-ds-alert
          >
          <ngx-ds-alert type="success" variant="soft"
            >Operación completada exitosamente.</ngx-ds-alert
          >
          <ngx-ds-alert type="warning" variant="soft"
            >Revisa los datos antes de continuar.</ngx-ds-alert
          >
          <ngx-ds-alert type="danger" variant="soft">Se produjo un error inesperado.</ngx-ds-alert>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Solid</p>
        <div class="flex flex-col gap-2">
          <ngx-ds-alert type="info" variant="solid"
            >Información importante para el usuario.</ngx-ds-alert
          >
          <ngx-ds-alert type="success" variant="solid"
            >Operación completada exitosamente.</ngx-ds-alert
          >
          <ngx-ds-alert type="warning" variant="solid"
            >Revisa los datos antes de continuar.</ngx-ds-alert
          >
          <ngx-ds-alert type="danger" variant="solid">Se produjo un error inesperado.</ngx-ds-alert>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Outline</p>
        <div class="flex flex-col gap-2">
          <ngx-ds-alert type="info" variant="outline"
            >Información importante para el usuario.</ngx-ds-alert
          >
          <ngx-ds-alert type="success" variant="outline"
            >Operación completada exitosamente.</ngx-ds-alert
          >
          <ngx-ds-alert type="warning" variant="outline"
            >Revisa los datos antes de continuar.</ngx-ds-alert
          >
          <ngx-ds-alert type="danger" variant="outline"
            >Se produjo un error inesperado.</ngx-ds-alert
          >
        </div>
      </div>
    </div>
  `,
})
class VariantsWrapper {}

// ── With Title Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'alert-title-wrapper',
  standalone: true,
  imports: [AlertComponent],
  template: `
    <div class="p-6 flex flex-col gap-2">
      <ngx-ds-alert type="info" title="Actualización disponible">
        Hay una nueva versión de la aplicación. Recarga la página para aplicar los cambios.
      </ngx-ds-alert>
      <ngx-ds-alert type="success" title="Pago procesado">
        Tu pago de $149.00 fue procesado exitosamente. Recibirás un recibo por correo.
      </ngx-ds-alert>
      <ngx-ds-alert type="warning" title="Cuota casi alcanzada">
        Has utilizado el 90% de tu almacenamiento. Considera ampliar tu plan.
      </ngx-ds-alert>
      <ngx-ds-alert type="danger" title="Error de autenticación">
        No fue posible verificar tu identidad. Por favor, inicia sesión nuevamente.
      </ngx-ds-alert>
    </div>
  `,
})
class TitleWrapper {}

// ── No Icon Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'alert-no-icon-wrapper',
  standalone: true,
  imports: [AlertComponent],
  template: `
    <div class="p-6 flex flex-col gap-2">
      <ngx-ds-alert type="info" [showIcon]="false" title="Sin icono"
        >Mensaje informativo sin icono.</ngx-ds-alert
      >
      <ngx-ds-alert type="success" [showIcon]="false">Éxito sin icono.</ngx-ds-alert>
      <ngx-ds-alert type="warning" [showIcon]="false">Advertencia sin icono.</ngx-ds-alert>
      <ngx-ds-alert type="danger" [showIcon]="false">Error sin icono.</ngx-ds-alert>
    </div>
  `,
})
class NoIconWrapper {}

// ── Dismissible Wrapper ───────────────────────────────────────────────────────

@Component({
  selector: 'alert-dismissible-wrapper',
  standalone: true,
  imports: [AlertComponent],
  template: `
    <div class="p-6 flex flex-col gap-2">
      <p class="text-sm text-gray-500 mb-3">Haz clic en la × para cerrar</p>

      @if (showInfo()) {
        <ngx-ds-alert
          type="info"
          title="Bienvenido"
          [dismissible]="true"
          (dismissed)="showInfo.set(false)"
        >
          Completa tu perfil para aprovechar al máximo la plataforma.
        </ngx-ds-alert>
      }

      @if (showSuccess()) {
        <ngx-ds-alert type="success" [dismissible]="true" (dismissed)="showSuccess.set(false)">
          Los cambios se guardaron. Puedes cerrar esta notificación.
        </ngx-ds-alert>
      }

      @if (showWarning()) {
        <ngx-ds-alert
          type="warning"
          title="Atención"
          [dismissible]="true"
          (dismissed)="showWarning.set(false)"
        >
          Este proceso puede tardar varios minutos.
        </ngx-ds-alert>
      }

      @if (showDanger()) {
        <ngx-ds-alert
          type="danger"
          title="Error"
          [dismissible]="true"
          (dismissed)="showDanger.set(false)"
        >
          No se pudo conectar con el servidor. Intenta de nuevo.
        </ngx-ds-alert>
      }

      @if (!showInfo() && !showSuccess() && !showWarning() && !showDanger()) {
        <p class="text-sm text-gray-400 italic">Todas las alertas han sido cerradas.</p>
      }
    </div>
  `,
})
class DismissibleWrapper {
  showInfo = signal(true);
  showSuccess = signal(true);
  showWarning = signal(true);
  showDanger = signal(true);
}

// ── Real World Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'alert-real-world-wrapper',
  standalone: true,
  imports: [AlertComponent],
  template: `
    <div class="p-6 flex flex-col gap-2 max-w-xl">
      <ngx-ds-alert
        type="warning"
        variant="soft"
        title="Verificación pendiente"
        [dismissible]="true"
      >
        Tu dirección de correo aún no ha sido verificada.
        <br />
        <a href="#" class="font-medium underline mt-1 inline-block"
          >Reenviar email de verificación</a
        >
      </ngx-ds-alert>

      <ngx-ds-alert
        type="danger"
        variant="outline"
        title="Errores en el formulario"
        [showIcon]="true"
      >
        Por favor corrige los siguientes campos:
        <ul class="mt-1 list-disc list-inside space-y-0.5">
          <li>El nombre es obligatorio</li>
          <li>El email no tiene un formato válido</li>
          <li>La contraseña debe tener al menos 8 caracteres</li>
        </ul>
      </ngx-ds-alert>

      <ngx-ds-alert type="success" variant="soft" title="¡Cuenta creada!" [dismissible]="true">
        Ya puedes iniciar sesión con tus credenciales.
      </ngx-ds-alert>
    </div>
  `,
})
class RealWorldWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/Alert',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<alert-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `<alert-variants-wrapper />`,
    moduleMetadata: { imports: [VariantsWrapper] },
  }),
};

export const WithTitle: Story = {
  render: () => ({
    template: `<alert-title-wrapper />`,
    moduleMetadata: { imports: [TitleWrapper] },
  }),
};

export const NoIcon: Story = {
  render: () => ({
    template: `<alert-no-icon-wrapper />`,
    moduleMetadata: { imports: [NoIconWrapper] },
  }),
};

export const Dismissible: Story = {
  render: () => ({
    template: `<alert-dismissible-wrapper />`,
    moduleMetadata: { imports: [DismissibleWrapper] },
  }),
};

export const RealWorld: Story = {
  render: () => ({
    template: `<alert-real-world-wrapper />`,
    moduleMetadata: { imports: [RealWorldWrapper] },
  }),
};
