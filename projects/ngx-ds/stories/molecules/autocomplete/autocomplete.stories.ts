import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Search, MapPin, User } from 'lucide-angular';
import {
  AutocompleteComponent,
  AutocompleteOption,
} from '../../../src/lib/molecules/autocomplete/autocomplete.component';

// ── Shared data ───────────────────────────────────────────────

const COUNTRIES: AutocompleteOption[] = [
  { value: 'ar', label: 'Argentina' },
  { value: 'bo', label: 'Bolivia' },
  { value: 'br', label: 'Brasil' },
  { value: 'cl', label: 'Chile' },
  { value: 'co', label: 'Colombia' },
  { value: 'cr', label: 'Costa Rica' },
  { value: 'cu', label: 'Cuba' },
  { value: 'ec', label: 'Ecuador' },
  { value: 'sv', label: 'El Salvador' },
  { value: 'es', label: 'España' },
  { value: 'gt', label: 'Guatemala' },
  { value: 'hn', label: 'Honduras' },
  { value: 'mx', label: 'México' },
  { value: 'ni', label: 'Nicaragua' },
  { value: 'pa', label: 'Panamá' },
  { value: 'py', label: 'Paraguay' },
  { value: 'pe', label: 'Perú' },
  { value: 'do', label: 'República Dominicana' },
  { value: 'uy', label: 'Uruguay' },
  { value: 've', label: 'Venezuela' },
];

const CITIES: AutocompleteOption[] = [
  { value: 1, label: 'Madrid' },
  { value: 2, label: 'Barcelona' },
  { value: 3, label: 'Buenos Aires' },
  { value: 4, label: 'Ciudad de México' },
  { value: 5, label: 'Bogotá' },
  { value: 6, label: 'Lima' },
  { value: 7, label: 'Santiago de Chile' },
  { value: 8, label: 'Montevideo' },
  { value: 9, label: 'Caracas', disabled: true },
  { value: 10, label: 'La Habana', disabled: true },
];

// ── Default ───────────────────────────────────────────────────

@Component({
  selector: 'ac-default-wrapper',
  standalone: true,
  imports: [AutocompleteComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <ngx-ds-autocomplete
        label="País"
        [options]="countries"
        placeholder="Escribe para buscar..."
      />
      <ngx-ds-autocomplete
        label="Con hint"
        [options]="countries"
        placeholder="Escribe para buscar..."
        hint="Empieza a escribir el nombre del país."
      />
      <ngx-ds-autocomplete
        label="Con error"
        [options]="countries"
        placeholder="Escribe para buscar..."
        errorMessage="Debes seleccionar un país."
      />
      <ngx-ds-autocomplete
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
  selector: 'ac-floating-wrapper',
  standalone: true,
  imports: [AutocompleteComponent],
  template: `
    <div class="p-6 flex flex-col gap-6 max-w-sm">
      <p class="text-sm text-gray-500">Haz clic para ver el label flotando</p>
      <ngx-ds-autocomplete
        label="País"
        [options]="countries"
        [floatingLabel]="true"
        placeholder="Escribe para buscar..."
      />
      <ngx-ds-autocomplete
        label="Ciudad"
        [options]="cities"
        [floatingLabel]="true"
        [iconLeft]="mapIcon"
        placeholder="Ciudad de origen..."
      />
      <ngx-ds-autocomplete
        label="Con error"
        [options]="countries"
        [floatingLabel]="true"
        errorMessage="Selecciona una opción válida."
      />
    </div>
  `,
})
class FloatingWrapper {
  countries = COUNTRIES;
  cities = CITIES;
  mapIcon = MapPin;
}

// ── Show All On Focus ─────────────────────────────────────────

@Component({
  selector: 'ac-showall-wrapper',
  standalone: true,
  imports: [AutocompleteComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">showAllOnFocus — comportamiento tipo combo</p>
      <p class="text-xs text-gray-500">
        Haz clic en el campo sin escribir y verás todas las opciones
      </p>
      <ngx-ds-autocomplete
        label="País"
        [options]="countries"
        [showAllOnFocus]="true"
        placeholder="Haz clic o escribe..."
        hint="Se muestran todas las opciones al enfocar."
      />
      <ngx-ds-autocomplete
        label="Ciudad"
        [options]="cities"
        [floatingLabel]="true"
        [showAllOnFocus]="true"
        placeholder="Selecciona o escribe..."
      />
    </div>
  `,
})
class ShowAllWrapper {
  countries = COUNTRIES;
  cities = CITIES;
}

// ── Sizes ─────────────────────────────────────────────────────

@Component({
  selector: 'ac-sizes-wrapper',
  standalone: true,
  imports: [AutocompleteComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <div>
        <p class="text-xs text-gray-400 mb-1">Small</p>
        <ngx-ds-autocomplete label="País" size="sm" [options]="countries" placeholder="Buscar..." />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">Medium (por defecto)</p>
        <ngx-ds-autocomplete label="País" size="md" [options]="countries" placeholder="Buscar..." />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">Large</p>
        <ngx-ds-autocomplete label="País" size="lg" [options]="countries" placeholder="Buscar..." />
      </div>
    </div>
  `,
})
class SizesWrapper {
  countries = COUNTRIES;
}

// ── Async Search ──────────────────────────────────────────────

@Component({
  selector: 'ac-async-wrapper',
  standalone: true,
  imports: [AutocompleteComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">Búsqueda asíncrona</p>
      <p class="text-xs text-gray-500">
        Simula una llamada HTTP con 600ms de delay. Escribe al menos 2 caracteres.
      </p>

      <ngx-ds-autocomplete
        label="Usuario"
        [options]="results()"
        [loading]="searching()"
        [floatingLabel]="true"
        [iconLeft]="userIcon"
        [minChars]="2"
        [debounceMs]="400"
        placeholder="Busca un usuario..."
        hint="Prueba: 'ana', 'car', 'luc', 'mar'"
        (searchChange)="onSearch($event)"
        [(value)]="selected"
      />

      @if (selected()) {
        <div class="p-3 bg-gray-50 rounded-lg text-sm">
          <p class="text-gray-500 text-xs font-medium mb-1">Seleccionado</p>
          <p class="text-gray-800 font-medium">ID: {{ selected() }}</p>
        </div>
      }
    </div>
  `,
})
class AsyncWrapper {
  userIcon = User;
  results = signal<AutocompleteOption[]>([]);
  searching = signal(false);
  selected = signal<string | number | null>(null);

  private readonly DB: AutocompleteOption[] = [
    { value: 1, label: 'Ana García' },
    { value: 2, label: 'Ana Martínez' },
    { value: 3, label: 'Carlos López' },
    { value: 4, label: 'Carlos Ruiz' },
    { value: 5, label: 'Lucía Fernández' },
    { value: 6, label: 'Lucía Pérez' },
    { value: 7, label: 'María González' },
    { value: 8, label: 'María Sánchez' },
    { value: 9, label: 'Pedro Alonso' },
    { value: 10, label: 'Pedro Navarro' },
  ];

  onSearch(query: string): void {
    if (query.length < 2) {
      this.results.set([]);
      return;
    }
    this.searching.set(true);
    this.results.set([]);
    setTimeout(() => {
      const q = query.toLowerCase();
      this.results.set(this.DB.filter((u) => u.label.toLowerCase().includes(q)));
      this.searching.set(false);
    }, 600);
  }
}

// ── Signal Form ───────────────────────────────────────────────

@Component({
  selector: 'ac-signal-wrapper',
  standalone: true,
  imports: [AutocompleteComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">
        Signal Forms — <code class="text-xs bg-gray-100 px-1 rounded">[(value)]</code>
      </p>

      <ngx-ds-autocomplete
        label="País"
        [options]="countries"
        [floatingLabel]="true"
        [(value)]="country"
        placeholder="Escribe para buscar..."
      />
      <ngx-ds-autocomplete
        label="Ciudad"
        [options]="cities"
        [floatingLabel]="true"
        [iconLeft]="mapIcon"
        [(value)]="city"
        placeholder="Escribe para buscar..."
        [showAllOnFocus]="true"
      />

      <div class="mt-2 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
        <p class="text-gray-500 text-xs font-medium mb-1">Estado del signal</p>
        <p>
          País: <span class="font-medium text-gray-800">{{ country() ?? '—' }}</span>
        </p>
        <p>
          Ciudad: <span class="font-medium text-gray-800">{{ city() ?? '—' }}</span>
        </p>
      </div>
    </div>
  `,
})
class SignalWrapper {
  countries = COUNTRIES;
  cities = CITIES;
  mapIcon = MapPin;
  country = signal<string | number | null>(null);
  city = signal<string | number | null>(null);
}

// ── Template Form ─────────────────────────────────────────────

@Component({
  selector: 'ac-template-wrapper',
  standalone: true,
  imports: [AutocompleteComponent, FormsModule],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">
        Template-Driven Forms — <code class="text-xs bg-gray-100 px-1 rounded">[(ngModel)]</code>
      </p>

      <form #myForm="ngForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <ngx-ds-autocomplete
          name="country"
          label="País de origen"
          [options]="countries"
          [floatingLabel]="true"
          [(ngModel)]="model.country"
          placeholder="Busca un país..."
          required
        />
        <ngx-ds-autocomplete
          name="city"
          label="Ciudad"
          [options]="cities"
          [floatingLabel]="true"
          [iconLeft]="mapIcon"
          [(ngModel)]="model.city"
          [showAllOnFocus]="true"
          placeholder="Elige una ciudad..."
        />

        <button
          type="submit"
          class="py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md
                 hover:bg-blue-700 disabled:opacity-50"
          [disabled]="myForm.invalid"
        >
          Enviar
        </button>
      </form>

      @if (submitted) {
        <div class="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <p class="text-gray-500 text-xs font-medium mb-1">Modelo</p>
          <p>
            País: <span class="font-medium text-gray-800">{{ model.country }}</span>
          </p>
          <p>
            Ciudad: <span class="font-medium text-gray-800">{{ model.city }}</span>
          </p>
        </div>
      }
    </div>
  `,
})
class TemplateWrapper {
  countries = COUNTRIES;
  cities = CITIES;
  mapIcon = MapPin;
  model = { country: null as string | number | null, city: null as string | number | null };
  submitted = false;
  onSubmit(): void {
    this.submitted = true;
  }
}

// ── Reactive Form ─────────────────────────────────────────────

@Component({
  selector: 'ac-reactive-wrapper',
  standalone: true,
  imports: [AutocompleteComponent, ReactiveFormsModule],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">
        Reactive Forms — <code class="text-xs bg-gray-100 px-1 rounded">formControlName</code>
      </p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <ngx-ds-autocomplete
          label="País"
          [options]="countries"
          [floatingLabel]="true"
          formControlName="country"
          placeholder="Busca un país..."
          [errorMessage]="countryError()"
        />
        <ngx-ds-autocomplete
          label="Ciudad"
          [options]="cities"
          [floatingLabel]="true"
          [iconLeft]="mapIcon"
          formControlName="city"
          [showAllOnFocus]="true"
          placeholder="Elige una ciudad..."
          [errorMessage]="cityError()"
        />

        <button
          type="submit"
          class="py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md
                 hover:bg-blue-700 disabled:opacity-50"
          [disabled]="form.invalid"
        >
          Guardar
        </button>
      </form>

      @if (submitted) {
        <div class="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <p class="text-gray-500 text-xs font-medium mb-1">Formulario</p>
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
class ReactiveWrapper {
  countries = COUNTRIES;
  cities = CITIES;
  mapIcon = MapPin;
  submitted = false;

  form = new FormGroup({
    country: new FormControl<string | number | null>(null, Validators.required),
    city: new FormControl<string | number | null>(null, Validators.required),
  });

  countryError = () => {
    const c = this.form.get('country');
    return c?.touched && c?.hasError('required') ? 'Selecciona un país.' : '';
  };

  cityError = () => {
    const c = this.form.get('city');
    return c?.touched && c?.hasError('required') ? 'Selecciona una ciudad.' : '';
  };

  formEntries = () => Object.entries(this.form.value).map(([key, value]) => ({ key, value }));

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.submitted = true;
      console.log('Autocomplete form submitted', this.form.value);
    }
  }
}

// ── Meta ──────────────────────────────────────────────────────

const meta: Meta = { title: 'Molecules/Autocomplete' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<ac-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const FloatingLabel: Story = {
  render: () => ({
    template: `<ac-floating-wrapper />`,
    moduleMetadata: { imports: [FloatingWrapper] },
  }),
};

export const ShowAllOnFocus: Story = {
  render: () => ({
    template: `<ac-showall-wrapper />`,
    moduleMetadata: { imports: [ShowAllWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({ template: `<ac-sizes-wrapper />`, moduleMetadata: { imports: [SizesWrapper] } }),
};

export const AsyncSearch: Story = {
  render: () => ({ template: `<ac-async-wrapper />`, moduleMetadata: { imports: [AsyncWrapper] } }),
};

export const SignalForm: Story = {
  render: () => ({
    template: `<ac-signal-wrapper />`,
    moduleMetadata: { imports: [SignalWrapper] },
  }),
};

export const TemplateForm: Story = {
  render: () => ({
    template: `<ac-template-wrapper />`,
    moduleMetadata: { imports: [TemplateWrapper] },
  }),
};

export const ReactiveForm: Story = {
  render: () => ({
    template: `<ac-reactive-wrapper />`,
    moduleMetadata: { imports: [ReactiveWrapper] },
  }),
};
