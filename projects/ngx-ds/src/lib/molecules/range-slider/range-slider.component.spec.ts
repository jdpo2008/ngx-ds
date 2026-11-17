import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RangeSliderComponent } from './range-slider.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

describe('RangeSliderComponent outputs', () => {
  it('moving the thumb emits valueChange', () => {
    const fixture = TestBed.createComponent(RangeSliderComponent);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const values: number[] = [];
    cmp.value.subscribe((v) => values.push(v)); // the model's (valueChange) output

    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="range"]',
    ) as HTMLInputElement;
    input.value = '42';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(cmp.value()).toBe(42);
    expect(values).toEqual([42]);
  });
});

@Component({
  standalone: true,
  imports: [RangeSliderComponent, ReactiveFormsModule],
  template: `
    <ngx-ds-range-slider [formControl]="single" />
    <ngx-ds-range-slider [range]="true" [minGap]="5" [formControl]="pair" />
  `,
})
class FormsHost {
  single = new FormControl(30, { nonNullable: true });
  pair = new FormControl<[number, number]>([20, 80], { nonNullable: true });
}

describe('RangeSliderComponent forms integration', () => {
  function setup() {
    const fixture = TestBed.createComponent(FormsHost);
    fixture.detectChanges();
    const inputs = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('input[type="range"]'),
    ) as HTMLInputElement[];
    return { fixture, host: fixture.componentInstance, inputs };
  }

  function slide(input: HTMLInputElement, value: number): void {
    input.value = String(value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  it('renders the initial control values', () => {
    const { inputs } = setup();
    expect(inputs.map((i) => Number(i.value))).toEqual([30, 20, 80]);
  });

  it('reflects values written to the controls', () => {
    const { fixture, host, inputs } = setup();
    host.single.setValue(55);
    host.pair.setValue([10, 40]);
    fixture.detectChanges();
    expect(inputs.map((i) => Number(i.value))).toEqual([55, 10, 40]);
  });

  it('updates the single control when the thumb moves', () => {
    const { host, inputs } = setup();
    slide(inputs[0], 70);
    expect(host.single.value).toBe(70);
    expect(host.single.dirty).toBe(true);
  });

  it('updates the range control and respects minGap', () => {
    const { host, inputs } = setup();
    slide(inputs[1], 90);
    expect(host.pair.value).toEqual([75, 80]);
    slide(inputs[2], 95);
    expect(host.pair.value).toEqual([75, 95]);
  });

  it('marks touched on blur and disables with the control', () => {
    const { fixture, host, inputs } = setup();
    inputs[0].dispatchEvent(new Event('blur'));
    expect(host.single.touched).toBe(true);

    host.pair.disable();
    fixture.detectChanges();
    expect(inputs[1].disabled).toBe(true);
    expect(inputs[2].disabled).toBe(true);
    expect(inputs[0].disabled).toBe(false);
  });
});
