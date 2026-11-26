import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormField, email, form, required } from '@angular/forms/signals';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  LucideMail as Mail,
  LucideLock as Lock,
  LucideUser as User,
  LucideSearch as Search,
  LucidePhone as Phone,
  LucideAlertCircle as AlertCircle,
} from '@lucide/angular';
import { InputComponent } from '../../../src/lib/molecules/input/input.component';

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'inp-default-wrapper',
  standalone: true,
  imports: [InputComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <ngx-ds-input label="Nombre completo" placeholder="Ej: Juan García" />
      <ngx-ds-input label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" />
      <ngx-ds-input label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" />
      <ngx-ds-input label="Teléfono" type="tel" placeholder="+34 600 000 000" />
    </div>
  `,
})
class DefaultWrapper {}

// ── Floating Label Wrapper ────────────────────────────────────────────────────

@Component({
  selector: 'inp-floating-wrapper',
  standalone: true,
  imports: [InputComponent],
  template: `
    <div class="p-6 flex flex-col gap-6 max-w-sm">
      <p class="text-sm text-gray-500">Haz clic en cada campo para ver el label flotando</p>
      <ngx-ds-input label="Nombre completo" [floatingLabel]="true" placeholder="Ej: Juan García" />
      <ngx-ds-input
        label="Correo electrónico"
        type="email"
        [floatingLabel]="true"
        placeholder="correo@ejemplo.com"
      />
      <ngx-ds-input
        label="Contraseña"
        type="password"
        [floatingLabel]="true"
        placeholder="Mínimo 8 caracteres"
      />
      <ngx-ds-input
        label="Campo con valor inicial"
        [floatingLabel]="true"
        value="Ya tiene contenido"
      />
    </div>
  `,
})
class FloatingWrapper {}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'inp-sizes-wrapper',
  standalone: true,
  imports: [InputComponent],
  template: `
    <div class="p-6 flex flex-col gap-5 max-w-sm">
      <div>
        <p class="text-xs text-gray-500 mb-1">Small</p>
        <ngx-ds-input label="Small" size="sm" placeholder="Texto pequeño" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1">Medium (por defecto)</p>
        <ngx-ds-input label="Medium" size="md" placeholder="Texto medio" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1">Large</p>
        <ngx-ds-input label="Large" size="lg" placeholder="Texto grande" />
      </div>

      <p class="text-xs text-gray-500 mt-2 mb-1">Floating label por tamaño</p>
      <ngx-ds-input size="sm" label="Small float" [floatingLabel]="true" placeholder="..." />
      <ngx-ds-input size="md" label="Medium float" [floatingLabel]="true" placeholder="..." />
      <ngx-ds-input size="lg" label="Large float" [floatingLabel]="true" placeholder="..." />
    </div>
  `,
})
class SizesWrapper {}

// ── Icons Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'inp-icons-wrapper',
  standalone: true,
  imports: [InputComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <ngx-ds-input
        label="Email"
        type="email"
        [iconLeft]="mailIcon"
        placeholder="correo@ejemplo.com"
      />
      <ngx-ds-input
        label="Contraseña"
        type="password"
        [iconLeft]="lockIcon"
        placeholder="••••••••"
      />
      <ngx-ds-input label="Búsqueda" type="search" [iconLeft]="searchIcon" placeholder="Buscar…" />
      <ngx-ds-input label="Teléfono" [iconLeft]="phoneIcon" placeholder="+34 600 000 000" />
      <ngx-ds-input
        label="Usuario"
        [iconLeft]="userIcon"
        [iconRight]="alertIcon"
        placeholder="nombre.usuario"
      />

      <p class="text-xs text-gray-500 mt-2 mb-1">Floating label con icono</p>
      <ngx-ds-input
        label="Email"
        type="email"
        [iconLeft]="mailIcon"
        [floatingLabel]="true"
        placeholder="correo@ejemplo.com"
      />
      <ngx-ds-input
        label="Búsqueda"
        type="search"
        [iconLeft]="searchIcon"
        [floatingLabel]="true"
        placeholder="Buscar…"
      />
    </div>
  `,
})
class IconsWrapper {
  mailIcon = Mail;
  lockIcon = Lock;
  userIcon = User;
  searchIcon = Search;
  phoneIcon = Phone;
  alertIcon = AlertCircle;
}

// ── States Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'inp-states-wrapper',
  standalone: true,
  imports: [InputComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <ngx-ds-input label="Normal" placeholder="Campo normal" />
      <ngx-ds-input
        label="Con hint"
        placeholder="Escribe algo"
        hint="Este texto te ayuda a completar el campo."
      />
      <ngx-ds-input
        label="Con error"
        placeholder="Escribe algo"
        value="texto inválido"
        errorMessage="Este campo no es válido."
      />
      <ngx-ds-input label="Deshabilitado" placeholder="No editable" [disabled]="true" />
      <ngx-ds-input label="Solo lectura" value="Valor de solo lectura" [readonly]="true" />

      <p class="text-xs text-gray-500 mt-2 mb-1">Floating label + estados</p>
      <ngx-ds-input
        label="Con error"
        [floatingLabel]="true"
        value="dato erróneo"
        errorMessage="El formato no es válido."
      />
      <ngx-ds-input
        label="Deshabilitado"
        [floatingLabel]="true"
        value="sin editar"
        [disabled]="true"
      />
    </div>
  `,
})
class StatesWrapper {}

// ── Signal Form Wrapper ───────────────────────────────────────────────────────

@Component({
  selector: 'inp-signal-wrapper',
  standalone: true,
  imports: [InputComponent, FormField, JsonPipe],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700 mb-1">
        Signal Forms — <code class="text-xs bg-gray-100 px-1 rounded">[formField]</code>
      </p>

      <ngx-ds-input
        label="Nombre"
        [floatingLabel]="true"
        [formField]="f.name"
        placeholder="Tu nombre"
      />
      <ngx-ds-input
        label="Email"
        type="email"
        [floatingLabel]="true"
        [formField]="f.email"
        placeholder="tu@email.com"
        [iconLeft]="mailIcon"
      />

      <div class="mt-2 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
        <p class="text-gray-500 text-xs font-medium mb-1">Modelo</p>
        <pre class="text-xs">{{ model() | json }}</pre>
        <p class="text-xs">Válido: {{ f().valid() ? 'sí' : 'no' }}</p>
      </div>
    </div>
  `,
})
class SignalFormWrapper {
  model = signal({ name: '', email: '' });
  f = form(this.model, (p) => {
    required(p.name, { message: 'El nombre es obligatorio' });
    required(p.email, { message: 'El email es obligatorio' });
    email(p.email, { message: 'Email no válido' });
  });
  mailIcon = Mail;
}

// ── Template Form Wrapper ─────────────────────────────────────────────────────

@Component({
  selector: 'inp-template-wrapper',
  standalone: true,
  imports: [InputComponent, FormsModule],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700 mb-1">
        Template-Driven Forms — <code class="text-xs bg-gray-100 px-1 rounded">[(ngModel)]</code>
      </p>

      <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm.value)" class="flex flex-col gap-4">
        <ngx-ds-input
          label="Usuario"
          name="username"
          [floatingLabel]="true"
          [(ngModel)]="model.username"
          placeholder="nombre.usuario"
          [iconLeft]="userIcon"
          required
        />
        <ngx-ds-input
          label="Contraseña"
          name="password"
          type="password"
          [floatingLabel]="true"
          [(ngModel)]="model.password"
          placeholder="••••••••"
          [iconLeft]="lockIcon"
          required
        />

        <button
          type="submit"
          class="mt-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md
                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="loginForm.invalid"
        >
          Iniciar sesión
        </button>
      </form>

      @if (submitted) {
        <div class="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <p class="text-gray-500 text-xs font-medium mb-1">Valor del modelo</p>
          <p>
            Usuario: <span class="font-medium text-gray-800">{{ model.username }}</span>
          </p>
          <p>
            Contraseña: <span class="font-medium text-gray-800">{{ model.password }}</span>
          </p>
        </div>
      }
    </div>
  `,
})
class TemplateFormWrapper {
  model = { username: '', password: '' };
  submitted = false;
  userIcon = User;
  lockIcon = Lock;

  onSubmit(value: unknown): void {
    this.submitted = true;
    console.log('Template form submitted', value);
  }
}

// ── Reactive Form Wrapper ─────────────────────────────────────────────────────

@Component({
  selector: 'inp-reactive-wrapper',
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700 mb-1">
        Reactive Forms — <code class="text-xs bg-gray-100 px-1 rounded">formControlName</code>
      </p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <ngx-ds-input
          label="Nombre"
          [floatingLabel]="true"
          formControlName="name"
          placeholder="Tu nombre completo"
          [iconLeft]="userIcon"
          [errorMessage]="nameError()"
        />
        <ngx-ds-input
          label="Correo electrónico"
          type="email"
          [floatingLabel]="true"
          formControlName="email"
          placeholder="correo@ejemplo.com"
          [iconLeft]="mailIcon"
          [errorMessage]="emailError()"
        />
        <ngx-ds-input
          label="Contraseña"
          type="password"
          [floatingLabel]="true"
          formControlName="password"
          placeholder="Mínimo 8 caracteres"
          [iconLeft]="lockIcon"
          hint="Usa letras, números y símbolos."
          [errorMessage]="passwordError()"
        />

        <button
          type="submit"
          class="mt-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md
                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="form.invalid"
        >
          Registrarse
        </button>
      </form>

      @if (submitted) {
        <div class="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <p class="text-gray-500 text-xs font-medium mb-1">Valor del formulario</p>
          @for (entry of formEntries(); track entry.key) {
            <p>
              {{ entry.key }}: <span class="font-medium text-gray-800">{{ entry.value }}</span>
            </p>
          }
        </div>
      }
    </div>
  `,
})
class ReactiveFormWrapper {
  userIcon = User;
  mailIcon = Mail;
  lockIcon = Lock;
  submitted = false;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  private touched(field: string): boolean {
    return !!this.form.get(field)?.touched;
  }

  nameError = () => {
    if (!this.touched('name')) return '';
    const c = this.form.get('name');
    if (c?.hasError('required')) return 'El nombre es obligatorio.';
    if (c?.hasError('minlength')) return 'Mínimo 2 caracteres.';
    return '';
  };

  emailError = () => {
    if (!this.touched('email')) return '';
    const c = this.form.get('email');
    if (c?.hasError('required')) return 'El correo es obligatorio.';
    if (c?.hasError('email')) return 'Introduce un correo válido.';
    return '';
  };

  passwordError = () => {
    if (!this.touched('password')) return '';
    const c = this.form.get('password');
    if (c?.hasError('required')) return 'La contraseña es obligatoria.';
    if (c?.hasError('minlength')) return 'Mínimo 8 caracteres.';
    return '';
  };

  formEntries = () => Object.entries(this.form.value).map(([key, value]) => ({ key, value }));

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.submitted = true;
      console.log('Reactive form submitted', this.form.value);
    }
  }
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/Input',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<inp-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const FloatingLabel: Story = {
  render: () => ({
    template: `<inp-floating-wrapper />`,
    moduleMetadata: { imports: [FloatingWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<inp-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const WithIcons: Story = {
  render: () => ({
    template: `<inp-icons-wrapper />`,
    moduleMetadata: { imports: [IconsWrapper] },
  }),
};

export const States: Story = {
  render: () => ({
    template: `<inp-states-wrapper />`,
    moduleMetadata: { imports: [StatesWrapper] },
  }),
};

export const SignalForm: Story = {
  render: () => ({
    template: `<inp-signal-wrapper />`,
    moduleMetadata: { imports: [SignalFormWrapper] },
  }),
};

export const TemplateForm: Story = {
  render: () => ({
    template: `<inp-template-wrapper />`,
    moduleMetadata: { imports: [TemplateFormWrapper] },
  }),
};

export const ReactiveForm: Story = {
  render: () => ({
    template: `<inp-reactive-wrapper />`,
    moduleMetadata: { imports: [ReactiveFormWrapper] },
  }),
};
