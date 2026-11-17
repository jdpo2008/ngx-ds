import { TestBed } from '@angular/core/testing';
import { RangeSliderComponent } from './range-slider.component';

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
