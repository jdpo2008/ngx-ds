import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../src/lib/organisms/modal/modal.component';
import { ButtonComponent } from '../../../src/lib/atoms/button/button.component';
import { Trash2, AlertTriangle } from 'lucide-angular';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'modal-basic-wrapper',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  template: `
    <div class="p-6">
      <ngx-ds-button (click)="open.set(true)">Abrir modal</ngx-ds-button>

      <ngx-ds-modal [(open)]="open" title="Información del usuario">
        <p>Este modal muestra información básica con título y botones de acción en el footer.</p>
        <p style="margin-top: 0.75rem">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>

        <div modal-footer>
          <ngx-ds-button variant="outline" color="secondary" (click)="open.set(false)">
            Cancelar
          </ngx-ds-button>
          <ngx-ds-button color="primary" (click)="open.set(false)"> Confirmar </ngx-ds-button>
        </div>
      </ngx-ds-modal>
    </div>
  `,
})
class BasicWrapper {
  readonly open = signal(false);
}

// ── Confirm Danger Wrapper ────────────────────────────────────────────────────

@Component({
  selector: 'modal-danger-wrapper',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  template: `
    <div class="p-6">
      <ngx-ds-button color="danger" [iconLeft]="iconTrash" (click)="open.set(true)">
        Eliminar registro
      </ngx-ds-button>

      <ngx-ds-modal [(open)]="open" size="sm" title="¿Eliminar este registro?">
        <p>
          Esta acción es permanente y no se puede deshacer. El registro y todos sus datos asociados
          serán borrados.
        </p>

        <div modal-footer>
          <ngx-ds-button variant="outline" color="secondary" (click)="open.set(false)">
            Cancelar
          </ngx-ds-button>
          <ngx-ds-button color="danger" [iconLeft]="iconTrash" (click)="open.set(false)">
            Sí, eliminar
          </ngx-ds-button>
        </div>
      </ngx-ds-modal>
    </div>
  `,
})
class DangerWrapper {
  readonly open = signal(false);
  readonly iconTrash = Trash2;
}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'modal-sizes-wrapper',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  template: `
    <div class="p-6 flex flex-wrap gap-3">
      <ngx-ds-button variant="outline" color="secondary" (click)="openWith('sm')">sm</ngx-ds-button>
      <ngx-ds-button variant="outline" color="secondary" (click)="openWith('md')">md</ngx-ds-button>
      <ngx-ds-button variant="outline" color="secondary" (click)="openWith('lg')">lg</ngx-ds-button>
      <ngx-ds-button variant="outline" color="secondary" (click)="openWith('xl')">xl</ngx-ds-button>
      <ngx-ds-button variant="outline" color="secondary" (click)="openWith('full')"
        >full</ngx-ds-button
      >

      <ngx-ds-modal [(open)]="open" [size]="active()" [title]="'Tamaño: ' + active()">
        <p>
          Este modal usa <strong>size="{{ active() }}"</strong>. El contenido se adapta al ancho
          disponible.
        </p>

        <div modal-footer>
          <ngx-ds-button color="primary" (click)="open.set(false)">Cerrar</ngx-ds-button>
        </div>
      </ngx-ds-modal>
    </div>
  `,
})
class SizesWrapper {
  readonly active = signal<ModalSize>('md');
  readonly open = signal(false);

  openWith(size: ModalSize): void {
    this.active.set(size);
    this.open.set(true);
  }
}

// ── No Close Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'modal-no-close-wrapper',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  template: `
    <div class="p-6">
      <ngx-ds-button (click)="open.set(true)">Abrir modal sin X</ngx-ds-button>

      <ngx-ds-modal
        [(open)]="open"
        title="Acción requerida"
        [showClose]="false"
        [closeOnBackdrop]="false"
        [closeOnEscape]="false"
      >
        <p>
          Este modal requiere que el usuario tome una acción explícita. No se puede cerrar haciendo
          clic fuera ni con Escape.
        </p>

        <div modal-footer>
          <ngx-ds-button variant="outline" color="secondary" (click)="open.set(false)">
            Cancelar
          </ngx-ds-button>
          <ngx-ds-button color="primary" (click)="open.set(false)">
            Aceptar términos
          </ngx-ds-button>
        </div>
      </ngx-ds-modal>
    </div>
  `,
})
class NoCloseWrapper {
  readonly open = signal(false);
}

// ── Custom Header Wrapper ─────────────────────────────────────────────────────

@Component({
  selector: 'modal-custom-header-wrapper',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  template: `
    <div class="p-6">
      <ngx-ds-button (click)="open.set(true)">Abrir con header personalizado</ngx-ds-button>

      <ngx-ds-modal [(open)]="open">
        <div modal-header style="display: flex; align-items: center; gap: 0.625rem; flex: 1;">
          <span style="display: inline-flex; color: #f59e0b;">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
          <span style="font-size: 1rem; font-weight: 600; color: #111827;">Advertencia</span>
        </div>

        <p>
          Puedes proyectar cualquier contenido en el slot <code>[modal-header]</code> para
          personalizar completamente el encabezado.
        </p>

        <div modal-footer>
          <ngx-ds-button color="warning" (click)="open.set(false)">Entendido</ngx-ds-button>
        </div>
      </ngx-ds-modal>
    </div>
  `,
})
class CustomHeaderWrapper {
  readonly open = signal(false);
}

// ── Loading Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'modal-loading-wrapper',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  template: `
    <div class="p-6">
      <ngx-ds-button (click)="open.set(true)">Abrir modal con acción async</ngx-ds-button>

      <ngx-ds-modal [(open)]="open" title="Guardar cambios">
        <p>Al confirmar se simulará una operación asíncrona de 2 segundos.</p>

        <div modal-footer>
          <ngx-ds-button
            variant="outline"
            color="secondary"
            [disabled]="loading()"
            (click)="open.set(false)"
          >
            Cancelar
          </ngx-ds-button>
          <ngx-ds-button color="primary" [loading]="loading()" (click)="save()">
            Guardar
          </ngx-ds-button>
        </div>
      </ngx-ds-modal>
    </div>
  `,
})
class LoadingWrapper {
  readonly open = signal(false);
  readonly loading = signal(false);

  save(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.open.set(false);
    }, 2000);
  }
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Organisms/Modal',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<modal-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};

export const ConfirmDanger: Story = {
  render: () => ({
    template: `<modal-danger-wrapper />`,
    moduleMetadata: { imports: [DangerWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<modal-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const NoCloseButton: Story = {
  render: () => ({
    template: `<modal-no-close-wrapper />`,
    moduleMetadata: { imports: [NoCloseWrapper] },
  }),
};

export const CustomHeader: Story = {
  render: () => ({
    template: `<modal-custom-header-wrapper />`,
    moduleMetadata: { imports: [CustomHeaderWrapper] },
  }),
};

export const WithLoadingAction: Story = {
  render: () => ({
    template: `<modal-loading-wrapper />`,
    moduleMetadata: { imports: [LoadingWrapper] },
  }),
};
