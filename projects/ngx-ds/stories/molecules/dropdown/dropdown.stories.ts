import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {
  DropdownComponent,
  DropdownOption,
} from '../../../src/lib/molecules/dropdown/dropdown.component';

// ── Shared options ────────────────────────────────────────────
const ROLES: DropdownOption[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Visualizador' },
  { value: 'guest', label: 'Invitado' },
  { value: 'blocked', label: 'Bloqueado (deshabilitado)', disabled: true },
];

const LANGS: DropdownOption[] = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pt', label: 'Português' },
  { value: 'it', label: 'Italiano' },
];

// ── Default ───────────────────────────────────────────────────
@Component({
  selector: 'drp-default-wrapper',
  standalone: true,
  imports: [DropdownComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <ngx-ds-dropdown label="Rol" [options]="roles" />
      <ngx-ds-dropdown label="Rol" [options]="roles" hint="Selecciona el rol del usuario." />
      <ngx-ds-dropdown label="Rol" [options]="roles" errorMessage="Debes elegir un rol." />
      <ngx-ds-dropdown label="Deshabilitado" [options]="roles" [disabled]="true" />
    </div>
  `,
})
class DefaultWrapper {
  roles = ROLES;
}

// ── Floating Label ────────────────────────────────────────────
@Component({
  selector: 'drp-floating-wrapper',
  standalone: true,
  imports: [DropdownComponent],
  template: `
    <div class="p-6 flex flex-col gap-6 max-w-sm">
      <p class="text-sm text-gray-500">Haz clic para ver el label flotando</p>
      <ngx-ds-dropdown label="Rol" [options]="roles" [floatingLabel]="true" />
      <ngx-ds-dropdown label="Idioma" [options]="langs" [floatingLabel]="true" />
      <ngx-ds-dropdown
        label="Rol"
        [options]="roles"
        [floatingLabel]="true"
        errorMessage="Campo obligatorio."
      />
      <ngx-ds-dropdown
        label="Deshabilitado"
        [options]="roles"
        [floatingLabel]="true"
        [disabled]="true"
      />
    </div>
  `,
})
class FloatingWrapper {
  roles = ROLES;
  langs = LANGS;
}

// ── Sizes ─────────────────────────────────────────────────────
@Component({
  selector: 'drp-sizes-wrapper',
  standalone: true,
  imports: [DropdownComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <div>
        <p class="text-xs text-gray-500 mb-1">Small</p>
        <ngx-ds-dropdown label="Idioma" size="sm" [options]="langs" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1">Medium (por defecto)</p>
        <ngx-ds-dropdown label="Idioma" size="md" [options]="langs" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1">Large</p>
        <ngx-ds-dropdown label="Idioma" size="lg" [options]="langs" />
      </div>
    </div>
  `,
})
class SizesWrapper {
  langs = LANGS;
}

// ── Signal Form ───────────────────────────────────────────────
@Component({
  selector: 'drp-signal-wrapper',
  standalone: true,
  imports: [DropdownComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">
        Signal Forms — <code class="text-xs bg-gray-100 px-1 rounded">[(value)]</code>
      </p>

      <ngx-ds-dropdown label="Rol" [options]="roles" [floatingLabel]="true" [(value)]="role" />
      <ngx-ds-dropdown label="Idioma" [options]="langs" [floatingLabel]="true" [(value)]="lang" />

      <div class="mt-2 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
        <p class="text-gray-500 text-xs font-medium mb-1">Estado del signal</p>
        <p>
          Rol: <span class="font-medium text-gray-800">{{ role() ?? '—' }}</span>
        </p>
        <p>
          Idioma: <span class="font-medium text-gray-800">{{ lang() ?? '—' }}</span>
        </p>
      </div>
    </div>
  `,
})
class SignalWrapper {
  roles = ROLES;
  langs = LANGS;
  role = signal<string | number | null>(null);
  lang = signal<string | number | null>(null);
}

// ── Reactive Form ─────────────────────────────────────────────
@Component({
  selector: 'drp-reactive-wrapper',
  standalone: true,
  imports: [DropdownComponent, ReactiveFormsModule],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">
        Reactive Forms — <code class="text-xs bg-gray-100 px-1 rounded">formControlName</code>
      </p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <ngx-ds-dropdown
          label="Rol"
          [options]="roles"
          [floatingLabel]="true"
          formControlName="role"
          [errorMessage]="roleError()"
        />
        <ngx-ds-dropdown
          label="Idioma"
          [options]="langs"
          [floatingLabel]="true"
          formControlName="lang"
          [errorMessage]="langError()"
        />

        <button
          type="submit"
          class="mt-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md
                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="form.invalid"
        >
          Guardar
        </button>
      </form>

      @if (submitted) {
        <div class="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <p class="text-gray-500 text-xs font-medium mb-1">Valor del formulario</p>
          <p>
            Rol: <span class="font-medium text-gray-800">{{ form.value.role }}</span>
          </p>
          <p>
            Idioma: <span class="font-medium text-gray-800">{{ form.value.lang }}</span>
          </p>
        </div>
      }
    </div>
  `,
})
class ReactiveWrapper {
  roles = ROLES;
  langs = LANGS;
  submitted = false;

  form = new FormGroup({
    role: new FormControl(null, Validators.required),
    lang: new FormControl(null, Validators.required),
  });

  roleError = () => {
    const c = this.form.get('role');
    return c?.touched && c?.hasError('required') ? 'Selecciona un rol.' : '';
  };

  langError = () => {
    const c = this.form.get('lang');
    return c?.touched && c?.hasError('required') ? 'Selecciona un idioma.' : '';
  };

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.submitted = true;
      console.log('Dropdown form submitted', this.form.value);
    }
  }
}

// ── Meta ──────────────────────────────────────────────────────
const meta: Meta = { title: 'Molecules/Dropdown' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<drp-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const FloatingLabel: Story = {
  render: () => ({
    template: `<drp-floating-wrapper />`,
    moduleMetadata: { imports: [FloatingWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<drp-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const SignalForm: Story = {
  render: () => ({
    template: `<drp-signal-wrapper />`,
    moduleMetadata: { imports: [SignalWrapper] },
  }),
};

export const ReactiveForm: Story = {
  render: () => ({
    template: `<drp-reactive-wrapper />`,
    moduleMetadata: { imports: [ReactiveWrapper] },
  }),
};
