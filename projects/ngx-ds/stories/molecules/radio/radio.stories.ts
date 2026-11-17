import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioComponent } from '../../../src/lib/molecules/radio/radio.component';

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'radio-default-wrapper',
  standalone: true,
  imports: [RadioComponent],
  template: `
    <div class="p-6 space-y-3">
      <ngx-ds-radio
        name="demo"
        value="a"
        label="Opción A"
        (valueSelect)="select('a')"
        [checked]="selected() === 'a'"
      />
      <ngx-ds-radio
        name="demo"
        value="b"
        label="Opción B"
        (valueSelect)="select('b')"
        [checked]="selected() === 'b'"
      />
      <ngx-ds-radio
        name="demo"
        value="c"
        label="Opción C"
        (valueSelect)="select('c')"
        [checked]="selected() === 'c'"
      />
      <p class="text-xs text-gray-400 mt-2">Seleccionado: {{ selected() }}</p>
    </div>
  `,
})
class DefaultWrapper {
  selected = signal('b');
  select(v: string): void {
    this.selected.set(v);
  }
}

// ── Colors Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'radio-colors-wrapper',
  standalone: true,
  imports: [RadioComponent],
  template: `
    <div class="p-6 space-y-3">
      <ngx-ds-radio name="col" value="primary" label="Primary" color="primary" [checked]="true" />
      <ngx-ds-radio name="col" value="secondary" label="Secondary" color="secondary" />
      <ngx-ds-radio name="col" value="danger" label="Danger" color="danger" />
      <ngx-ds-radio name="col" value="success" label="Success" color="success" />
      <ngx-ds-radio name="col" value="warning" label="Warning" color="warning" />
    </div>
  `,
})
class ColorsWrapper {}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'radio-sizes-wrapper',
  standalone: true,
  imports: [RadioComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Marcado</p>
        <div class="flex items-center gap-6">
          <ngx-ds-radio name="sz-chk" value="sm" label="Small" size="sm" [checked]="true" />
          <ngx-ds-radio name="sz-chk" value="md" label="Medium" size="md" [checked]="true" />
          <ngx-ds-radio name="sz-chk" value="lg" label="Large" size="lg" [checked]="true" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Sin marcar</p>
        <div class="flex items-center gap-6">
          <ngx-ds-radio name="sz-unchk" value="sm" label="Small" size="sm" />
          <ngx-ds-radio name="sz-unchk" value="md" label="Medium" size="md" />
          <ngx-ds-radio name="sz-unchk" value="lg" label="Large" size="lg" />
        </div>
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── Label Position Wrapper ────────────────────────────────────────────────────

@Component({
  selector: 'radio-label-pos-wrapper',
  standalone: true,
  imports: [RadioComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Etiqueta a la derecha (por defecto)</p>
        <div class="space-y-2">
          <ngx-ds-radio
            name="lp-r"
            value="a"
            label="Opción A"
            labelPosition="right"
            [checked]="true"
          />
          <ngx-ds-radio name="lp-r" value="b" label="Opción B" labelPosition="right" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Etiqueta a la izquierda</p>
        <div class="space-y-2">
          <ngx-ds-radio
            name="lp-l"
            value="a"
            label="Opción A"
            labelPosition="left"
            [checked]="true"
          />
          <ngx-ds-radio name="lp-l" value="b" label="Opción B" labelPosition="left" />
        </div>
      </div>
    </div>
  `,
})
class LabelPositionWrapper {}

// ── Horizontal Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'radio-horizontal-wrapper',
  standalone: true,
  imports: [RadioComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-3">Distribución horizontal</p>
      <div class="flex flex-wrap gap-4">
        <ngx-ds-radio
          name="h"
          value="pequeno"
          label="Pequeño"
          (valueSelect)="size.set('pequeno')"
          [checked]="size() === 'pequeno'"
        />
        <ngx-ds-radio
          name="h"
          value="mediano"
          label="Mediano"
          (valueSelect)="size.set('mediano')"
          [checked]="size() === 'mediano'"
        />
        <ngx-ds-radio
          name="h"
          value="grande"
          label="Grande"
          (valueSelect)="size.set('grande')"
          [checked]="size() === 'grande'"
        />
        <ngx-ds-radio
          name="h"
          value="xlarge"
          label="X-Large"
          (valueSelect)="size.set('xlarge')"
          [checked]="size() === 'xlarge'"
        />
      </div>
      <p class="text-xs text-gray-400">Talla seleccionada: {{ size() }}</p>
    </div>
  `,
})
class HorizontalWrapper {
  size = signal('mediano');
}

// ── Interactive Wrapper ───────────────────────────────────────────────────────

@Component({
  selector: 'radio-interactive-wrapper',
  standalone: true,
  imports: [RadioComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Plan de suscripción</p>
        <div class="space-y-2">
          @for (plan of plans; track plan.value) {
            <ngx-ds-radio
              name="plan"
              [value]="plan.value"
              [label]="plan.label"
              color="primary"
              (valueSelect)="selectedPlan.set(plan.value)"
              [checked]="selectedPlan() === plan.value"
            />
          }
        </div>
        <p class="text-xs text-gray-400 mt-3">
          Plan seleccionado: <strong>{{ selectedPlanLabel() }}</strong>
        </p>
      </div>
    </div>
  `,
})
class InteractiveWrapper {
  plans = [
    { value: 'free', label: 'Gratuito — 0 €/mes' },
    { value: 'pro', label: 'Pro — 9 €/mes' },
    { value: 'enterprise', label: 'Enterprise — contactar' },
  ];

  selectedPlan = signal('pro');
  selectedPlanLabel = computed(
    () => this.plans.find((p) => p.value === this.selectedPlan())?.label ?? '',
  );
}

// ── ngModel Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'radio-ngmodel-wrapper',
  standalone: true,
  imports: [RadioComponent, FormsModule],
  template: `
    <div class="p-6 space-y-3">
      <p class="text-sm text-gray-500 mb-2">Grupo enlazado con [(ngModel)]</p>
      @for (opt of options; track opt) {
        <ngx-ds-radio name="ngm" [value]="opt" [label]="opt" [(ngModel)]="choice" />
      }
      <p class="text-xs text-gray-400 mt-2">Seleccionado: {{ choice }}</p>
    </div>
  `,
})
class NgModelWrapper {
  options = ['Email', 'SMS', 'Push'];
  choice = 'SMS';
}

// ── States Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'radio-states-wrapper',
  standalone: true,
  imports: [RadioComponent],
  template: `
    <div class="p-6 space-y-3">
      <p class="text-sm text-gray-500 mb-2">Estados</p>
      <ngx-ds-radio name="st" value="a" label="Sin seleccionar" />
      <ngx-ds-radio name="st" value="b" label="Seleccionado" [checked]="true" />
      <ngx-ds-radio name="st2" value="c" label="Deshabilitado sin seleccionar" [disabled]="true" />
      <ngx-ds-radio
        name="st2"
        value="d"
        label="Deshabilitado seleccionado"
        [checked]="true"
        [disabled]="true"
      />
    </div>
  `,
})
class StatesWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/Radio',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<radio-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `<radio-colors-wrapper />`,
    moduleMetadata: { imports: [ColorsWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<radio-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const LabelPosition: Story = {
  render: () => ({
    template: `<radio-label-pos-wrapper />`,
    moduleMetadata: { imports: [LabelPositionWrapper] },
  }),
};

export const Horizontal: Story = {
  render: () => ({
    template: `<radio-horizontal-wrapper />`,
    moduleMetadata: { imports: [HorizontalWrapper] },
  }),
};

export const Interactive: Story = {
  render: () => ({
    template: `<radio-interactive-wrapper />`,
    moduleMetadata: { imports: [InteractiveWrapper] },
  }),
};

export const WithNgModel: Story = {
  render: () => ({
    template: `<radio-ngmodel-wrapper />`,
    moduleMetadata: { imports: [NgModelWrapper] },
  }),
};

export const States: Story = {
  render: () => ({
    template: `<radio-states-wrapper />`,
    moduleMetadata: { imports: [StatesWrapper] },
  }),
};
