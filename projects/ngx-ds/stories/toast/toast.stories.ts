import { Meta, StoryObj } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { ToastComponent } from '../../src/lib/components/toast/toast.component';
import { ToastrService, ToastPosition } from '../../src/lib/services/toast.service';

// ─── Default Story Wrapper ───────────────────────────────────────────────────

@Component({
  selector: 'toast-default-wrapper',
  standalone: true,
  imports: [ToastComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-2">
        Haz clic en los botones para disparar toasts.
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          (click)="showSuccess()"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Success
        </button>
        <button
          (click)="showError()"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Error
        </button>
        <button
          (click)="showWarning()"
          class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          Warning
        </button>
        <button
          (click)="showInfo()"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Info
        </button>
      </div>
      <app-toast />
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
  imports: [ToastComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-2">
        Dispara los cuatro tipos de toast simultáneamente.
      </p>
      <button
        (click)="showAll()"
        class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
      >
        Mostrar todos los tipos
      </button>
      <app-toast />
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
  imports: [ToastComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-2">
        Haz clic en cada botón para ver el toast en esa posición.
      </p>
      <div class="grid grid-cols-2 gap-2 max-w-xs">
        <button
          (click)="show('top-left')"
          class="px-3 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition-colors"
        >
          Top Left
        </button>
        <button
          (click)="show('top-right')"
          class="px-3 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition-colors"
        >
          Top Right
        </button>
        <button
          (click)="show('bottom-left')"
          class="px-3 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition-colors"
        >
          Bottom Left
        </button>
        <button
          (click)="show('bottom-right')"
          class="px-3 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition-colors"
        >
          Bottom Right
        </button>
      </div>
      <app-toast />
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
  title: 'Components/Toast',
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
