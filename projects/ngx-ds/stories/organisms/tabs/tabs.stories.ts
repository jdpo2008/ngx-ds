import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  TabsComponent,
  TabComponent,
  TabContentDirective,
  TabsVariant,
  TabsSize,
} from '../../../src/lib/organisms/tabs';
import { User, Settings, Bell, Shield, FileText, BarChart2 } from 'lucide-angular';

// ── Variants Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'tabs-variants-wrapper',
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: `
    <div class="p-6 space-y-10">
      <div>
        <p class="text-sm text-gray-500 mb-3">Line (default)</p>
        <ngx-ds-tabs variant="line">
          <ngx-ds-tab label="Cuenta">
            <p>Gestiona la información de tu cuenta y preferencias de inicio de sesión.</p>
          </ngx-ds-tab>
          <ngx-ds-tab label="Perfil">
            <p>Actualiza tu foto de perfil, nombre y datos personales.</p>
          </ngx-ds-tab>
          <ngx-ds-tab label="Notificaciones">
            <p>Configura qué notificaciones quieres recibir y cómo.</p>
          </ngx-ds-tab>
        </ngx-ds-tabs>
      </div>

      <div>
        <p class="text-sm text-gray-500 mb-3">Pill</p>
        <ngx-ds-tabs variant="pill">
          <ngx-ds-tab label="Resumen">
            <p>Vista general de tu actividad reciente y métricas clave.</p>
          </ngx-ds-tab>
          <ngx-ds-tab label="Detalle">
            <p>Análisis detallado de cada métrica y sus tendencias.</p>
          </ngx-ds-tab>
          <ngx-ds-tab label="Exportar">
            <p>Descarga tus datos en formato CSV, Excel o PDF.</p>
          </ngx-ds-tab>
        </ngx-ds-tabs>
      </div>

      <div>
        <p class="text-sm text-gray-500 mb-3">Enclosed</p>
        <ngx-ds-tabs variant="enclosed">
          <ngx-ds-tab label="General">
            <p>Configuración general de la aplicación.</p>
          </ngx-ds-tab>
          <ngx-ds-tab label="Seguridad">
            <p>Opciones de seguridad, 2FA y acceso.</p>
          </ngx-ds-tab>
          <ngx-ds-tab label="Integraciones">
            <p>Conecta servicios externos y APIs de terceros.</p>
          </ngx-ds-tab>
        </ngx-ds-tabs>
      </div>
    </div>
  `,
})
class VariantsWrapper {}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'tabs-sizes-wrapper',
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: `
    <div class="p-6 space-y-10">
      <div>
        <p class="text-sm text-gray-500 mb-3">Small</p>
        <ngx-ds-tabs size="sm">
          <ngx-ds-tab label="Pestaña uno">Contenido de la primera pestaña.</ngx-ds-tab>
          <ngx-ds-tab label="Pestaña dos">Contenido de la segunda pestaña.</ngx-ds-tab>
          <ngx-ds-tab label="Pestaña tres">Contenido de la tercera pestaña.</ngx-ds-tab>
        </ngx-ds-tabs>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Medium (default)</p>
        <ngx-ds-tabs size="md">
          <ngx-ds-tab label="Pestaña uno">Contenido de la primera pestaña.</ngx-ds-tab>
          <ngx-ds-tab label="Pestaña dos">Contenido de la segunda pestaña.</ngx-ds-tab>
          <ngx-ds-tab label="Pestaña tres">Contenido de la tercera pestaña.</ngx-ds-tab>
        </ngx-ds-tabs>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Large</p>
        <ngx-ds-tabs size="lg">
          <ngx-ds-tab label="Pestaña uno">Contenido de la primera pestaña.</ngx-ds-tab>
          <ngx-ds-tab label="Pestaña dos">Contenido de la segunda pestaña.</ngx-ds-tab>
          <ngx-ds-tab label="Pestaña tres">Contenido de la tercera pestaña.</ngx-ds-tab>
        </ngx-ds-tabs>
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── Icons Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'tabs-icons-wrapper',
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: `
    <div class="p-6 space-y-10">
      <div>
        <p class="text-sm text-gray-500 mb-3">Line con iconos</p>
        <ngx-ds-tabs variant="line">
          <ngx-ds-tab label="Perfil" [icon]="iconUser">
            <p>Actualiza tu foto de perfil, nombre y datos personales.</p>
          </ngx-ds-tab>
          <ngx-ds-tab label="Configuración" [icon]="iconSettings">
            <p>Ajusta las preferencias generales de tu cuenta.</p>
          </ngx-ds-tab>
          <ngx-ds-tab label="Notificaciones" [icon]="iconBell">
            <p>Controla qué notificaciones recibes y cuándo.</p>
          </ngx-ds-tab>
          <ngx-ds-tab label="Seguridad" [icon]="iconShield">
            <p>Gestiona contraseñas, 2FA y sesiones activas.</p>
          </ngx-ds-tab>
        </ngx-ds-tabs>
      </div>

      <div>
        <p class="text-sm text-gray-500 mb-3">Pill con iconos</p>
        <ngx-ds-tabs variant="pill">
          <ngx-ds-tab label="Documentos" [icon]="iconFile">
            <p>Accede a todos tus documentos y archivos adjuntos.</p>
          </ngx-ds-tab>
          <ngx-ds-tab label="Estadísticas" [icon]="iconChart">
            <p>Analiza el rendimiento y uso de la plataforma.</p>
          </ngx-ds-tab>
        </ngx-ds-tabs>
      </div>
    </div>
  `,
})
class IconsWrapper {
  readonly iconUser = User;
  readonly iconSettings = Settings;
  readonly iconBell = Bell;
  readonly iconShield = Shield;
  readonly iconFile = FileText;
  readonly iconChart = BarChart2;
}

// ── Disabled Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'tabs-disabled-wrapper',
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: `
    <div class="p-6">
      <p class="text-sm text-gray-500 mb-3">Tab deshabilitada (Seguridad)</p>
      <ngx-ds-tabs>
        <ngx-ds-tab label="General">
          <p>Configuración general de la aplicación.</p>
        </ngx-ds-tab>
        <ngx-ds-tab label="Perfil">
          <p>Información de tu perfil público.</p>
        </ngx-ds-tab>
        <ngx-ds-tab label="Seguridad" [disabled]="true">
          <p>Esta pestaña está deshabilitada.</p>
        </ngx-ds-tab>
        <ngx-ds-tab label="Integraciones">
          <p>Servicios conectados a tu cuenta.</p>
        </ngx-ds-tab>
      </ngx-ds-tabs>
    </div>
  `,
})
class DisabledWrapper {}

// ── Full Width Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'tabs-full-width-wrapper',
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: `
    <div class="p-6 space-y-10">
      <div>
        <p class="text-sm text-gray-500 mb-3">Line — ancho completo</p>
        <ngx-ds-tabs variant="line" [fullWidth]="true">
          <ngx-ds-tab label="Diario">Resumen del día de hoy.</ngx-ds-tab>
          <ngx-ds-tab label="Semanal">Resumen de la semana en curso.</ngx-ds-tab>
          <ngx-ds-tab label="Mensual">Resumen del mes actual.</ngx-ds-tab>
        </ngx-ds-tabs>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Pill — ancho completo</p>
        <ngx-ds-tabs variant="pill" [fullWidth]="true">
          <ngx-ds-tab label="Diario">Resumen del día de hoy.</ngx-ds-tab>
          <ngx-ds-tab label="Semanal">Resumen de la semana en curso.</ngx-ds-tab>
          <ngx-ds-tab label="Mensual">Resumen del mes actual.</ngx-ds-tab>
        </ngx-ds-tabs>
      </div>
    </div>
  `,
})
class FullWidthWrapper {}

// ── Lazy Tabs Wrapper ─────────────────────────────────────────────────────────

@Component({
  selector: 'lazy-tab-child-a',
  standalone: true,
  template: `<p>Panel A instanciado — revisa la consola para ver cuándo se creó.</p>`,
})
class LazyChildA {
  constructor() {
    console.log('[LazyTabs] Panel A instanciado');
  }
}

@Component({
  selector: 'lazy-tab-child-b',
  standalone: true,
  template: `<p>Panel B instanciado — revisa la consola para ver cuándo se creó.</p>`,
})
class LazyChildB {
  constructor() {
    console.log('[LazyTabs] Panel B instanciado');
  }
}

@Component({
  selector: 'lazy-tab-child-c',
  standalone: true,
  template: `<p>Panel C instanciado — revisa la consola para ver cuándo se creó.</p>`,
})
class LazyChildC {
  constructor() {
    console.log('[LazyTabs] Panel C instanciado');
  }
}

@Component({
  selector: 'tabs-lazy-wrapper',
  standalone: true,
  imports: [TabsComponent, TabComponent, TabContentDirective, LazyChildA, LazyChildB, LazyChildC],
  template: `
    <div class="p-6">
      <p class="text-sm text-gray-500 mb-3">
        Cada panel se instancia solo la primera vez que se activa su pestaña (abre la consola del
        navegador).
      </p>
      <ngx-ds-tabs variant="line">
        <ngx-ds-tab label="Panel A" [lazy]="true">
          <ng-template ngxDsTabContent>
            <lazy-tab-child-a />
          </ng-template>
        </ngx-ds-tab>
        <ngx-ds-tab label="Panel B" [lazy]="true">
          <ng-template ngxDsTabContent>
            <lazy-tab-child-b />
          </ng-template>
        </ngx-ds-tab>
        <ngx-ds-tab label="Panel C" [lazy]="true">
          <ng-template ngxDsTabContent>
            <lazy-tab-child-c />
          </ng-template>
        </ngx-ds-tab>
      </ngx-ds-tabs>
    </div>
  `,
})
class LazyTabsWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Organisms/Tabs',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'line' as TabsVariant,
    size: 'md' as TabsSize,
    fullWidth: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['line', 'pill', 'enclosed'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 1.5rem;">
        <ngx-ds-tabs [variant]="variant" [size]="size" [fullWidth]="fullWidth">
          <ngx-ds-tab label="Cuenta">Gestiona la información de tu cuenta.</ngx-ds-tab>
          <ngx-ds-tab label="Perfil">Actualiza tus datos personales.</ngx-ds-tab>
          <ngx-ds-tab label="Notificaciones">Configura tus notificaciones.</ngx-ds-tab>
        </ngx-ds-tabs>
      </div>
    `,
    moduleMetadata: { imports: [TabsComponent, TabComponent] },
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `<tabs-variants-wrapper />`,
    moduleMetadata: { imports: [VariantsWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<tabs-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const WithIcons: Story = {
  render: () => ({
    template: `<tabs-icons-wrapper />`,
    moduleMetadata: { imports: [IconsWrapper] },
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<tabs-disabled-wrapper />`,
    moduleMetadata: { imports: [DisabledWrapper] },
  }),
};

export const FullWidth: Story = {
  render: () => ({
    template: `<tabs-full-width-wrapper />`,
    moduleMetadata: { imports: [FullWidthWrapper] },
  }),
};

export const Lazy: Story = {
  render: () => ({
    template: `<tabs-lazy-wrapper />`,
    moduleMetadata: { imports: [LazyTabsWrapper] },
  }),
};
