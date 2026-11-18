import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, minLength } from '@angular/forms/signals';
import { TagInputComponent } from '../../../src/lib/molecules/tag-input/tag-input.component';

// ── Default ───────────────────────────────────────────────────

@Component({
  selector: 'ti-default-wrapper',
  standalone: true,
  imports: [TagInputComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-md">
      <ngx-ds-tag-input
        label="Etiquetas"
        placeholder="Escribe y pulsa Enter o coma"
        hint="Pega una lista separada por comas para añadir varias a la vez."
        [(value)]="tags"
        (added)="log('añadida: ' + $event)"
        (removed)="log('eliminada: ' + $event)"
      />
      <p class="text-sm text-gray-500">Valor: {{ tags().join(' · ') || '—' }}</p>
      <p class="text-xs text-gray-500">Último evento: {{ last() }}</p>
    </div>
  `,
})
class DefaultWrapper {
  tags = signal(['angular', 'signals', 'design-system']);
  last = signal('—');
  log(text: string) {
    this.last.set(text);
  }
}

// ── Max tags / duplicates / separators ────────────────────────

@Component({
  selector: 'ti-options-wrapper',
  standalone: true,
  imports: [TagInputComponent],
  template: `
    <div class="p-6 flex flex-col gap-6 max-w-md">
      <ngx-ds-tag-input
        label="Hasta 3 etiquetas"
        placeholder="Máximo 3"
        [maxTags]="3"
        [hint]="limited().length + ' / 3'"
        [(value)]="limited"
      />
      <ngx-ds-tag-input label="Con duplicados" [allowDuplicates]="true" [value]="['a', 'a', 'b']" />
      <ngx-ds-tag-input
        label="Separadas por espacio o punto y coma"
        placeholder="Espacio, ; o Enter"
        [separators]="['Enter', ' ', ';']"
      />
    </div>
  `,
})
class OptionsWrapper {
  limited = signal(['uno', 'dos']);
}

// ── Sizes / states ────────────────────────────────────────────

@Component({
  selector: 'ti-states-wrapper',
  standalone: true,
  imports: [TagInputComponent, ReactiveFormsModule],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-md">
      <ngx-ds-tag-input size="sm" label="Small" [value]="['sm']" />
      <ngx-ds-tag-input size="md" label="Medium" [value]="['md']" />
      <ngx-ds-tag-input size="lg" label="Large" [value]="['lg']" />
      <ngx-ds-tag-input
        label="Con error"
        errorMessage="Añade al menos una etiqueta."
        placeholder="Etiquetas"
      />
      <ngx-ds-tag-input label="Deshabilitado" [formControl]="disabledCtrl" />
    </div>
  `,
})
class StatesWrapper {
  disabledCtrl = new FormControl({ value: ['bloqueada', 'solo lectura'], disabled: true });
}

// ── Signal Forms ──────────────────────────────────────────────

@Component({
  selector: 'ti-signal-wrapper',
  standalone: true,
  imports: [TagInputComponent, FormField, JsonPipe],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-md">
      <p class="text-sm font-medium text-gray-700">
        Signal Forms — <code class="text-xs bg-gray-100 px-1 rounded">[formField]</code>
      </p>
      <ngx-ds-tag-input label="Habilidades" placeholder="Mínimo 2" [formField]="f.skills" />
      <div class="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
        <pre class="text-xs">{{ model() | json }}</pre>
        <p class="text-xs">Válido: {{ f().valid() ? 'sí' : 'no' }}</p>
      </div>
    </div>
  `,
})
class SignalWrapper {
  model = signal({ skills: [] as string[] });
  f = form(this.model, (p) => {
    minLength(p.skills, 2, { message: 'Añade al menos 2 habilidades' });
  });
}

// ── Meta ──────────────────────────────────────────────────────

const meta: Meta = { title: 'Molecules/TagInput' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<ti-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const Options: Story = {
  render: () => ({
    template: `<ti-options-wrapper />`,
    moduleMetadata: { imports: [OptionsWrapper] },
  }),
};

export const SizesAndStates: Story = {
  render: () => ({
    template: `<ti-states-wrapper />`,
    moduleMetadata: { imports: [StatesWrapper] },
  }),
};

export const SignalForm: Story = {
  render: () => ({
    template: `<ti-signal-wrapper />`,
    moduleMetadata: { imports: [SignalWrapper] },
  }),
};
