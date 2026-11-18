import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import {
  CommandPaletteComponent,
  CommandItem,
} from '../../../src/lib/organisms/command-palette/command-palette.component';
import { ButtonComponent } from '../../../src/lib/atoms/button/button.component';

const COMMANDS: CommandItem[] = [
  { id: 'home', label: 'Ir al inicio', category: 'Navegación', kbd: ['Ctrl', 'H'] },
  {
    id: 'docs',
    label: 'Ver documentación',
    category: 'Navegación',
    description: 'Abre la guía de componentes',
  },
  { id: 'new', label: 'Nuevo proyecto', category: 'Acciones', kbd: ['Ctrl', 'N'] },
  { id: 'open', label: 'Abrir archivo', category: 'Acciones', kbd: ['Ctrl', 'O'] },
  { id: 'save', label: 'Guardar cambios', category: 'Acciones', kbd: ['Ctrl', 'S'] },
  { id: 'export', label: 'Exportar como PDF', category: 'Acciones' },
  { id: 'settings', label: 'Preferencias', category: 'Sistema', kbd: ['Ctrl', ','] },
  { id: 'logout', label: 'Cerrar sesión', category: 'Sistema' },
];

@Component({
  selector: 'command-palette-wrapper',
  standalone: true,
  imports: [CommandPaletteComponent, ButtonComponent],
  template: `
    <div class="p-6">
      <ngx-ds-button (click)="open.set(true)">
        Abrir paleta <kbd style="font-size:0.75rem; margin-left:0.5rem;">Ctrl+K</kbd>
      </ngx-ds-button>
      <p style="margin-top:1rem; font-size:0.8rem; color:var(--text-muted, #6b7280);">
        También puedes usar <strong>Ctrl+K</strong> desde cualquier lugar.
      </p>
      <p style="font-size:0.8rem; color:var(--text-muted, #6b7280);">
        Último seleccionado: {{ last() }}
      </p>

      <ngx-ds-command-palette [(open)]="open" [items]="commands" (itemSelect)="onSelect($event)" />
    </div>
  `,
})
class Wrapper {
  open = signal(false);
  commands = COMMANDS;
  last = signal('ninguno');
  onSelect(item: CommandItem): void {
    this.last.set(item.label);
  }
}

const meta: Meta = { title: 'Organisms/CommandPalette' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<command-palette-wrapper />`,
    moduleMetadata: { imports: [Wrapper] },
  }),
};
