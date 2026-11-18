import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { IconButtonComponent } from '../../../src/lib/atoms/icon-button/icon-button.component';
import {
  ButtonVariant,
  ButtonColor,
  ButtonSize,
} from '../../../src/lib/atoms/button/button.component';
import { Plus, Trash2, Check, Pencil, Send, Search, Heart, Star, Settings2 } from 'lucide-angular';

// ── Variants Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'icon-btn-variants-wrapper',
  standalone: true,
  imports: [IconButtonComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Solid</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-icon-button
            variant="solid"
            color="primary"
            [icon]="iconEdit"
            ariaLabel="Editar"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="secondary"
            [icon]="iconSettings"
            ariaLabel="Configuración"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="danger"
            [icon]="iconTrash"
            ariaLabel="Eliminar"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="success"
            [icon]="iconCheck"
            ariaLabel="Confirmar"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="warning"
            [icon]="iconSend"
            ariaLabel="Enviar"
          />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Outline</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-icon-button
            variant="outline"
            color="primary"
            [icon]="iconEdit"
            ariaLabel="Editar"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="secondary"
            [icon]="iconSettings"
            ariaLabel="Configuración"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="danger"
            [icon]="iconTrash"
            ariaLabel="Eliminar"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="success"
            [icon]="iconCheck"
            ariaLabel="Confirmar"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="warning"
            [icon]="iconSend"
            ariaLabel="Enviar"
          />
        </div>
      </div>
    </div>
  `,
})
class VariantsWrapper {
  readonly iconEdit = Pencil;
  readonly iconSettings = Settings2;
  readonly iconTrash = Trash2;
  readonly iconCheck = Check;
  readonly iconSend = Send;
}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'icon-btn-sizes-wrapper',
  standalone: true,
  imports: [IconButtonComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Solid</p>
        <div class="flex flex-wrap items-center gap-3">
          <ngx-ds-icon-button
            variant="solid"
            color="primary"
            size="sm"
            [icon]="iconEdit"
            ariaLabel="Editar pequeño"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="primary"
            size="md"
            [icon]="iconEdit"
            ariaLabel="Editar mediano"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="primary"
            size="lg"
            [icon]="iconEdit"
            ariaLabel="Editar grande"
          />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Outline</p>
        <div class="flex flex-wrap items-center gap-3">
          <ngx-ds-icon-button
            variant="outline"
            color="primary"
            size="sm"
            [icon]="iconEdit"
            ariaLabel="Editar pequeño"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="primary"
            size="md"
            [icon]="iconEdit"
            ariaLabel="Editar mediano"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="primary"
            size="lg"
            [icon]="iconEdit"
            ariaLabel="Editar grande"
          />
        </div>
      </div>
    </div>
  `,
})
class SizesWrapper {
  readonly iconEdit = Pencil;
}

// ── Rounded Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'icon-btn-rounded-wrapper',
  standalone: true,
  imports: [IconButtonComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Solid circular</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-icon-button
            variant="solid"
            color="primary"
            [rounded]="true"
            [icon]="iconPlus"
            ariaLabel="Agregar"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="secondary"
            [rounded]="true"
            [icon]="iconSearch"
            ariaLabel="Buscar"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="danger"
            [rounded]="true"
            [icon]="iconTrash"
            ariaLabel="Eliminar"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="success"
            [rounded]="true"
            [icon]="iconCheck"
            ariaLabel="Confirmar"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="warning"
            [rounded]="true"
            [icon]="iconSend"
            ariaLabel="Enviar"
          />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Outline circular</p>
        <div class="flex flex-wrap gap-3">
          <ngx-ds-icon-button
            variant="outline"
            color="primary"
            [rounded]="true"
            [icon]="iconPlus"
            ariaLabel="Agregar"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="secondary"
            [rounded]="true"
            [icon]="iconSearch"
            ariaLabel="Buscar"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="danger"
            [rounded]="true"
            [icon]="iconTrash"
            ariaLabel="Eliminar"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="success"
            [rounded]="true"
            [icon]="iconCheck"
            ariaLabel="Confirmar"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="warning"
            [rounded]="true"
            [icon]="iconSend"
            ariaLabel="Enviar"
          />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Tamaños circulares</p>
        <div class="flex flex-wrap items-center gap-3">
          <ngx-ds-icon-button
            variant="solid"
            color="primary"
            size="sm"
            [rounded]="true"
            [icon]="iconHeart"
            ariaLabel="Me gusta pequeño"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="primary"
            size="md"
            [rounded]="true"
            [icon]="iconHeart"
            ariaLabel="Me gusta mediano"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="primary"
            size="lg"
            [rounded]="true"
            [icon]="iconHeart"
            ariaLabel="Me gusta grande"
          />
        </div>
      </div>
    </div>
  `,
})
class RoundedWrapper {
  readonly iconPlus = Plus;
  readonly iconSearch = Search;
  readonly iconTrash = Trash2;
  readonly iconCheck = Check;
  readonly iconSend = Send;
  readonly iconHeart = Heart;
}

// ── Colors Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'icon-btn-colors-wrapper',
  standalone: true,
  imports: [IconButtonComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-3">Todos los colores — Solid y Outline</p>
      <div class="grid gap-4">
        <div class="flex items-center gap-4">
          <span class="text-xs text-gray-500 w-20">Primary</span>
          <ngx-ds-icon-button
            variant="solid"
            color="primary"
            [icon]="iconStar"
            ariaLabel="Primary solid"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="primary"
            [icon]="iconStar"
            ariaLabel="Primary outline"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="primary"
            [rounded]="true"
            [icon]="iconStar"
            ariaLabel="Primary solid circular"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="primary"
            [rounded]="true"
            [icon]="iconStar"
            ariaLabel="Primary outline circular"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-xs text-gray-500 w-20">Secondary</span>
          <ngx-ds-icon-button
            variant="solid"
            color="secondary"
            [icon]="iconStar"
            ariaLabel="Secondary solid"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="secondary"
            [icon]="iconStar"
            ariaLabel="Secondary outline"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="secondary"
            [rounded]="true"
            [icon]="iconStar"
            ariaLabel="Secondary solid circular"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="secondary"
            [rounded]="true"
            [icon]="iconStar"
            ariaLabel="Secondary outline circular"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-xs text-gray-500 w-20">Danger</span>
          <ngx-ds-icon-button
            variant="solid"
            color="danger"
            [icon]="iconStar"
            ariaLabel="Danger solid"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="danger"
            [icon]="iconStar"
            ariaLabel="Danger outline"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="danger"
            [rounded]="true"
            [icon]="iconStar"
            ariaLabel="Danger solid circular"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="danger"
            [rounded]="true"
            [icon]="iconStar"
            ariaLabel="Danger outline circular"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-xs text-gray-500 w-20">Success</span>
          <ngx-ds-icon-button
            variant="solid"
            color="success"
            [icon]="iconStar"
            ariaLabel="Success solid"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="success"
            [icon]="iconStar"
            ariaLabel="Success outline"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="success"
            [rounded]="true"
            [icon]="iconStar"
            ariaLabel="Success solid circular"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="success"
            [rounded]="true"
            [icon]="iconStar"
            ariaLabel="Success outline circular"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-xs text-gray-500 w-20">Warning</span>
          <ngx-ds-icon-button
            variant="solid"
            color="warning"
            [icon]="iconStar"
            ariaLabel="Warning solid"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="warning"
            [icon]="iconStar"
            ariaLabel="Warning outline"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="warning"
            [rounded]="true"
            [icon]="iconStar"
            ariaLabel="Warning solid circular"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="warning"
            [rounded]="true"
            [icon]="iconStar"
            ariaLabel="Warning outline circular"
          />
        </div>
      </div>
    </div>
  `,
})
class ColorsWrapper {
  readonly iconStar = Star;
}

// ── Disabled Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'icon-btn-disabled-wrapper',
  standalone: true,
  imports: [IconButtonComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-3">Estado deshabilitado</p>
      <div class="flex flex-wrap items-center gap-3">
        <ngx-ds-icon-button
          variant="solid"
          color="primary"
          [disabled]="true"
          [icon]="iconEdit"
          ariaLabel="Editar"
        />
        <ngx-ds-icon-button
          variant="outline"
          color="primary"
          [disabled]="true"
          [icon]="iconEdit"
          ariaLabel="Editar"
        />
        <ngx-ds-icon-button
          variant="solid"
          color="danger"
          [disabled]="true"
          [icon]="iconTrash"
          ariaLabel="Eliminar"
        />
        <ngx-ds-icon-button
          variant="solid"
          color="primary"
          [rounded]="true"
          [disabled]="true"
          [icon]="iconPlus"
          ariaLabel="Agregar"
        />
        <ngx-ds-icon-button
          variant="outline"
          color="primary"
          [rounded]="true"
          [disabled]="true"
          [icon]="iconPlus"
          ariaLabel="Agregar"
        />
      </div>
    </div>
  `,
})
class DisabledWrapper {
  readonly iconEdit = Pencil;
  readonly iconTrash = Trash2;
  readonly iconPlus = Plus;
}

// ── Borderless Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'icon-btn-borderless-wrapper',
  standalone: true,
  imports: [IconButtonComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Con borde (bordered = true, por defecto)</p>
        <div class="flex flex-wrap items-center gap-3">
          <ngx-ds-icon-button
            variant="outline"
            color="primary"
            [icon]="iconEdit"
            ariaLabel="Editar"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="secondary"
            [icon]="iconSettings"
            ariaLabel="Config"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="danger"
            [icon]="iconTrash"
            ariaLabel="Eliminar"
          />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">
          Sin borde (bordered = false) — útil como trigger fantasma
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <ngx-ds-icon-button
            variant="outline"
            color="primary"
            [bordered]="false"
            [icon]="iconEdit"
            ariaLabel="Editar"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="secondary"
            [bordered]="false"
            [icon]="iconSettings"
            ariaLabel="Config"
          />
          <ngx-ds-icon-button
            variant="outline"
            color="danger"
            [bordered]="false"
            [icon]="iconTrash"
            ariaLabel="Eliminar"
          />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Solid sin borde</p>
        <div class="flex flex-wrap items-center gap-3">
          <ngx-ds-icon-button
            variant="solid"
            color="primary"
            [bordered]="false"
            [icon]="iconEdit"
            ariaLabel="Editar"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="secondary"
            [bordered]="false"
            [icon]="iconSettings"
            ariaLabel="Config"
          />
          <ngx-ds-icon-button
            variant="solid"
            color="danger"
            [bordered]="false"
            [icon]="iconTrash"
            ariaLabel="Eliminar"
          />
        </div>
      </div>
    </div>
  `,
})
class BorderlessWrapper {
  readonly iconEdit = Pencil;
  readonly iconSettings = Settings2;
  readonly iconTrash = Trash2;
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Atoms/IconButton',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'outline' as ButtonVariant,
    size: 'md' as ButtonSize,
    color: 'primary' as ButtonColor,
    disabled: false,
    rounded: false,
    bordered: true,
  },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'warning', 'info'],
    },
    disabled: { control: 'boolean' },
    rounded: { control: 'boolean' },
    bordered: { control: 'boolean' },
  },
  render: (args) => ({
    props: { ...args, icon: Pencil },
    template: `
      <div style="padding: 1.5rem; display: flex; gap: 0.75rem; align-items: center;">
        <ngx-ds-icon-button
          [variant]="variant"
          [size]="size"
          [color]="color"
          [disabled]="disabled"
          [rounded]="rounded"
          [bordered]="bordered"
          [icon]="icon"
          ariaLabel="Acción"
        />
      </div>
    `,
    moduleMetadata: { imports: [IconButtonComponent] },
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `<icon-btn-variants-wrapper />`,
    moduleMetadata: { imports: [VariantsWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<icon-btn-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const Rounded: Story = {
  render: () => ({
    template: `<icon-btn-rounded-wrapper />`,
    moduleMetadata: { imports: [RoundedWrapper] },
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `<icon-btn-colors-wrapper />`,
    moduleMetadata: { imports: [ColorsWrapper] },
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<icon-btn-disabled-wrapper />`,
    moduleMetadata: { imports: [DisabledWrapper] },
  }),
};

export const Borderless: Story = {
  render: () => ({
    template: `<icon-btn-borderless-wrapper />`,
    moduleMetadata: { imports: [BorderlessWrapper] },
  }),
};
