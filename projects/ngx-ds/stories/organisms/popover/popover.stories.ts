import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { PopoverComponent } from '../../../src/lib/organisms/popover/popover.component';
import { ButtonComponent } from '../../../src/lib/atoms/button/button.component';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'popover-basic-wrapper',
  standalone: true,
  imports: [PopoverComponent, ButtonComponent],
  template: `
    <div
      style="padding:4rem; display:flex; gap:2rem; flex-wrap:wrap; align-items:center; justify-content:center;"
    >
      <ngx-ds-popover placement="bottom">
        <ngx-ds-button popover-trigger variant="outline">Abrir popover</ngx-ds-button>
        <div popover-content>
          <p style="margin:0; font-size:0.875rem; font-weight:600;">Título del popover</p>
          <p style="margin:0.5rem 0 0; font-size:0.8125rem; color:var(--text-muted, #6b7280);">
            Contenido del popover. Puede incluir cualquier elemento.
          </p>
        </div>
      </ngx-ds-popover>

      <ngx-ds-popover placement="top">
        <ngx-ds-button popover-trigger variant="outline">Arriba</ngx-ds-button>
        <div popover-content>
          <p style="margin:0; font-size:0.8125rem;">Popover en la parte superior.</p>
        </div>
      </ngx-ds-popover>

      <ngx-ds-popover placement="right">
        <ngx-ds-button popover-trigger variant="outline">Derecha</ngx-ds-button>
        <div popover-content>
          <p style="margin:0; font-size:0.8125rem;">Popover a la derecha.</p>
        </div>
      </ngx-ds-popover>
    </div>
  `,
})
class BasicWrapper {}

// ── Placements Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'popover-placements-wrapper',
  standalone: true,
  imports: [PopoverComponent, ButtonComponent],
  template: `
    <div
      style="padding:5rem; display:grid; grid-template-columns:repeat(3,auto); gap:1rem; justify-content:center; align-items:center;"
    >
      @for (p of placements; track p) {
        <ngx-ds-popover [placement]="p">
          <ngx-ds-button popover-trigger size="sm" variant="outline">{{ p }}</ngx-ds-button>
          <div popover-content style="font-size:0.8rem; white-space:nowrap;">
            Placement: {{ p }}
          </div>
        </ngx-ds-popover>
      }
    </div>
  `,
})
class PlacementsWrapper {
  placements = [
    'top-start',
    'top',
    'top-end',
    'left',
    '',
    'right',
    'bottom-start',
    'bottom',
    'bottom-end',
  ].filter(Boolean);
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Organisms/Popover',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<popover-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};

export const Placements: Story = {
  render: () => ({
    template: `<popover-placements-wrapper />`,
    moduleMetadata: { imports: [PlacementsWrapper] },
  }),
};
