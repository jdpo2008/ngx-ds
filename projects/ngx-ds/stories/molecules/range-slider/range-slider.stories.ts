import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  RangeSliderComponent,
  SliderColor,
} from '../../../src/lib/molecules/range-slider/range-slider.component';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'slider-basic-wrapper',
  standalone: true,
  imports: [RangeSliderComponent],
  template: `
    <div class="p-6" style="max-width: 28rem;">
      <ngx-ds-range-slider
        label="Precio máximo"
        [min]="0"
        [max]="1000"
        [step]="10"
        [(value)]="price"
        [showMinMax]="true"
      />
      <p class="text-xs text-gray-400 mt-3">Precio seleccionado: \${{ price }}</p>
    </div>
  `,
})
class BasicWrapper {
  price = 200;
}

// ── Colors Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'slider-colors-wrapper',
  standalone: true,
  imports: [RangeSliderComponent],
  template: `
    <div class="p-6" style="max-width: 28rem; display: flex; flex-direction: column; gap: 1.5rem;">
      <ngx-ds-range-slider label="Primary" color="primary" [value]="70" />
      <ngx-ds-range-slider label="Secondary" color="secondary" [value]="50" />
      <ngx-ds-range-slider label="Success" color="success" [value]="85" />
      <ngx-ds-range-slider label="Warning" color="warning" [value]="40" />
      <ngx-ds-range-slider label="Danger" color="danger" [value]="25" />
    </div>
  `,
})
class ColorsWrapper {}

// ── Options Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'slider-options-wrapper',
  standalone: true,
  imports: [RangeSliderComponent],
  template: `
    <div class="p-6" style="max-width: 28rem; display: flex; flex-direction: column; gap: 1.5rem;">
      <div>
        <p class="text-xs text-gray-400 mb-2">Con mín/máx</p>
        <ngx-ds-range-slider [showMinMax]="true" [value]="50" />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-2">Sin valor</p>
        <ngx-ds-range-slider [showValue]="false" [value]="30" />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-2">Con paso de 10</p>
        <ngx-ds-range-slider [step]="10" [value]="40" [showMinMax]="true" />
      </div>
      <div>
        <p class="text-xs text-gray-400 mb-2">Deshabilitado</p>
        <ngx-ds-range-slider [disabled]="true" [value]="60" />
      </div>
    </div>
  `,
})
class OptionsWrapper {}

// ── Dual Wrapper ──────────────────────────────────────────────────────────────

@Component({
  selector: 'slider-dual-wrapper',
  standalone: true,
  imports: [RangeSliderComponent],
  template: `
    <div class="p-6" style="max-width: 28rem;">
      <ngx-ds-range-slider
        [range]="true"
        label="Rango de precio"
        [min]="0"
        [max]="1000"
        [step]="10"
        [(values)]="priceRange"
        [showMinMax]="true"
      />
      <p class="text-xs text-gray-400 mt-3">Rango: \${{ priceRange[0] }} – \${{ priceRange[1] }}</p>
    </div>
  `,
})
class DualWrapper {
  priceRange: [number, number] = [200, 700];
}

// ── Dual With MinGap Wrapper ──────────────────────────────────────────────────

@Component({
  selector: 'slider-dual-mingap-wrapper',
  standalone: true,
  imports: [RangeSliderComponent],
  template: `
    <div class="p-6" style="max-width: 28rem;">
      <ngx-ds-range-slider
        [range]="true"
        label="Rango de edad (separación mínima de 10 años)"
        [min]="0"
        [max]="100"
        [minGap]="10"
        [(values)]="ageRange"
        [showMinMax]="true"
        color="success"
      />
      <p class="text-xs text-gray-400 mt-3">Rango: {{ ageRange[0] }} – {{ ageRange[1] }} años</p>
    </div>
  `,
})
class DualMinGapWrapper {
  ageRange: [number, number] = [25, 45];
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/RangeSlider',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    value: 30,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    label: 'Volumen',
    showValue: true,
    showMinMax: false,
    color: 'primary' as SliderColor,
  },
  argTypes: {
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    showValue: { control: 'boolean' },
    showMinMax: { control: 'boolean' },
    color: {
      control: 'radio',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 1.5rem; max-width: 28rem;">
        <ngx-ds-range-slider
          [value]="value"
          [min]="min"
          [max]="max"
          [step]="step"
          [disabled]="disabled"
          [label]="label"
          [showValue]="showValue"
          [showMinMax]="showMinMax"
          [color]="color"
        />
      </div>
    `,
    moduleMetadata: { imports: [RangeSliderComponent] },
  }),
};

export const WithBounds: Story = {
  render: () => ({
    template: `<slider-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `<slider-colors-wrapper />`,
    moduleMetadata: { imports: [ColorsWrapper] },
  }),
};

export const Options: Story = {
  render: () => ({
    template: `<slider-options-wrapper />`,
    moduleMetadata: { imports: [OptionsWrapper] },
  }),
};

export const Dual: Story = {
  render: () => ({
    template: `<slider-dual-wrapper />`,
    moduleMetadata: { imports: [DualWrapper] },
  }),
};

export const DualConMinGap: Story = {
  render: () => ({
    template: `<slider-dual-mingap-wrapper />`,
    moduleMetadata: { imports: [DualMinGapWrapper] },
  }),
};

// ── Reactive Forms ────────────────────────────────────────────────────────────

@Component({
  selector: 'slider-forms-wrapper',
  standalone: true,
  imports: [RangeSliderComponent, ReactiveFormsModule],
  template: `
    <div class="p-6 space-y-6" style="max-width: 420px">
      <ngx-ds-range-slider label="Volumen" [formControl]="volume" />
      <ngx-ds-range-slider label="Precio" [range]="true" [minGap]="10" [formControl]="price" />
      <p class="text-sm text-gray-500">
        volume: <code>{{ volume.value }}</code> · price: <code>{{ price.value }}</code>
      </p>
      <div class="flex gap-2">
        <button type="button" (click)="volume.setValue(75); price.setValue([200, 600])">
          Set values
        </button>
        <button type="button" (click)="toggle()">Toggle disabled</button>
      </div>
    </div>
  `,
})
class SliderFormsWrapper {
  volume = new FormControl(40, { nonNullable: true });
  price = new FormControl<[number, number]>([20, 80], { nonNullable: true });

  toggle(): void {
    for (const c of [this.volume, this.price]) {
      if (c.disabled) c.enable();
      else c.disable();
    }
  }
}

export const ReactiveForms: Story = {
  render: () => ({
    template: `<slider-forms-wrapper />`,
    moduleMetadata: { imports: [SliderFormsWrapper] },
  }),
};
