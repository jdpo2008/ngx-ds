import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { ButtonGroupComponent } from '../../../src/lib/molecules/button-group/button-group.component';
import { ButtonComponent } from '../../../src/lib/atoms/button/button.component';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'button-group-basic-wrapper',
  standalone: true,
  imports: [ButtonGroupComponent, ButtonComponent],
  template: `
    <div class="p-6" style="display: flex; flex-direction: column; gap: 1.5rem;">
      <ngx-ds-button-group ariaLabel="Alineación de texto">
        <ngx-ds-button variant="outline" color="secondary">Izquierda</ngx-ds-button>
        <ngx-ds-button variant="outline" color="secondary">Centro</ngx-ds-button>
        <ngx-ds-button variant="outline" color="secondary">Derecha</ngx-ds-button>
      </ngx-ds-button-group>

      <ngx-ds-button-group ariaLabel="Acciones">
        <ngx-ds-button color="primary">Guardar</ngx-ds-button>
        <ngx-ds-button color="primary">Guardar y cerrar</ngx-ds-button>
        <ngx-ds-button color="primary">Cancelar</ngx-ds-button>
      </ngx-ds-button-group>
    </div>
  `,
})
class BasicWrapper {}

// ── Full Width Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'button-group-full-width-wrapper',
  standalone: true,
  imports: [ButtonGroupComponent, ButtonComponent],
  template: `
    <div class="p-6" style="max-width: 32rem;">
      <ngx-ds-button-group ariaLabel="Vista" [fullWidth]="true">
        <ngx-ds-button variant="outline" color="secondary">Día</ngx-ds-button>
        <ngx-ds-button variant="outline" color="secondary">Semana</ngx-ds-button>
        <ngx-ds-button variant="outline" color="secondary">Mes</ngx-ds-button>
      </ngx-ds-button-group>
    </div>
  `,
})
class FullWidthWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/ButtonGroup',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<button-group-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};

export const FullWidth: Story = {
  render: () => ({
    template: `<button-group-full-width-wrapper />`,
    moduleMetadata: { imports: [FullWidthWrapper] },
  }),
};
