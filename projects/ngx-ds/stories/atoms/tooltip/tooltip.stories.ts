import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  TooltipDirective,
  TooltipPlacement,
} from '../../../src/lib/atoms/tooltip/tooltip.directive';
import { ButtonComponent } from '../../../src/lib/atoms/button/button.component';
import { IconButtonComponent } from '../../../src/lib/atoms/icon-button/icon-button.component';
import { Info, Trash2, Settings } from 'lucide-angular';

// ── Placements Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'tooltip-placements-wrapper',
  standalone: true,
  imports: [TooltipDirective, ButtonComponent],
  template: `
    <div
      class="p-10"
      style="display:flex; align-items:center; justify-content:center; gap:1rem; flex-wrap:wrap;"
    >
      <ngx-ds-button ngxTooltip="Aparece arriba" tooltipPlacement="top">Top</ngx-ds-button>
      <ngx-ds-button ngxTooltip="Aparece abajo" tooltipPlacement="bottom">Bottom</ngx-ds-button>
      <ngx-ds-button ngxTooltip="Aparece a la izquierda" tooltipPlacement="left"
        >Left</ngx-ds-button
      >
      <ngx-ds-button ngxTooltip="Aparece a la derecha" tooltipPlacement="right"
        >Right</ngx-ds-button
      >
    </div>
  `,
})
class PlacementsWrapper {}

// ── Icon Buttons Wrapper ──────────────────────────────────────────────────────

@Component({
  selector: 'tooltip-icons-wrapper',
  standalone: true,
  imports: [TooltipDirective, IconButtonComponent],
  template: `
    <div class="p-10" style="display:flex; align-items:center; justify-content:center; gap:1rem;">
      <ngx-ds-icon-button
        [icon]="icons.Info"
        variant="ghost"
        color="primary"
        ngxTooltip="Más información sobre este campo"
      />
      <ngx-ds-icon-button
        [icon]="icons.Trash2"
        variant="ghost"
        color="danger"
        ngxTooltip="Eliminar permanentemente"
        tooltipPlacement="bottom"
      />
      <ngx-ds-icon-button
        [icon]="icons.Settings"
        variant="ghost"
        ngxTooltip="Configuración avanzada"
        tooltipPlacement="right"
      />
    </div>
  `,
})
class IconButtonsWrapper {
  readonly icons = { Info, Trash2, Settings };
}

// ── Long Text Wrapper ─────────────────────────────────────────────────────────

@Component({
  selector: 'tooltip-long-wrapper',
  standalone: true,
  imports: [TooltipDirective, ButtonComponent],
  template: `
    <div class="p-10" style="display:flex; align-items:center; justify-content:center; gap:1rem;">
      <ngx-ds-button
        ngxTooltip="Este es un texto más largo que demuestra que el tooltip puede mostrar descripciones detalladas con wrapping automático."
        tooltipPlacement="bottom"
      >
        Texto largo
      </ngx-ds-button>
      <ngx-ds-button ngxTooltip="Tooltip deshabilitado" [tooltipDisabled]="true" variant="outline">
        Deshabilitado
      </ngx-ds-button>
    </div>
  `,
})
class LongWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Atoms/Tooltip',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    ngxTooltip: 'Este es un tooltip',
    tooltipPlacement: 'top' as TooltipPlacement,
    tooltipDisabled: false,
    tooltipDelay: 200,
  },
  argTypes: {
    ngxTooltip: { control: 'text' },
    tooltipPlacement: { control: 'radio', options: ['top', 'bottom', 'left', 'right'] },
    tooltipDisabled: { control: 'boolean' },
    tooltipDelay: { control: 'number' },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 5rem; display:flex; align-items:center; justify-content:center;">
        <ngx-ds-button
          [ngxTooltip]="ngxTooltip"
          [tooltipPlacement]="tooltipPlacement"
          [tooltipDisabled]="tooltipDisabled"
          [tooltipDelay]="tooltipDelay"
        >
          Pasa el cursor aquí
        </ngx-ds-button>
      </div>
    `,
    moduleMetadata: { imports: [TooltipDirective, ButtonComponent] },
  }),
};

export const Placements: Story = {
  render: () => ({
    template: `<tooltip-placements-wrapper />`,
    moduleMetadata: { imports: [PlacementsWrapper] },
  }),
};

export const WithIconButtons: Story = {
  render: () => ({
    template: `<tooltip-icons-wrapper />`,
    moduleMetadata: { imports: [IconButtonsWrapper] },
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<tooltip-long-wrapper />`,
    moduleMetadata: { imports: [LongWrapper] },
  }),
};
