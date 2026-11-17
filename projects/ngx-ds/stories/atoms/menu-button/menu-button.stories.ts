import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  MenuButtonComponent,
  MenuButtonColor,
  MenuButtonSize,
} from '../../../src/lib/atoms/menu-button/menu-button.component';
import {
  Pencil,
  Trash2,
  Eye,
  Copy,
  Download,
  ArrowRight,
  LogOut,
  Settings2,
  Star,
} from 'lucide-angular';

// ── Colors Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'menu-btn-colors-wrapper',
  standalone: true,
  imports: [MenuButtonComponent],
  template: `
    <div class="p-6 space-y-2">
      <p class="text-sm text-gray-500 mb-4">Todos los colores</p>
      <ngx-ds-menu-button color="default">Default</ngx-ds-menu-button>
      <ngx-ds-menu-button color="primary">Primary</ngx-ds-menu-button>
      <ngx-ds-menu-button color="danger">Danger</ngx-ds-menu-button>
      <ngx-ds-menu-button color="success">Success</ngx-ds-menu-button>
      <ngx-ds-menu-button color="warning">Warning</ngx-ds-menu-button>
    </div>
  `,
})
class ColorsWrapper {}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'menu-btn-sizes-wrapper',
  standalone: true,
  imports: [MenuButtonComponent],
  template: `
    <div class="p-6 space-y-2">
      <p class="text-sm text-gray-500 mb-4">Tamaños</p>
      <ngx-ds-menu-button size="sm" [iconLeft]="iconEdit">Small</ngx-ds-menu-button>
      <ngx-ds-menu-button size="md" [iconLeft]="iconEdit">Medium</ngx-ds-menu-button>
      <ngx-ds-menu-button size="lg" [iconLeft]="iconEdit">Large</ngx-ds-menu-button>
    </div>
  `,
})
class SizesWrapper {
  readonly iconEdit = Pencil;
}

// ── Icons Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'menu-btn-icons-wrapper',
  standalone: true,
  imports: [MenuButtonComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Icono a la izquierda</p>
        <div class="space-y-1">
          <ngx-ds-menu-button [iconLeft]="iconEdit">Editar</ngx-ds-menu-button>
          <ngx-ds-menu-button color="danger" [iconLeft]="iconTrash">Eliminar</ngx-ds-menu-button>
          <ngx-ds-menu-button color="primary" [iconLeft]="iconEye">Ver detalle</ngx-ds-menu-button>
          <ngx-ds-menu-button color="success" [iconLeft]="iconCopy">Duplicar</ngx-ds-menu-button>
          <ngx-ds-menu-button color="warning" [iconLeft]="iconDownload"
            >Descargar</ngx-ds-menu-button
          >
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Icono a la derecha</p>
        <div class="space-y-1">
          <ngx-ds-menu-button [iconRight]="iconArrow">Ver más</ngx-ds-menu-button>
          <ngx-ds-menu-button color="primary" [iconRight]="iconArrow"
            >Ir al detalle</ngx-ds-menu-button
          >
          <ngx-ds-menu-button color="danger" [iconRight]="iconLogOut"
            >Cerrar sesión</ngx-ds-menu-button
          >
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Ambos iconos</p>
        <div class="space-y-1">
          <ngx-ds-menu-button [iconLeft]="iconSettings" [iconRight]="iconArrow"
            >Configurar y continuar</ngx-ds-menu-button
          >
          <ngx-ds-menu-button color="danger" [iconLeft]="iconTrash" [iconRight]="iconArrow"
            >Borrar y salir</ngx-ds-menu-button
          >
        </div>
      </div>
    </div>
  `,
})
class IconsWrapper {
  readonly iconEdit = Pencil;
  readonly iconTrash = Trash2;
  readonly iconEye = Eye;
  readonly iconCopy = Copy;
  readonly iconDownload = Download;
  readonly iconArrow = ArrowRight;
  readonly iconLogOut = LogOut;
  readonly iconSettings = Settings2;
}

// ── Full Width Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'menu-btn-full-width-wrapper',
  standalone: true,
  imports: [MenuButtonComponent],
  template: `
    <div class="p-6">
      <p class="text-sm text-gray-500 mb-4">fullWidth — uso típico en paneles desplegables</p>
      <div
        style="width: 180px; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.25rem; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 4px 16px rgba(0,0,0,.08);"
      >
        <ngx-ds-menu-button [fullWidth]="true" [iconLeft]="iconEdit">Editar</ngx-ds-menu-button>
        <ngx-ds-menu-button [fullWidth]="true" color="primary" [iconLeft]="iconEye"
          >Ver detalle</ngx-ds-menu-button
        >
        <ngx-ds-menu-button [fullWidth]="true" color="success" [iconLeft]="iconCopy"
          >Duplicar</ngx-ds-menu-button
        >
        <ngx-ds-menu-button [fullWidth]="true" color="warning" [iconLeft]="iconDownload"
          >Descargar</ngx-ds-menu-button
        >
        <ngx-ds-menu-button [fullWidth]="true" color="danger" [iconLeft]="iconTrash"
          >Eliminar</ngx-ds-menu-button
        >
      </div>
    </div>
  `,
})
class FullWidthWrapper {
  readonly iconEdit = Pencil;
  readonly iconEye = Eye;
  readonly iconCopy = Copy;
  readonly iconDownload = Download;
  readonly iconTrash = Trash2;
}

// ── Disabled Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'menu-btn-disabled-wrapper',
  standalone: true,
  imports: [MenuButtonComponent],
  template: `
    <div class="p-6 space-y-2">
      <p class="text-sm text-gray-500 mb-4">Estado deshabilitado</p>
      <ngx-ds-menu-button [disabled]="true" [iconLeft]="iconEdit"
        >Editar (deshabilitado)</ngx-ds-menu-button
      >
      <ngx-ds-menu-button color="danger" [disabled]="true" [iconLeft]="iconTrash"
        >Eliminar (deshabilitado)</ngx-ds-menu-button
      >
      <ngx-ds-menu-button color="primary" [disabled]="true" [iconLeft]="iconEye"
        >Ver detalle (deshabilitado)</ngx-ds-menu-button
      >
    </div>
  `,
})
class DisabledWrapper {
  readonly iconEdit = Pencil;
  readonly iconTrash = Trash2;
  readonly iconEye = Eye;
}

// ── All Colors Full Width Wrapper ─────────────────────────────────────────────

@Component({
  selector: 'menu-btn-panel-wrapper',
  standalone: true,
  imports: [MenuButtonComponent],
  template: `
    <div class="p-6 flex gap-6 flex-wrap">
      <div>
        <p class="text-sm text-gray-500 mb-3">Sin fullWidth</p>
        <div class="space-y-1">
          <ngx-ds-menu-button [iconLeft]="iconStar" color="default">Default</ngx-ds-menu-button>
          <ngx-ds-menu-button [iconLeft]="iconStar" color="primary">Primary</ngx-ds-menu-button>
          <ngx-ds-menu-button [iconLeft]="iconStar" color="danger">Danger</ngx-ds-menu-button>
          <ngx-ds-menu-button [iconLeft]="iconStar" color="success">Success</ngx-ds-menu-button>
          <ngx-ds-menu-button [iconLeft]="iconStar" color="warning">Warning</ngx-ds-menu-button>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Con fullWidth (200px contenedor)</p>
        <div style="width: 200px; display: flex; flex-direction: column; gap: 2px;">
          <ngx-ds-menu-button [fullWidth]="true" [iconLeft]="iconStar" color="default"
            >Default</ngx-ds-menu-button
          >
          <ngx-ds-menu-button [fullWidth]="true" [iconLeft]="iconStar" color="primary"
            >Primary</ngx-ds-menu-button
          >
          <ngx-ds-menu-button [fullWidth]="true" [iconLeft]="iconStar" color="danger"
            >Danger</ngx-ds-menu-button
          >
          <ngx-ds-menu-button [fullWidth]="true" [iconLeft]="iconStar" color="success"
            >Success</ngx-ds-menu-button
          >
          <ngx-ds-menu-button [fullWidth]="true" [iconLeft]="iconStar" color="warning"
            >Warning</ngx-ds-menu-button
          >
        </div>
      </div>
    </div>
  `,
})
class PanelWrapper {
  readonly iconStar = Star;
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Atoms/MenuButton',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    color: 'default' as MenuButtonColor,
    size: 'md' as MenuButtonSize,
    disabled: false,
    fullWidth: false,
    label: 'Editar registro',
  },
  argTypes: {
    color: { control: 'select', options: ['default', 'primary', 'danger', 'success', 'warning'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 1.5rem;">
        <ngx-ds-menu-button
          [color]="color"
          [size]="size"
          [disabled]="disabled"
          [fullWidth]="fullWidth"
        >{{ label }}</ngx-ds-menu-button>
      </div>
    `,
    moduleMetadata: { imports: [MenuButtonComponent] },
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `<menu-btn-colors-wrapper />`,
    moduleMetadata: { imports: [ColorsWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<menu-btn-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const WithIcons: Story = {
  render: () => ({
    template: `<menu-btn-icons-wrapper />`,
    moduleMetadata: { imports: [IconsWrapper] },
  }),
};

export const FullWidth: Story = {
  render: () => ({
    template: `<menu-btn-full-width-wrapper />`,
    moduleMetadata: { imports: [FullWidthWrapper] },
  }),
};

export const AllColorsComparison: Story = {
  render: () => ({
    template: `<menu-btn-panel-wrapper />`,
    moduleMetadata: { imports: [PanelWrapper] },
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<menu-btn-disabled-wrapper />`,
    moduleMetadata: { imports: [DisabledWrapper] },
  }),
};
