import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { PasswordStrengthComponent } from '../../../src/lib/molecules/password-strength/password-strength.component';

// ── Levels Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'ps-levels-wrapper',
  standalone: true,
  imports: [PasswordStrengthComponent],
  template: `
    <div class="p-6 flex flex-col gap-6 max-w-sm">
      <div>
        <p class="text-xs text-gray-500 mb-1">Débil — "abc"</p>
        <ngx-ds-password-strength password="abc" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1">Regular — "abc12345"</p>
        <ngx-ds-password-strength password="abc12345" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1">Buena — "Abc12345"</p>
        <ngx-ds-password-strength password="Abc12345" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1">Fuerte — "Abc12345!@#"</p>
        <ngx-ds-password-strength password="Abc12345!@#" [requireSpecial]="true" />
      </div>
    </div>
  `,
})
class LevelsWrapper {}

// ── Configured Rules Wrapper ──────────────────────────────────────────────────

@Component({
  selector: 'ps-configured-wrapper',
  standalone: true,
  imports: [PasswordStrengthComponent],
  template: `
    <div class="p-6 flex flex-col gap-8 max-w-sm">
      <div>
        <p class="text-xs font-semibold text-gray-600 mb-1">Solo longitud mínima (6)</p>
        <p class="text-xs text-gray-500 mb-2">
          minLength=6, requireUppercase=false, requireNumbers=false
        </p>
        <ngx-ds-password-strength
          password="hola123"
          [minLength]="6"
          [requireUppercase]="false"
          [requireNumbers]="false"
          [showRequirements]="true"
        />
      </div>

      <div>
        <p class="text-xs font-semibold text-gray-600 mb-1">
          Con mayúsculas y números (sin especiales)
        </p>
        <p class="text-xs text-gray-500 mb-2">
          minLength=8, requireUppercase=true, requireNumbers=true
        </p>
        <ngx-ds-password-strength
          password="Hola1234"
          [minLength]="8"
          [requireUppercase]="true"
          [requireNumbers]="true"
          [requireSpecial]="false"
          [showRequirements]="true"
        />
      </div>

      <div>
        <p class="text-xs font-semibold text-gray-600 mb-1">Con longitud máxima</p>
        <p class="text-xs text-gray-500 mb-2">minLength=8, maxLength=16</p>
        <ngx-ds-password-strength
          password="Hola1234!toolargepassword"
          [minLength]="8"
          [maxLength]="16"
          [requireSpecial]="true"
          [showRequirements]="true"
        />
      </div>

      <div>
        <p class="text-xs font-semibold text-gray-600 mb-1">Todos los criterios activos</p>
        <p class="text-xs text-gray-500 mb-2">
          minLength=12, requireUppercase, requireNumbers, requireSpecial
        </p>
        <ngx-ds-password-strength
          password="MyP@ss12word!"
          [minLength]="12"
          [requireUppercase]="true"
          [requireNumbers]="true"
          [requireSpecial]="true"
          [showRequirements]="true"
        />
      </div>
    </div>
  `,
})
class ConfiguredWrapper {}

// ── Requirements Wrapper ──────────────────────────────────────────────────────

@Component({
  selector: 'ps-requirements-wrapper',
  standalone: true,
  imports: [PasswordStrengthComponent],
  template: `
    <div class="p-6 flex flex-col gap-6 max-w-sm">
      <div>
        <p class="text-xs text-gray-500 mb-1">Sin cumplir — "abc"</p>
        <ngx-ds-password-strength password="abc" [showRequirements]="true" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-2">Parcialmente — "Abc12345"</p>
        <ngx-ds-password-strength password="Abc12345" [showRequirements]="true" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-2">Todos cumplidos — "Abc12345!@"</p>
        <ngx-ds-password-strength
          password="Abc12345!@"
          [requireSpecial]="true"
          [showRequirements]="true"
        />
      </div>
    </div>
  `,
})
class RequirementsWrapper {}

// ── Interactive Wrapper ───────────────────────────────────────────────────────

@Component({
  selector: 'ps-interactive-wrapper',
  standalone: true,
  imports: [PasswordStrengthComponent],
  template: `
    <div class="p-6 flex flex-col gap-5 max-w-sm">
      <p class="text-sm text-gray-500">Configura los criterios y escribe una contraseña</p>

      <!-- Config toggles -->
      <div class="bg-gray-50 rounded-lg p-3 flex flex-col gap-2 text-sm text-gray-700">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="number"
            [value]="minLen()"
            min="1"
            max="32"
            class="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            style="background: var(--surface-base, #fff); color: var(--text-base, #111827)"
            (input)="minLen.set(+$any($event.target).value)"
          />
          Longitud mínima
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" [checked]="reqUpper()" (change)="reqUpper.set(!reqUpper())" />
          Requerir mayúsculas
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            [checked]="reqNumbers()"
            (change)="reqNumbers.set(!reqNumbers())"
          />
          Requerir números
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            [checked]="reqSpecial()"
            (change)="reqSpecial.set(!reqSpecial())"
          />
          Requerir caracteres especiales
        </label>
      </div>

      <!-- Password input -->
      <div class="relative">
        <input
          [type]="visible() ? 'text' : 'password'"
          class="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Escribe tu contraseña…"
          (input)="password.set($any($event.target).value)"
        />
        <button
          type="button"
          class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-700"
          (click)="visible.set(!visible())"
          aria-label="Mostrar u ocultar contraseña"
        >
          @if (visible()) {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
              />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          } @else {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
        </button>
      </div>

      <ngx-ds-password-strength
        [password]="password()"
        [minLength]="minLen()"
        [requireUppercase]="reqUpper()"
        [requireNumbers]="reqNumbers()"
        [requireSpecial]="reqSpecial()"
        [showRequirements]="true"
      />
    </div>
  `,
})
class InteractiveWrapper {
  password = signal('');
  visible = signal(false);
  minLen = signal(8);
  reqUpper = signal(true);
  reqNumbers = signal(true);
  reqSpecial = signal(false);
}

// ── Real World Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'ps-real-world-wrapper',
  standalone: true,
  imports: [PasswordStrengthComponent],
  template: `
    <div class="p-6 max-w-sm">
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <div>
          <h2 class="text-lg font-semibold text-gray-800">Crear contraseña</h2>
          <p class="text-sm text-gray-500 mt-0.5">Mínimo 10 caracteres con mayúsculas y números</p>
        </div>

        <!-- New password -->
        <div class="space-y-1.5">
          <label for="ps-new" class="block text-sm font-medium text-gray-700"
            >Nueva contraseña</label
          >
          <input
            id="ps-new"
            type="password"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mínimo 10 caracteres"
            (input)="password.set($any($event.target).value)"
          />
          <div class="mt-2">
            <ngx-ds-password-strength
              [password]="password()"
              [minLength]="10"
              [requireUppercase]="true"
              [requireNumbers]="true"
              [requireSpecial]="false"
              [showRequirements]="true"
            />
          </div>
        </div>

        <!-- Confirm password -->
        <div class="space-y-1.5">
          <label for="ps-confirm" class="block text-sm font-medium text-gray-700"
            >Confirmar contraseña</label
          >
          <input
            id="ps-confirm"
            type="password"
            class="w-full px-3 py-2 text-sm border rounded-md
                   focus:outline-none focus:ring-2 focus:border-blue-500"
            [class]="confirmBorderClass()"
            placeholder="Repite la contraseña"
            (input)="confirm.set($any($event.target).value)"
          />
          @if (confirm() && password()) {
            <p class="text-xs" [class]="passwordsMatch() ? 'text-green-600' : 'text-red-500'">
              {{
                passwordsMatch() ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'
              }}
            </p>
          }
        </div>

        <button
          type="button"
          class="w-full py-2 text-sm font-medium rounded-md transition-colors"
          [class]="submitClass()"
          [disabled]="!canSubmit()"
        >
          Guardar contraseña
        </button>
      </div>
    </div>
  `,
})
class RealWorldWrapper {
  password = signal('');
  confirm = signal('');

  readonly passwordsMatch = () => this.password() === this.confirm() && this.confirm().length > 0;

  readonly canSubmit = () => this.password().length >= 10 && this.passwordsMatch();

  readonly confirmBorderClass = () =>
    !this.confirm()
      ? 'border-gray-300 focus:ring-blue-500'
      : this.passwordsMatch()
        ? 'border-green-400 focus:ring-green-500'
        : 'border-red-400 focus:ring-red-500';

  readonly submitClass = () =>
    this.canSubmit()
      ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
      : 'bg-gray-100 text-gray-500 cursor-not-allowed';
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/PasswordStrength',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Levels: Story = {
  render: () => ({
    template: `<ps-levels-wrapper />`,
    moduleMetadata: { imports: [LevelsWrapper] },
  }),
};

export const ConfiguredRules: Story = {
  render: () => ({
    template: `<ps-configured-wrapper />`,
    moduleMetadata: { imports: [ConfiguredWrapper] },
  }),
};

export const WithRequirements: Story = {
  render: () => ({
    template: `<ps-requirements-wrapper />`,
    moduleMetadata: { imports: [RequirementsWrapper] },
  }),
};

export const Interactive: Story = {
  render: () => ({
    template: `<ps-interactive-wrapper />`,
    moduleMetadata: { imports: [InteractiveWrapper] },
  }),
};

export const RealWorld: Story = {
  render: () => ({
    template: `<ps-real-world-wrapper />`,
    moduleMetadata: { imports: [RealWorldWrapper] },
  }),
};
