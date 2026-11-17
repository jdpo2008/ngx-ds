import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { FocusTrapDirective } from '../../../src/lib/directives/focus-trap/focus-trap.directive';
import { ButtonComponent } from '../../../src/lib/atoms/button/button.component';
import { setupEscapeClose } from '../../../src/lib/shared/escape-close';

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'focus-trap-default-wrapper',
  standalone: true,
  imports: [FocusTrapDirective, ButtonComponent],
  template: `
    <div class="p-6" style="display:flex; flex-direction:column; gap:1rem; max-width:28rem;">
      <p style="margin:0; font-size:0.875rem; color:var(--text-muted, #6b7280);">
        Abre el panel y pulsa Tab / Shift+Tab: el foco recorre solo sus controles. Al cerrarlo
        (botón o Escape) vuelve al botón que lo abrió.
      </p>
      <div>
        <ngx-ds-button (click)="open.set(true)">Abrir panel</ngx-ds-button>
      </div>

      @if (open()) {
        <div
          ngxFocusTrap
          tabindex="-1"
          role="dialog"
          aria-label="Panel con foco atrapado"
          style="display:flex; flex-direction:column; gap:0.75rem; padding:1rem; border:1.5px solid var(--border-base, #e5e7eb); border-radius:0.5rem; background:var(--surface-base, #fff);"
        >
          <label
            style="display:flex; flex-direction:column; gap:0.25rem; font-size:0.875rem; color:var(--text-secondary, #374151);"
          >
            Nombre
            <input
              style="padding:0.5rem 0.75rem; border:1.5px solid var(--border-input, #d1d5db); border-radius:0.375rem; background:var(--surface-base, #fff); color:var(--text-base, #111827);"
            />
          </label>
          <label
            style="display:flex; flex-direction:column; gap:0.25rem; font-size:0.875rem; color:var(--text-secondary, #374151);"
          >
            Email
            <input
              type="email"
              style="padding:0.5rem 0.75rem; border:1.5px solid var(--border-input, #d1d5db); border-radius:0.375rem; background:var(--surface-base, #fff); color:var(--text-base, #111827);"
            />
          </label>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button
              type="button"
              (click)="open.set(false)"
              style="padding:0.5rem 0.875rem; border:1.5px solid var(--border-base, #e5e7eb); border-radius:0.375rem; background:var(--surface-base, #fff); color:var(--text-secondary, #374151); cursor:pointer; font:inherit; font-size:0.875rem;"
            >
              Cancelar
            </button>
            <button
              type="button"
              (click)="open.set(false)"
              style="padding:0.5rem 0.875rem; border:none; border-radius:0.375rem; background:var(--primary-600, #4f46e5); color:var(--text-on-color, #fff); cursor:pointer; font:inherit; font-size:0.875rem;"
            >
              Guardar
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
class DefaultWrapper {
  readonly open = signal(false);

  constructor() {
    setupEscapeClose(() => this.open.set(false));
  }
}

const meta: Meta = {
  title: 'Directives/FocusTrap',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Atrapa el foco dentro del host mientras está en el DOM: enfoca `[autofocus]`, el primer focusable o el propio host (`tabindex="-1"`), cicla con Tab / Shift+Tab y restaura el foco previo al destruirse. Lo usan Modal, Drawer, Confirmation y CommandPalette.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<focus-trap-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};
