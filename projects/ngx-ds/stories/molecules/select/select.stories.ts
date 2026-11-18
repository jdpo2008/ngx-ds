import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectComponent, SelectOption } from '../../../src/lib/molecules/select/select.component';

// ── Shared options ────────────────────────────────────────────
const COUNTRIES: SelectOption[] = [
  { value: 'es', label: 'España' },
  { value: 'mx', label: 'México' },
  { value: 'ar', label: 'Argentina' },
  { value: 'co', label: 'Colombia' },
  { value: 'pe', label: 'Perú' },
  { value: 'cl', label: 'Chile' },
  { value: 'uy', label: 'Uruguay' },
  { value: 'py', label: 'Paraguay (deshabilitado)', disabled: true },
];

const SKILLS: SelectOption[] = [
  { value: 'angular', label: 'Angular' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'rxjs', label: 'RxJS' },
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
];

// ── Default ───────────────────────────────────────────────────
@Component({
  selector: 'sel-default-wrapper',
  standalone: true,
  imports: [SelectComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <ngx-ds-select label="País" [options]="countries" placeholder="Elige un país" />
      <ngx-ds-select
        label="País"
        [options]="countries"
        placeholder="Con hint"
        hint="Selecciona tu país de residencia."
      />
      <ngx-ds-select
        label="País"
        [options]="countries"
        placeholder="Con error"
        errorMessage="Debes seleccionar un país."
      />
      <ngx-ds-select
        label="Deshabilitado"
        [options]="countries"
        placeholder="No disponible"
        [disabled]="true"
      />
    </div>
  `,
})
class DefaultWrapper {
  countries = COUNTRIES;
}

// ── Floating Label ────────────────────────────────────────────
@Component({
  selector: 'sel-floating-wrapper',
  standalone: true,
  imports: [SelectComponent],
  template: `
    <div class="p-6 flex flex-col gap-6 max-w-sm">
      <p class="text-sm text-gray-500">Haz clic para ver el label flotando</p>
      <ngx-ds-select label="País" [options]="countries" [floatingLabel]="true" />
      <ngx-ds-select
        label="País"
        [options]="countries"
        [floatingLabel]="true"
        errorMessage="Campo obligatorio."
      />
      <ngx-ds-select label="País" [options]="countries" [floatingLabel]="true" [disabled]="true" />
    </div>
  `,
})
class FloatingWrapper {
  countries = COUNTRIES;
}

// ── Sizes ─────────────────────────────────────────────────────
@Component({
  selector: 'sel-sizes-wrapper',
  standalone: true,
  imports: [SelectComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <div>
        <p class="text-xs text-gray-500 mb-1">Small</p>
        <ngx-ds-select label="País" size="sm" [options]="countries" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1">Medium (por defecto)</p>
        <ngx-ds-select label="País" size="md" [options]="countries" />
      </div>
      <div>
        <p class="text-xs text-gray-500 mb-1">Large</p>
        <ngx-ds-select label="País" size="lg" [options]="countries" />
      </div>
    </div>
  `,
})
class SizesWrapper {
  countries = COUNTRIES;
}

// ── Multi Select ──────────────────────────────────────────────
@Component({
  selector: 'sel-multi-wrapper',
  standalone: true,
  imports: [SelectComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">Selección múltiple</p>
      <ngx-ds-select
        label="Tecnologías"
        [options]="skills"
        [multiple]="true"
        placeholder="Elige tus habilidades"
        hint="Puedes seleccionar varias opciones."
        [(value)]="selected"
      />

      <div class="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
        <p class="text-gray-500 text-xs font-medium mb-1">Seleccionados</p>
        @if (selected().length) {
          <p class="text-gray-800">{{ selected().join(', ') }}</p>
        } @else {
          <p class="text-gray-500">Ninguno</p>
        }
      </div>

      <ngx-ds-select
        label="Tecnologías"
        [options]="skills"
        [multiple]="true"
        [floatingLabel]="true"
        placeholder="Floating + multi"
      />
    </div>
  `,
})
class MultiWrapper {
  skills = SKILLS;
  selected = signal<(string | number)[]>([]);
}

// ── Searchable ────────────────────────────────────────────────
@Component({
  selector: 'sel-search-wrapper',
  standalone: true,
  imports: [SelectComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">Búsqueda integrada</p>
      <ngx-ds-select
        label="País"
        [options]="countries"
        [searchable]="true"
        placeholder="Busca un país..."
        hint="Escribe para filtrar opciones."
      />
      <ngx-ds-select
        label="Tecnologías"
        [options]="skills"
        [multiple]="true"
        [searchable]="true"
        placeholder="Busca y selecciona..."
        [floatingLabel]="true"
      />
    </div>
  `,
})
class SearchWrapper {
  countries = COUNTRIES;
  skills = SKILLS;
}

// ── Signal Form ───────────────────────────────────────────────
@Component({
  selector: 'sel-signal-wrapper',
  standalone: true,
  imports: [SelectComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">
        Signal Forms — <code class="text-xs bg-gray-100 px-1 rounded">[(value)]</code>
      </p>

      <ngx-ds-select
        label="País"
        [options]="countries"
        [floatingLabel]="true"
        [(value)]="country"
      />
      <ngx-ds-select
        label="Tecnologías"
        [options]="skills"
        [multiple]="true"
        [searchable]="true"
        [floatingLabel]="true"
        [(value)]="techStack"
      />

      <div class="mt-2 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
        <p class="text-gray-500 text-xs font-medium mb-1">Estado del signal</p>
        <p>
          País: <span class="font-medium text-gray-800">{{ country() ?? '—' }}</span>
        </p>
        <p>
          Stack: <span class="font-medium text-gray-800">{{ stackDisplay() }}</span>
        </p>
      </div>
    </div>
  `,
})
class SignalWrapper {
  countries = COUNTRIES;
  skills = SKILLS;
  country = signal<string | number | null>(null);
  techStack = signal<(string | number)[]>([]);

  stackDisplay = () => {
    const s = this.techStack();
    return Array.isArray(s) && s.length ? (s as string[]).join(', ') : '—';
  };
}

// ── Reactive Form ─────────────────────────────────────────────
@Component({
  selector: 'sel-reactive-wrapper',
  standalone: true,
  imports: [SelectComponent, ReactiveFormsModule],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">
        Reactive Forms — <code class="text-xs bg-gray-100 px-1 rounded">formControlName</code>
      </p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <ngx-ds-select
          label="País"
          [options]="countries"
          [floatingLabel]="true"
          formControlName="country"
          [errorMessage]="countryError()"
        />
        <ngx-ds-select
          label="Tecnologías"
          [options]="skills"
          [multiple]="true"
          [searchable]="true"
          [floatingLabel]="true"
          formControlName="techStack"
          [errorMessage]="stackError()"
        />

        <button
          type="submit"
          class="mt-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md
                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="form.invalid"
        >
          Enviar
        </button>
      </form>

      @if (submitted) {
        <div class="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <p class="text-gray-500 text-xs font-medium mb-1">Valor del formulario</p>
          <p>
            País: <span class="font-medium text-gray-800">{{ form.value.country }}</span>
          </p>
          <p>
            Stack: <span class="font-medium text-gray-800">{{ form.value.techStack }}</span>
          </p>
        </div>
      }
    </div>
  `,
})
class ReactiveWrapper {
  countries = COUNTRIES;
  skills = SKILLS;
  submitted = false;

  form = new FormGroup({
    country: new FormControl(null, Validators.required),
    techStack: new FormControl<(string | number)[]>([], (control) =>
      !control.value || (control.value as []).length === 0 ? { required: true } : null,
    ),
  });

  countryError = () => {
    const c = this.form.get('country');
    return c?.touched && c?.hasError('required') ? 'Selecciona un país.' : '';
  };

  stackError = () => {
    const c = this.form.get('techStack');
    return c?.touched && c?.hasError('required') ? 'Selecciona al menos una tecnología.' : '';
  };

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.submitted = true;
      console.log('Form submitted', this.form.value);
    }
  }
}

// ── Meta ──────────────────────────────────────────────────────
const meta: Meta = { title: 'Molecules/Select' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<sel-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const FloatingLabel: Story = {
  render: () => ({
    template: `<sel-floating-wrapper />`,
    moduleMetadata: { imports: [FloatingWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<sel-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const MultiSelect: Story = {
  render: () => ({
    template: `<sel-multi-wrapper />`,
    moduleMetadata: { imports: [MultiWrapper] },
  }),
};

export const Searchable: Story = {
  render: () => ({
    template: `<sel-search-wrapper />`,
    moduleMetadata: { imports: [SearchWrapper] },
  }),
};

export const SignalForm: Story = {
  render: () => ({
    template: `<sel-signal-wrapper />`,
    moduleMetadata: { imports: [SignalWrapper] },
  }),
};

export const ReactiveForm: Story = {
  render: () => ({
    template: `<sel-reactive-wrapper />`,
    moduleMetadata: { imports: [ReactiveWrapper] },
  }),
};
