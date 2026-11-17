import { Meta, StoryObj } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { ToastComponent } from '../../../src/lib/organisms/toast/toast.component';
import { ToastrService, ToastPosition } from '../../../src/lib/services/toast.service';
import { ButtonComponent } from '../../../src/lib/atoms/button/button.component';
// ─── Default Story Wrapper ───────────────────────────────────────────────────

@Component({
  selector: 'toast-default-wrapper',
  standalone: true,
  imports: [ToastComponent, ButtonComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-2">Haz clic en los botones para disparar toasts.</p>
      <div class="flex flex-wrap gap-2">
        <ngx-ds-button variant="solid" color="success" (click)="showSuccess()"
          >Success</ngx-ds-button
        >
        <ngx-ds-button variant="solid" color="danger" (click)="showError()">Error</ngx-ds-button>
        <ngx-ds-button variant="solid" color="warning" (click)="showWarning()"
          >Warning</ngx-ds-button
        >
        <ngx-ds-button variant="solid" color="primary" (click)="showInfo()">info</ngx-ds-button>
      </div>
      <ngx-ds-toast />
    </div>
  `,
})
class DefaultWrapper {
  private toastrService = inject(ToastrService);

  showSuccess(): void {
    this.toastrService.success('Operación completada con éxito', 'Éxito');
  }

  showError(): void {
    this.toastrService.error('Ha ocurrido un error inesperado', 'Error');
  }

  showWarning(): void {
    this.toastrService.warning('Verifica los datos antes de continuar', 'Advertencia');
  }

  showInfo(): void {
    this.toastrService.info('Nueva actualización disponible', 'Información');
  }
}

// ─── All Types Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'toast-all-types-wrapper',
  standalone: true,
  imports: [ToastComponent, ButtonComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-2">Dispara los cuatro tipos de toast simultáneamente.</p>
      <ngx-ds-button variant="solid" color="secondary" (click)="showAll()">
        Mostrar todos los tipos</ngx-ds-button
      >
      <ngx-ds-toast />
    </div>
  `,
})
class AllTypesWrapper {
  private toastrService = inject(ToastrService);

  showAll(): void {
    this.toastrService.success('Archivo guardado correctamente', 'Éxito', 8000);
    this.toastrService.error('No se pudo conectar al servidor', 'Error', 8000);
    this.toastrService.warning('El formulario tiene campos vacíos', 'Advertencia', 8000);
    this.toastrService.info('Hay una nueva versión disponible', 'Información', 8000);
  }
}

// ─── All Positions Wrapper ────────────────────────────────────────────────────

@Component({
  selector: 'toast-positions-wrapper',
  standalone: true,
  imports: [ToastComponent, ButtonComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-2">
        Haz clic en cada botón para ver el toast en esa posición.
      </p>
      <div class="grid grid-cols-2 gap-2 max-w-xs">
        <ngx-ds-button variant="solid" color="primary" (click)="show('top-left')"
          >Top Left</ngx-ds-button
        >
        <ngx-ds-button variant="solid" color="primary" (click)="show('top-right')"
          >Top Right</ngx-ds-button
        >
        <ngx-ds-button variant="solid" color="primary" (click)="show('bottom-left')"
          >Bottom Left</ngx-ds-button
        >
        <ngx-ds-button variant="solid" color="primary" (click)="show('bottom-right')"
          >Bottom Right</ngx-ds-button
        >
      </div>
      <ngx-ds-toast />
    </div>
  `,
})
class AllPositionsWrapper {
  private toastrService = inject(ToastrService);

  show(position: ToastPosition): void {
    this.toastrService.show({
      message: `Toast apareciendo en ${position}`,
      type: 'info',
      position,
      title: `Posición: ${position}`,
    });
  }
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Organisms/Toast',
};

export default meta;
type Story = StoryObj;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<toast-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const AllTypes: Story = {
  render: () => ({
    template: `<toast-all-types-wrapper />`,
    moduleMetadata: { imports: [AllTypesWrapper] },
  }),
};

export const AllPositions: Story = {
  render: () => ({
    template: `<toast-positions-wrapper />`,
    moduleMetadata: { imports: [AllPositionsWrapper] },
  }),
};
