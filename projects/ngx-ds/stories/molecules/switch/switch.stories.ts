import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { SwitchComponent } from '../../../src/lib/molecules/switch/switch.component';

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'sw-default-wrapper',
  standalone: true,
  imports: [SwitchComponent],
  template: `
    <div class="p-6 space-y-3">
      <ngx-ds-switch label="Notificaciones" [(checked)]="notifications" />
      <ngx-ds-switch label="Modo oscuro" [(checked)]="darkMode" />
      <ngx-ds-switch label="Deshabilitado" />
    </div>
  `,
})
class DefaultWrapper {
  notifications = signal(true);
  darkMode = signal(false);
}

// ── Colors Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'sw-colors-wrapper',
  standalone: true,
  imports: [SwitchComponent],
  template: `
    <div class="p-6 space-y-3">
      <ngx-ds-switch label="Primary" color="primary" [checked]="true" />
      <ngx-ds-switch label="Secondary" color="secondary" [checked]="true" />
      <ngx-ds-switch label="Danger" color="danger" [checked]="true" />
      <ngx-ds-switch label="Success" color="success" [checked]="true" />
      <ngx-ds-switch label="Warning" color="warning" [checked]="true" />
    </div>
  `,
})
class ColorsWrapper {}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'sw-sizes-wrapper',
  standalone: true,
  imports: [SwitchComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Activado</p>
        <div class="flex items-center gap-6">
          <ngx-ds-switch label="Small" size="sm" [checked]="true" />
          <ngx-ds-switch label="Medium" size="md" [checked]="true" />
          <ngx-ds-switch label="Large" size="lg" [checked]="true" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Desactivado</p>
        <div class="flex items-center gap-6">
          <ngx-ds-switch label="Small" size="sm" />
          <ngx-ds-switch label="Medium" size="md" />
          <ngx-ds-switch label="Large" size="lg" />
        </div>
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── Label Position Wrapper ────────────────────────────────────────────────────

@Component({
  selector: 'sw-label-pos-wrapper',
  standalone: true,
  imports: [SwitchComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Etiqueta a la derecha (por defecto)</p>
        <div class="space-y-2">
          <ngx-ds-switch label="Activar alertas" labelPosition="right" [checked]="true" />
          <ngx-ds-switch label="Modo silencioso" labelPosition="right" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Etiqueta a la izquierda</p>
        <div class="space-y-2">
          <ngx-ds-switch label="Activar alertas" labelPosition="left" [checked]="true" />
          <ngx-ds-switch label="Modo silencioso" labelPosition="left" />
        </div>
      </div>
    </div>
  `,
})
class LabelPositionWrapper {}

// ── State Labels Wrapper ──────────────────────────────────────────────────────

@Component({
  selector: 'sw-state-labels-wrapper',
  standalone: true,
  imports: [SwitchComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-3">Con etiquetas de estado (labelOn / labelOff)</p>
      <ngx-ds-switch
        label="Disponibilidad"
        labelOn="Activo"
        labelOff="Inactivo"
        [(checked)]="available"
      />
      <ngx-ds-switch
        label="Publicar artículo"
        labelOn="Publicado"
        labelOff="Borrador"
        color="success"
        [(checked)]="published"
      />
      <ngx-ds-switch
        label="Mantenimiento"
        labelOn="En mantenimiento"
        labelOff="Operativo"
        color="warning"
        [(checked)]="maintenance"
      />
    </div>
  `,
})
class StateLabelsWrapper {
  available = signal(true);
  published = signal(false);
  maintenance = signal(false);
}

// ── Interactive Wrapper ───────────────────────────────────────────────────────

@Component({
  selector: 'sw-interactive-wrapper',
  standalone: true,
  imports: [SwitchComponent],
  template: `
    <div class="p-6 space-y-6">
      <p class="text-sm text-gray-500 mb-3">Preferencias de notificaciones</p>
      <div class="space-y-4 divide-y divide-gray-100">
        @for (pref of preferences; track pref.key) {
          <div class="flex items-center justify-between pt-3">
            <div>
              <p class="text-sm font-medium text-gray-800">{{ pref.label }}</p>
              <p class="text-xs text-gray-500">{{ pref.description }}</p>
            </div>
            <ngx-ds-switch [(checked)]="pref.enabled" [color]="pref.color" />
          </div>
        }
      </div>
    </div>
  `,
})
class InteractiveWrapper {
  preferences = [
    {
      key: 'email',
      label: 'Correo electrónico',
      description: 'Recibe resúmenes semanales por email',
      enabled: signal(true),
      color: 'primary' as const,
    },
    {
      key: 'push',
      label: 'Notificaciones push',
      description: 'Alertas en tiempo real en tu dispositivo',
      enabled: signal(true),
      color: 'success' as const,
    },
    {
      key: 'sms',
      label: 'SMS',
      description: 'Solo alertas críticas por mensaje de texto',
      enabled: signal(false),
      color: 'warning' as const,
    },
    {
      key: 'marketing',
      label: 'Comunicaciones de marketing',
      description: 'Ofertas, novedades y contenido exclusivo',
      enabled: signal(false),
      color: 'secondary' as const,
    },
  ];
}

// ── States Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'sw-states-wrapper',
  standalone: true,
  imports: [SwitchComponent],
  template: `
    <div class="p-6 space-y-3">
      <p class="text-sm text-gray-500 mb-2">Estados</p>
      <ngx-ds-switch label="Desactivado (normal)" />
      <ngx-ds-switch label="Activado" [checked]="true" />
      <ngx-ds-switch label="Desactivado — deshabilitado" />
      <ngx-ds-switch label="Activado — deshabilitado" [checked]="true" />
    </div>
  `,
})
class StatesWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/Switch',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<sw-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `<sw-colors-wrapper />`,
    moduleMetadata: { imports: [ColorsWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<sw-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const LabelPosition: Story = {
  render: () => ({
    template: `<sw-label-pos-wrapper />`,
    moduleMetadata: { imports: [LabelPositionWrapper] },
  }),
};

export const StateLabels: Story = {
  render: () => ({
    template: `<sw-state-labels-wrapper />`,
    moduleMetadata: { imports: [StateLabelsWrapper] },
  }),
};

export const Interactive: Story = {
  render: () => ({
    template: `<sw-interactive-wrapper />`,
    moduleMetadata: { imports: [InteractiveWrapper] },
  }),
};

export const States: Story = {
  render: () => ({
    template: `<sw-states-wrapper />`,
    moduleMetadata: { imports: [StatesWrapper] },
  }),
};
