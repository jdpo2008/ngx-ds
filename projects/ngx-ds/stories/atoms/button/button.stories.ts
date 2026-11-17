import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  ButtonComponent,
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from '../../../src/lib/atoms/button/button.component';
import { Plus, Trash2, Check, ArrowRight, Download, Send } from 'lucide-angular';

// ── Variants Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'btn-variants-wrapper',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Solid</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-button variant="solid" color="primary">Primary</ngx-ds-button>
          <ngx-ds-button variant="solid" color="secondary">Secondary</ngx-ds-button>
          <ngx-ds-button variant="solid" color="danger">Danger</ngx-ds-button>
          <ngx-ds-button variant="solid" color="success">Success</ngx-ds-button>
          <ngx-ds-button variant="solid" color="warning">Warning</ngx-ds-button>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Outline</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-button variant="outline" color="primary">Primary</ngx-ds-button>
          <ngx-ds-button variant="outline" color="secondary">Secondary</ngx-ds-button>
          <ngx-ds-button variant="outline" color="danger">Danger</ngx-ds-button>
          <ngx-ds-button variant="outline" color="success">Success</ngx-ds-button>
          <ngx-ds-button variant="outline" color="warning">Warning</ngx-ds-button>
        </div>
      </div>
    </div>
  `,
})
class VariantsWrapper {}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'btn-sizes-wrapper',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Solid</p>
        <div class="flex flex-wrap items-center gap-3">
          <ngx-ds-button variant="solid" color="primary" size="sm">Small</ngx-ds-button>
          <ngx-ds-button variant="solid" color="primary" size="md">Medium</ngx-ds-button>
          <ngx-ds-button variant="solid" color="primary" size="lg">Large</ngx-ds-button>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Outline</p>
        <div class="flex flex-wrap items-center gap-3">
          <ngx-ds-button variant="outline" color="primary" size="sm">Small</ngx-ds-button>
          <ngx-ds-button variant="outline" color="primary" size="md">Medium</ngx-ds-button>
          <ngx-ds-button variant="outline" color="primary" size="lg">Large</ngx-ds-button>
        </div>
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── Icons Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'btn-icons-wrapper',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Icon a la izquierda</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-button variant="solid" color="primary" [iconLeft]="iconPlus"
            >Agregar</ngx-ds-button
          >
          <ngx-ds-button variant="outline" color="danger" [iconLeft]="iconTrash"
            >Eliminar</ngx-ds-button
          >
          <ngx-ds-button variant="solid" color="success" [iconLeft]="iconCheck"
            >Confirmar</ngx-ds-button
          >
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Icon a la derecha</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-button variant="solid" color="primary" [iconRight]="iconArrow"
            >Continuar</ngx-ds-button
          >
          <ngx-ds-button variant="outline" color="secondary" [iconRight]="iconDownload"
            >Descargar</ngx-ds-button
          >
          <ngx-ds-button variant="solid" color="warning" [iconRight]="iconSend"
            >Enviar</ngx-ds-button
          >
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Ambos iconos</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-button
            variant="solid"
            color="primary"
            [iconLeft]="iconPlus"
            [iconRight]="iconArrow"
          >
            Nuevo paso
          </ngx-ds-button>
          <ngx-ds-button
            variant="outline"
            color="danger"
            [iconLeft]="iconTrash"
            [iconRight]="iconArrow"
          >
            Borrar y continuar
          </ngx-ds-button>
        </div>
      </div>
    </div>
  `,
})
class IconsWrapper {
  readonly iconPlus = Plus;
  readonly iconTrash = Trash2;
  readonly iconCheck = Check;
  readonly iconArrow = ArrowRight;
  readonly iconDownload = Download;
  readonly iconSend = Send;
}

// ── Rounded Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'btn-rounded-wrapper',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Solid redondeado</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-button variant="solid" color="primary" [rounded]="true">Primary</ngx-ds-button>
          <ngx-ds-button variant="solid" color="secondary" [rounded]="true"
            >Secondary</ngx-ds-button
          >
          <ngx-ds-button variant="solid" color="danger" [rounded]="true">Danger</ngx-ds-button>
          <ngx-ds-button variant="solid" color="success" [rounded]="true">Success</ngx-ds-button>
          <ngx-ds-button variant="solid" color="warning" [rounded]="true">Warning</ngx-ds-button>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Outline redondeado</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-button variant="outline" color="primary" [rounded]="true">Primary</ngx-ds-button>
          <ngx-ds-button variant="outline" color="secondary" [rounded]="true"
            >Secondary</ngx-ds-button
          >
          <ngx-ds-button variant="outline" color="danger" [rounded]="true">Danger</ngx-ds-button>
          <ngx-ds-button variant="outline" color="success" [rounded]="true">Success</ngx-ds-button>
          <ngx-ds-button variant="outline" color="warning" [rounded]="true">Warning</ngx-ds-button>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Tamaños redondeados</p>
        <div class="flex flex-wrap items-center gap-3">
          <ngx-ds-button variant="solid" color="primary" size="sm" [rounded]="true"
            >Small</ngx-ds-button
          >
          <ngx-ds-button variant="solid" color="primary" size="md" [rounded]="true"
            >Medium</ngx-ds-button
          >
          <ngx-ds-button variant="solid" color="primary" size="lg" [rounded]="true"
            >Large</ngx-ds-button
          >
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Redondeado con iconos</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-button variant="solid" color="primary" [rounded]="true" [iconLeft]="iconPlus">
            Agregar
          </ngx-ds-button>
          <ngx-ds-button variant="outline" color="danger" [rounded]="true" [iconLeft]="iconTrash">
            Eliminar
          </ngx-ds-button>
          <ngx-ds-button variant="solid" color="success" [rounded]="true" [iconRight]="iconArrow">
            Continuar
          </ngx-ds-button>
          <ngx-ds-button
            variant="outline"
            color="secondary"
            [rounded]="true"
            [iconLeft]="iconDownload"
          >
            Descargar
          </ngx-ds-button>
        </div>
      </div>
    </div>
  `,
})
class RoundedWrapper {
  readonly iconPlus = Plus;
  readonly iconTrash = Trash2;
  readonly iconArrow = ArrowRight;
  readonly iconDownload = Download;
}

// ── Disabled Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'btn-disabled-wrapper',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-3">Estado deshabilitado</p>
      <div class="flex flex-wrap gap-3">
        <ngx-ds-button variant="solid" color="primary" [disabled]="true"
          >Solid deshabilitado</ngx-ds-button
        >
        <ngx-ds-button variant="outline" color="primary" [disabled]="true"
          >Outline deshabilitado</ngx-ds-button
        >
        <ngx-ds-button variant="solid" color="danger" [iconLeft]="iconTrash" [disabled]="true">
          Con icono
        </ngx-ds-button>
      </div>
    </div>
  `,
})
class DisabledWrapper {
  readonly iconTrash = Trash2;
}

// ── Loading Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'btn-loading-wrapper',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Estado loading — todos los tamaños</p>
        <div class="flex flex-wrap items-center gap-3">
          <ngx-ds-button variant="solid" color="primary" size="sm" [loading]="true"
            >Guardar</ngx-ds-button
          >
          <ngx-ds-button variant="solid" color="primary" size="md" [loading]="true"
            >Guardar</ngx-ds-button
          >
          <ngx-ds-button variant="solid" color="primary" size="lg" [loading]="true"
            >Guardar</ngx-ds-button
          >
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Loading con outline — todos los colores</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-button variant="outline" color="primary" [loading]="true">Enviando</ngx-ds-button>
          <ngx-ds-button variant="outline" color="secondary" [loading]="true"
            >Procesando</ngx-ds-button
          >
          <ngx-ds-button variant="outline" color="danger" [loading]="true"
            >Eliminando</ngx-ds-button
          >
          <ngx-ds-button variant="outline" color="success" [loading]="true"
            >Guardando</ngx-ds-button
          >
          <ngx-ds-button variant="outline" color="warning" [loading]="true"
            >Validando</ngx-ds-button
          >
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Loading con solid — todos los colores</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-button variant="solid" color="primary" [loading]="true">Enviando</ngx-ds-button>
          <ngx-ds-button variant="solid" color="secondary" [loading]="true"
            >Procesando</ngx-ds-button
          >
          <ngx-ds-button variant="solid" color="danger" [loading]="true">Eliminando</ngx-ds-button>
          <ngx-ds-button variant="solid" color="success" [loading]="true">Guardando</ngx-ds-button>
          <ngx-ds-button variant="solid" color="warning" [loading]="true">Validando</ngx-ds-button>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Reemplaza iconLeft cuando está activo</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-button
            variant="solid"
            color="primary"
            [iconLeft]="iconDownload"
            [loading]="false"
          >
            Normal con icono
          </ngx-ds-button>
          <ngx-ds-button variant="solid" color="primary" [iconLeft]="iconDownload" [loading]="true">
            Cargando con icono
          </ngx-ds-button>
        </div>
      </div>
    </div>
  `,
})
class LoadingWrapper {
  readonly iconDownload = Download;
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Atoms/Button',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'solid' as ButtonVariant,
    size: 'md' as ButtonSize,
    color: 'primary' as ButtonColor,
    disabled: false,
    rounded: false,
    loading: false,
    label: 'Botón',
  },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: { control: 'select', options: ['primary', 'secondary', 'danger', 'success', 'warning'] },
    disabled: { control: 'boolean' },
    rounded: { control: 'boolean' },
    loading: { control: 'boolean' },
    label: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 1.5rem;">
        <ngx-ds-button
          [variant]="variant"
          [size]="size"
          [color]="color"
          [disabled]="disabled"
          [rounded]="rounded"
          [loading]="loading"
        >{{ label }}</ngx-ds-button>
      </div>
    `,
    moduleMetadata: { imports: [ButtonComponent] },
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `<btn-variants-wrapper />`,
    moduleMetadata: { imports: [VariantsWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<btn-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const WithIcons: Story = {
  render: () => ({
    template: `<btn-icons-wrapper />`,
    moduleMetadata: { imports: [IconsWrapper] },
  }),
};

export const Rounded: Story = {
  render: () => ({
    template: `<btn-rounded-wrapper />`,
    moduleMetadata: { imports: [RoundedWrapper] },
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<btn-disabled-wrapper />`,
    moduleMetadata: { imports: [DisabledWrapper] },
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `<btn-loading-wrapper />`,
    moduleMetadata: { imports: [LoadingWrapper] },
  }),
};
