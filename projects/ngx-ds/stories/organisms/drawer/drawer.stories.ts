import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import {
  DrawerComponent,
  DrawerSide,
  DrawerSize,
} from '../../../src/lib/organisms/drawer/drawer.component';
import { ButtonComponent } from '../../../src/lib/atoms/button/button.component';
import { Trash2, Settings, Download } from 'lucide-angular';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'drawer-basic-wrapper',
  standalone: true,
  imports: [DrawerComponent, ButtonComponent],
  template: `
    <div class="p-6">
      <ngx-ds-button (click)="open.set(true)">Abrir drawer</ngx-ds-button>

      <ngx-ds-drawer [(open)]="open" title="Detalles del usuario">
        <p>
          Aquí puedes mostrar información detallada, formularios o cualquier contenido secundario
          sin abandonar la vista actual.
        </p>
        <p style="margin-top: 0.75rem">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula tincidunt
          nunc, in condimentum nunc ultricies et.
        </p>

        <div drawer-footer>
          <ngx-ds-button variant="outline" color="secondary" (click)="open.set(false)">
            Cancelar
          </ngx-ds-button>
          <ngx-ds-button color="primary" (click)="open.set(false)"> Guardar </ngx-ds-button>
        </div>
      </ngx-ds-drawer>
    </div>
  `,
})
class BasicWrapper {
  readonly open = signal(false);
}

// ── Sides Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'drawer-sides-wrapper',
  standalone: true,
  imports: [DrawerComponent, ButtonComponent],
  template: `
    <div class="p-6 flex flex-wrap gap-3">
      <ngx-ds-button variant="outline" color="secondary" (click)="openFrom('right')"
        >Derecha (default)</ngx-ds-button
      >
      <ngx-ds-button variant="outline" color="secondary" (click)="openFrom('left')"
        >Izquierda</ngx-ds-button
      >
      <ngx-ds-button variant="outline" color="secondary" (click)="openFrom('top')"
        >Arriba</ngx-ds-button
      >
      <ngx-ds-button variant="outline" color="secondary" (click)="openFrom('bottom')"
        >Abajo</ngx-ds-button
      >

      <ngx-ds-drawer [(open)]="open" [side]="activeSide()" [title]="'Drawer — ' + activeSide()">
        <p>
          Este drawer desliza desde <strong>{{ activeSide() }}</strong>. Prueba los distintos lados
          con los botones de arriba.
        </p>

        <div drawer-footer>
          <ngx-ds-button color="primary" (click)="open.set(false)">Cerrar</ngx-ds-button>
        </div>
      </ngx-ds-drawer>
    </div>
  `,
})
class SidesWrapper {
  readonly activeSide = signal<DrawerSide>('right');
  readonly open = signal(false);

  openFrom(side: DrawerSide): void {
    this.activeSide.set(side);
    this.open.set(true);
  }
}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'drawer-sizes-wrapper',
  standalone: true,
  imports: [DrawerComponent, ButtonComponent],
  template: `
    <div class="p-6 flex flex-wrap gap-3">
      <ngx-ds-button variant="outline" color="secondary" (click)="openWith('sm')">sm</ngx-ds-button>
      <ngx-ds-button variant="outline" color="secondary" (click)="openWith('md')">md</ngx-ds-button>
      <ngx-ds-button variant="outline" color="secondary" (click)="openWith('lg')">lg</ngx-ds-button>
      <ngx-ds-button variant="outline" color="secondary" (click)="openWith('xl')">xl</ngx-ds-button>
      <ngx-ds-button variant="outline" color="secondary" (click)="openWith('full')"
        >full</ngx-ds-button
      >

      <ngx-ds-drawer [(open)]="open" [size]="activeSize()" [title]="'Tamaño: ' + activeSize()">
        <p>
          Este drawer usa <strong>size="{{ activeSize() }}"</strong>. El panel se adapta al ancho
          configurado.
        </p>

        <div drawer-footer>
          <ngx-ds-button color="primary" (click)="open.set(false)">Cerrar</ngx-ds-button>
        </div>
      </ngx-ds-drawer>
    </div>
  `,
})
class SizesWrapper {
  readonly activeSize = signal<DrawerSize>('md');
  readonly open = signal(false);

  openWith(size: DrawerSize): void {
    this.activeSize.set(size);
    this.open.set(true);
  }
}

// ── No Close Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'drawer-no-close-wrapper',
  standalone: true,
  imports: [DrawerComponent, ButtonComponent],
  template: `
    <div class="p-6">
      <ngx-ds-button (click)="open.set(true)">Abrir drawer sin X</ngx-ds-button>

      <ngx-ds-drawer
        [(open)]="open"
        title="Acción requerida"
        [showClose]="false"
        [closeOnBackdrop]="false"
        [closeOnEscape]="false"
      >
        <p>
          Este drawer requiere que el usuario tome una acción explícita. No se puede cerrar haciendo
          clic fuera ni con Escape.
        </p>

        <div drawer-footer>
          <ngx-ds-button variant="outline" color="secondary" (click)="open.set(false)">
            Cancelar
          </ngx-ds-button>
          <ngx-ds-button color="primary" (click)="open.set(false)"> Confirmar </ngx-ds-button>
        </div>
      </ngx-ds-drawer>
    </div>
  `,
})
class NoCloseWrapper {
  readonly open = signal(false);
}

// ── Settings Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'drawer-settings-wrapper',
  standalone: true,
  imports: [DrawerComponent, ButtonComponent],
  template: `
    <div class="p-6">
      <ngx-ds-button [iconLeft]="iconSettings" (click)="open.set(true)">
        Configuración
      </ngx-ds-button>

      <ngx-ds-drawer [(open)]="open" side="right" size="lg" title="Configuración de la cuenta">
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <section>
            <h3 style="font-size: 0.875rem; font-weight: 600; color: #111827; margin: 0 0 0.5rem">
              General
            </h3>
            <p>Nombre de la organización, zona horaria e idioma predeterminado.</p>
          </section>
          <hr style="border: none; border-top: 1px solid #e5e7eb;" />
          <section>
            <h3 style="font-size: 0.875rem; font-weight: 600; color: #111827; margin: 0 0 0.5rem">
              Notificaciones
            </h3>
            <p>Frecuencia de alertas por correo y canales de comunicación.</p>
          </section>
          <hr style="border: none; border-top: 1px solid #e5e7eb;" />
          <section>
            <h3 style="font-size: 0.875rem; font-weight: 600; color: #111827; margin: 0 0 0.5rem">
              Privacidad
            </h3>
            <p>Control de datos compartidos con integraciones externas.</p>
          </section>
        </div>

        <div drawer-footer>
          <ngx-ds-button variant="outline" color="secondary" (click)="open.set(false)">
            Descartar
          </ngx-ds-button>
          <ngx-ds-button color="primary" (click)="open.set(false)"> Guardar cambios </ngx-ds-button>
        </div>
      </ngx-ds-drawer>
    </div>
  `,
})
class SettingsWrapper {
  readonly open = signal(false);
  readonly iconSettings = Settings;
}

// ── Loading Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'drawer-loading-wrapper',
  standalone: true,
  imports: [DrawerComponent, ButtonComponent],
  template: `
    <div class="p-6">
      <ngx-ds-button [iconLeft]="iconDownload" (click)="open.set(true)">
        Exportar datos
      </ngx-ds-button>

      <ngx-ds-drawer [(open)]="open" title="Exportar registros">
        <p>Se exportarán todos los registros del período seleccionado en formato CSV.</p>
        <p style="margin-top: 0.75rem">
          Esta operación puede tardar unos segundos dependiendo del volumen de datos.
        </p>

        <div drawer-footer>
          <ngx-ds-button
            variant="outline"
            color="secondary"
            [disabled]="loading()"
            (click)="open.set(false)"
          >
            Cancelar
          </ngx-ds-button>
          <ngx-ds-button
            color="primary"
            [iconLeft]="iconDownload"
            [loading]="loading()"
            (click)="exportData()"
          >
            Exportar
          </ngx-ds-button>
        </div>
      </ngx-ds-drawer>
    </div>
  `,
})
class LoadingWrapper {
  readonly open = signal(false);
  readonly loading = signal(false);
  readonly iconDownload = Download;

  exportData(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.open.set(false);
    }, 2000);
  }
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Organisms/Drawer',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<drawer-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};

export const Sides: Story = {
  render: () => ({
    template: `<drawer-sides-wrapper />`,
    moduleMetadata: { imports: [SidesWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<drawer-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const NoCloseButton: Story = {
  render: () => ({
    template: `<drawer-no-close-wrapper />`,
    moduleMetadata: { imports: [NoCloseWrapper] },
  }),
};

export const SettingsPanel: Story = {
  render: () => ({
    template: `<drawer-settings-wrapper />`,
    moduleMetadata: { imports: [SettingsWrapper] },
  }),
};

export const WithLoadingAction: Story = {
  render: () => ({
    template: `<drawer-loading-wrapper />`,
    moduleMetadata: { imports: [LoadingWrapper] },
  }),
};
