import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { TextareaComponent } from '../../../src/lib/molecules/textarea/textarea.component';

// ── Default ───────────────────────────────────────────────────

@Component({
  selector: 'ta-default-wrapper',
  standalone: true,
  imports: [TextareaComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <ngx-ds-textarea label="Descripción" placeholder="Escribe una descripción..." />
      <ngx-ds-textarea
        label="Con hint"
        placeholder="Cuéntanos algo..."
        hint="Máximo 500 caracteres."
      />
      <ngx-ds-textarea
        label="Con error"
        placeholder="Escribe algo..."
        value="texto inválido"
        errorMessage="Este campo no es válido."
      />
      <ngx-ds-textarea
        label="Deshabilitado"
        placeholder="No editable"
        value="Valor inicial"
        [disabled]="true"
      />
      <ngx-ds-textarea label="Solo lectura" value="No se puede modificar." [readonly]="true" />
    </div>
  `,
})
class DefaultWrapper {}

// ── Floating Label ────────────────────────────────────────────

@Component({
  selector: 'ta-floating-wrapper',
  standalone: true,
  imports: [TextareaComponent],
  template: `
    <div class="p-6 flex flex-col gap-6 max-w-sm">
      <p class="text-sm text-gray-500">Haz clic en cada campo para ver el label flotando</p>
      <ngx-ds-textarea label="Descripción" [floatingLabel]="true" placeholder="Escribe aquí..." />
      <ngx-ds-textarea
        label="Con valor inicial"
        [floatingLabel]="true"
        value="Este campo ya tiene contenido"
      />
      <ngx-ds-textarea
        label="Con error"
        [floatingLabel]="true"
        value="texto inválido"
        errorMessage="El formato no es válido."
      />
      <ngx-ds-textarea
        label="Deshabilitado"
        [floatingLabel]="true"
        value="sin editar"
        [disabled]="true"
      />
    </div>
  `,
})
class FloatingWrapper {}

// ── Sizes ─────────────────────────────────────────────────────

@Component({
  selector: 'ta-sizes-wrapper',
  standalone: true,
  imports: [TextareaComponent],
  template: `
    <div class="p-6 flex flex-col gap-5 max-w-sm">
      <div>
        <p class="text-xs text-gray-400 mb-1">Small</p>
        <ngx-ds-textarea label="Small" size="sm" placeholder="Texto pequeño" />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">Medium (por defecto)</p>
        <ngx-ds-textarea label="Medium" size="md" placeholder="Texto medio" />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">Large</p>
        <ngx-ds-textarea label="Large" size="lg" placeholder="Texto grande" />
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── Resize Modes ──────────────────────────────────────────────

@Component({
  selector: 'ta-resize-wrapper',
  standalone: true,
  imports: [TextareaComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <div>
        <p class="text-xs text-gray-400 mb-1">resize="none" — no se puede redimensionar</p>
        <ngx-ds-textarea label="Sin resize" resize="none" placeholder="Tamaño fijo" [rows]="3" />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">resize="vertical" (por defecto)</p>
        <ngx-ds-textarea
          label="Vertical"
          resize="vertical"
          placeholder="Arrastra el borde inferior"
          [rows]="3"
        />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">resize="horizontal"</p>
        <ngx-ds-textarea
          label="Horizontal"
          resize="horizontal"
          placeholder="Arrastra el borde lateral"
          [rows]="3"
        />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-1">resize="both"</p>
        <ngx-ds-textarea
          label="Ambos"
          resize="both"
          placeholder="Arrastra cualquier borde"
          [rows]="3"
        />
      </div>
    </div>
  `,
})
class ResizeWrapper {}

// ── Char Count ────────────────────────────────────────────────

@Component({
  selector: 'ta-count-wrapper',
  standalone: true,
  imports: [TextareaComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">Contador de caracteres</p>
      <ngx-ds-textarea
        label="Bio"
        placeholder="Cuéntanos sobre ti..."
        [maxLength]="150"
        [showCount]="true"
        hint="Escribe una breve descripción."
        [rows]="4"
        [(value)]="bio"
      />
      <ngx-ds-textarea
        label="Mensaje corto"
        placeholder="Máximo 50 caracteres"
        [maxLength]="50"
        [showCount]="true"
        [rows]="2"
        [(value)]="short"
      />
    </div>
  `,
})
class CountWrapper {
  bio = signal('');
  short = signal('');
}

// ── Signal Form ───────────────────────────────────────────────

@Component({
  selector: 'ta-signal-wrapper',
  standalone: true,
  imports: [TextareaComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">
        Signal Forms — <code class="text-xs bg-gray-100 px-1 rounded">[(value)]</code>
      </p>

      <ngx-ds-textarea
        label="Descripción"
        [floatingLabel]="true"
        [(value)]="description"
        placeholder="Describe el proyecto..."
        [rows]="4"
        [maxLength]="200"
        [showCount]="true"
      />
      <ngx-ds-textarea
        label="Notas adicionales"
        [floatingLabel]="true"
        [(value)]="notes"
        placeholder="Opcional..."
        resize="none"
        [rows]="2"
      />

      <div class="mt-2 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
        <p class="text-gray-500 text-xs font-medium mb-1">Estado del signal</p>
        <p>
          Descripción ({{ description().length }} chars):
          <span class="font-medium text-gray-800">{{ description() || '—' }}</span>
        </p>
        <p>
          Notas: <span class="font-medium text-gray-800">{{ notes() || '—' }}</span>
        </p>
      </div>
    </div>
  `,
})
class SignalWrapper {
  description = signal('');
  notes = signal('');
}

// ── Template Form ─────────────────────────────────────────────

@Component({
  selector: 'ta-template-wrapper',
  standalone: true,
  imports: [TextareaComponent, FormsModule],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">
        Template-Driven Forms — <code class="text-xs bg-gray-100 px-1 rounded">[(ngModel)]</code>
      </p>

      <form #myForm="ngForm" (ngSubmit)="onSubmit(myForm.value)" class="flex flex-col gap-4">
        <ngx-ds-textarea
          name="description"
          label="Descripción"
          [floatingLabel]="true"
          [(ngModel)]="model.description"
          placeholder="Describe el proyecto..."
          [rows]="4"
          required
        />
        <ngx-ds-textarea
          name="notes"
          label="Notas"
          [(ngModel)]="model.notes"
          placeholder="Información adicional..."
          resize="none"
          [rows]="2"
        />

        <button
          type="submit"
          class="py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md
                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="myForm.invalid"
        >
          Enviar
        </button>
      </form>

      @if (submitted) {
        <div class="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <p class="text-gray-500 text-xs font-medium mb-1">Valor del modelo</p>
          <p>
            Descripción: <span class="font-medium text-gray-800">{{ model.description }}</span>
          </p>
          <p>
            Notas: <span class="font-medium text-gray-800">{{ model.notes }}</span>
          </p>
        </div>
      }
    </div>
  `,
})
class TemplateWrapper {
  model = { description: '', notes: '' };
  submitted = false;

  onSubmit(value: unknown): void {
    this.submitted = true;
    console.log('Template form submitted', value);
  }
}

// ── Reactive Form ─────────────────────────────────────────────

@Component({
  selector: 'ta-reactive-wrapper',
  standalone: true,
  imports: [TextareaComponent, ReactiveFormsModule],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-sm">
      <p class="text-sm font-medium text-gray-700">
        Reactive Forms — <code class="text-xs bg-gray-100 px-1 rounded">formControlName</code>
      </p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <ngx-ds-textarea
          label="Descripción"
          [floatingLabel]="true"
          formControlName="description"
          placeholder="Mínimo 10 caracteres..."
          [rows]="4"
          [maxLength]="300"
          [showCount]="true"
          [errorMessage]="descriptionError()"
        />
        <ngx-ds-textarea
          label="Comentarios"
          [floatingLabel]="true"
          formControlName="comments"
          placeholder="Opcional..."
          resize="none"
          [rows]="3"
        />

        <button
          type="submit"
          class="py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md
                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="form.invalid"
        >
          Guardar
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
class ReactiveWrapper {
  submitted = false;

  form = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    comments: new FormControl(''),
  });

  descriptionError = () => {
    const c = this.form.get('description');
    if (!c?.touched) return '';
    if (c.hasError('required')) return 'La descripción es obligatoria.';
    if (c.hasError('minlength')) return 'Mínimo 10 caracteres.';
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

// ── Meta ──────────────────────────────────────────────────────

const meta: Meta = { title: 'Molecules/Textarea' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<ta-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const FloatingLabel: Story = {
  render: () => ({
    template: `<ta-floating-wrapper />`,
    moduleMetadata: { imports: [FloatingWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({ template: `<ta-sizes-wrapper />`, moduleMetadata: { imports: [SizesWrapper] } }),
};

export const ResizeModes: Story = {
  render: () => ({
    template: `<ta-resize-wrapper />`,
    moduleMetadata: { imports: [ResizeWrapper] },
  }),
};

export const CharCount: Story = {
  render: () => ({ template: `<ta-count-wrapper />`, moduleMetadata: { imports: [CountWrapper] } }),
};

export const SignalForm: Story = {
  render: () => ({
    template: `<ta-signal-wrapper />`,
    moduleMetadata: { imports: [SignalWrapper] },
  }),
};

export const TemplateForm: Story = {
  render: () => ({
    template: `<ta-template-wrapper />`,
    moduleMetadata: { imports: [TemplateWrapper] },
  }),
};

export const ReactiveForm: Story = {
  render: () => ({
    template: `<ta-reactive-wrapper />`,
    moduleMetadata: { imports: [ReactiveWrapper] },
  }),
};
