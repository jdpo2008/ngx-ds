import { Meta, StoryObj } from '@storybook/angular';
import { Component, inject, signal } from '@angular/core';
import { ConfirmationComponent } from '../../../src/lib/organisms/confirmation/confirmation.component';
import { ConfirmationService } from '../../../src/lib/services/confirmation.service';
import { ButtonComponent } from '../../../src/lib/atoms/button/button.component';

// ── Info Wrapper ──────────────────────────────────────────────────────────────

@Component({
  selector: 'conf-info-wrapper',
  standalone: true,
  imports: [ConfirmationComponent, ButtonComponent],
  template: `
    <div class="p-8 flex flex-col items-center gap-6">
      <ngx-ds-confirmation />
      <ngx-ds-button (click)="open()">Abrir confirmación</ngx-ds-button>
      @if (result() !== null) {
        <p class="text-sm text-gray-600">
          Resultado:
          <span [class]="result() ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
            {{ result() ? 'Confirmado' : 'Cancelado' }}
          </span>
        </p>
      }
    </div>
  `,
})
class InfoWrapper {
  private readonly confirmationService = inject(ConfirmationService);
  result = signal<boolean | null>(null);

  async open(): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      type: 'info',
      title: '¿Deseas continuar?',
      message: 'Esta acción actualizará la configuración del sistema. ¿Estás seguro?',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
    });
    this.result.set(confirmed);
  }
}

// ── Warning Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'conf-warning-wrapper',
  standalone: true,
  imports: [ConfirmationComponent, ButtonComponent],
  template: `
    <div class="p-8 flex flex-col items-center gap-6">
      <ngx-ds-confirmation />
      <ngx-ds-button color="warning" (click)="open()">Acción con advertencia</ngx-ds-button>
      @if (result() !== null) {
        <p class="text-sm text-gray-600">
          Resultado:
          <span [class]="result() ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
            {{ result() ? 'Confirmado' : 'Cancelado' }}
          </span>
        </p>
      }
    </div>
  `,
})
class WarningWrapper {
  private readonly confirmationService = inject(ConfirmationService);
  result = signal<boolean | null>(null);

  async open(): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      type: 'warning',
      title: 'Cambios sin guardar',
      message: 'Tienes cambios sin guardar. Si continúas, perderás todos los cambios realizados.',
      confirmText: 'Continuar sin guardar',
      cancelText: 'Volver',
    });
    this.result.set(confirmed);
  }
}

// ── Danger Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'conf-danger-wrapper',
  standalone: true,
  imports: [ConfirmationComponent, ButtonComponent],
  template: `
    <div class="p-8 flex flex-col items-center gap-6">
      <ngx-ds-confirmation />
      <ngx-ds-button color="danger" (click)="open()">Eliminar registro</ngx-ds-button>
      @if (result() !== null) {
        <p class="text-sm text-gray-600">
          Resultado:
          <span [class]="result() ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
            {{ result() ? 'Eliminado' : 'Cancelado' }}
          </span>
        </p>
      }
    </div>
  `,
})
class DangerWrapper {
  private readonly confirmationService = inject(ConfirmationService);
  result = signal<boolean | null>(null);

  async open(): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      type: 'danger',
      title: '¿Eliminar usuario?',
      message:
        'Esta acción es permanente y no se puede deshacer. El usuario perderá acceso inmediatamente.',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
    });
    this.result.set(confirmed);
  }
}

// ── Real World Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'conf-real-world-wrapper',
  standalone: true,
  imports: [ConfirmationComponent, ButtonComponent],
  template: `
    <div class="p-8 space-y-4">
      <ngx-ds-confirmation />
      <p class="text-sm text-gray-500 mb-4">Simula acciones típicas de una aplicación</p>

      <div class="flex flex-wrap gap-3">
        <ngx-ds-button color="primary" (click)="publish()">Publicar artículo</ngx-ds-button>
        <ngx-ds-button color="warning" variant="outline" (click)="discard()"
          >Descartar borrador</ngx-ds-button
        >
        <ngx-ds-button color="danger" variant="outline" (click)="deleteAccount()"
          >Eliminar cuenta</ngx-ds-button
        >
      </div>

      @if (lastAction()) {
        <div class="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700">
          {{ lastAction() }}
        </div>
      }
    </div>
  `,
})
class RealWorldWrapper {
  private readonly confirmationService = inject(ConfirmationService);
  lastAction = signal<string>('');

  async publish(): Promise<void> {
    const ok = await this.confirmationService.confirm({
      type: 'info',
      title: '¿Publicar artículo?',
      message: 'El artículo será visible para todos los usuarios. ¿Deseas publicarlo ahora?',
      confirmText: 'Publicar',
      cancelText: 'Cancelar',
    });
    this.lastAction.set(ok ? 'Artículo publicado correctamente.' : 'Publicación cancelada.');
  }

  async discard(): Promise<void> {
    const ok = await this.confirmationService.confirm({
      type: 'warning',
      title: 'Descartar borrador',
      message: 'Perderás todo el contenido escrito. Esta acción no se puede deshacer.',
      confirmText: 'Descartar',
      cancelText: 'Conservar',
    });
    this.lastAction.set(ok ? 'Borrador descartado.' : 'Se conservó el borrador.');
  }

  async deleteAccount(): Promise<void> {
    const ok = await this.confirmationService.confirm({
      type: 'danger',
      title: '¿Eliminar tu cuenta?',
      message: 'Se borrarán todos tus datos, proyectos y configuraciones de forma permanente.',
      confirmText: 'Sí, eliminar mi cuenta',
      cancelText: 'No, mantener cuenta',
    });
    this.lastAction.set(ok ? 'Cuenta eliminada.' : 'Eliminación cancelada, cuenta conservada.');
  }
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Organisms/Confirmation',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Info: Story = {
  render: () => ({
    template: `<conf-info-wrapper />`,
    moduleMetadata: { imports: [InfoWrapper] },
  }),
};

export const Warning: Story = {
  render: () => ({
    template: `<conf-warning-wrapper />`,
    moduleMetadata: { imports: [WarningWrapper] },
  }),
};

export const Danger: Story = {
  render: () => ({
    template: `<conf-danger-wrapper />`,
    moduleMetadata: { imports: [DangerWrapper] },
  }),
};

export const RealWorld: Story = {
  render: () => ({
    template: `<conf-real-world-wrapper />`,
    moduleMetadata: { imports: [RealWorldWrapper] },
  }),
};
