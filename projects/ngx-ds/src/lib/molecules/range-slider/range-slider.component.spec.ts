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

describe('RangeSliderComponent behaviour', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(RangeSliderComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const thumbs = () => Array.from(el.querySelectorAll<HTMLInputElement>('input[type="range"]'));
    const slide = (input: HTMLInputElement, value: number) => {
      input.value = String(value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
    };
    return { fixture, cmp: fixture.componentInstance, el, thumbs, slide };
  }

  it('names the single slider with its label', () => {
    const { el, thumbs } = setup({ label: 'Volumen' });
    const labelId = thumbs()[0].getAttribute('aria-labelledby')!;
    expect(el.querySelector(`#${labelId}`)!.textContent).toContain('Volumen');
  });

  it('keeps the fill inside the rail when the value is out of range', () => {
    const { el } = setup({ value: 150 });
    const rail = el.querySelector<HTMLElement>('.slider__rail')!;
    expect(rail.style.getPropertyValue('--slider-fill')).toBe('100%');
  });

  it('emits rangeChange and keeps the thumbs apart by minGap', () => {
    const { cmp, thumbs, slide } = setup({ range: true, values: [20, 60], minGap: 10 });
    const emitted: [number, number][] = [];
    cmp.rangeChange.subscribe((v) => emitted.push(v));
    slide(thumbs()[1], 25);
    expect(cmp.values()).toEqual([20, 30]);
    expect(thumbs()[1].value).toBe('30');
    slide(thumbs()[0], 70);
    expect(cmp.values()).toEqual([20, 30]);
    expect(thumbs()[0].value).toBe('20');
    expect(emitted).toEqual([[20, 30]]);
  });

  it('never moves a thumb outside min and max to honour minGap', () => {
    const { cmp, thumbs, slide } = setup({ range: true, values: [0, 5], minGap: 10 });
    slide(thumbs()[0], 3);
    expect(cmp.values()[0]).toBe(0);
    slide(thumbs()[1], 98);
    expect(cmp.values()).toEqual([0, 98]);
  });

  it('gives each range thumb a distinct accessible name', () => {
    const { thumbs } = setup({ range: true, values: [20, 60] });
    const [a, b] = thumbs().map((t) => t.getAttribute('aria-label'));
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
    expect(a).not.toBe(b);
  });
});

describe('RangeSliderComponent thumbs against each other', () => {
  it('does not emit again when a thumb pushed against the other stays put', () => {
    const fixture = TestBed.createComponent(RangeSliderComponent);
    fixture.componentRef.setInput('range', true);
    fixture.componentRef.setInput('minGap', 10);
    fixture.componentInstance.values.set([20, 60]);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const emitted: [number, number][] = [];
    const changed = vi.fn();
    cmp.rangeChange.subscribe((v) => emitted.push(v));
    cmp.registerOnChange(changed);
    const [start, end] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>('input'),
    );
    const move = (box: HTMLInputElement, v: number) => {
      box.value = String(v);
      box.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    move(start, 55);
    expect(emitted).toEqual([[50, 60]]);
    expect(start.value).toBe('50');
    move(start, 58);
    move(end, 45);
    expect(emitted).toEqual([[50, 60]]);
    expect(changed).toHaveBeenCalledTimes(1);
    expect(end.value).toBe('60');
  });
});
