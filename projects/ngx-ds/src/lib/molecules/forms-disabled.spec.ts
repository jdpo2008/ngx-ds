import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChipGroupComponent, ChipItem } from './chip-group/chip-group.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import {
  DateRange,
  DateRangePickerComponent,
} from './date-range-picker/date-range-picker.component';
import { NumberInputComponent } from './number-input/number-input.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ColorPickerComponent,
    ChipGroupComponent,
    DateRangePickerComponent,
    NumberInputComponent,
  ],
  template: `
    <ngx-ds-color-picker [formControl]="color" />
    <ngx-ds-chip-group [chips]="chips" [formControl]="tags" />
    <ngx-ds-date-range-picker [formControl]="range" />
    <ngx-ds-number-input [formControl]="qty" />
  `,
})
class Host {
  chips: ChipItem[] = [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
  ];
  color = new FormControl('#4f46e5');
  tags = new FormControl<(string | number)[]>([]);
  range = new FormControl<DateRange | null>(null);
  qty = new FormControl(5);
}

function setup() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  const disableAll = () => {
    const h = fixture.componentInstance;
    for (const c of [h.color, h.tags, h.range, h.qty]) c.disable();
    fixture.detectChanges();
  };
  return { fixture, el, disableAll };
}

function inputs(root: Element | null): (HTMLInputElement | HTMLButtonElement)[] {
  return Array.from(
    root?.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button') ?? [],
  );
}

describe('setDisabledState via reactive forms', () => {
  it('starts enabled', () => {
    const { el } = setup();
    expect(inputs(el.querySelector('ngx-ds-color-picker')).some((i) => i.disabled)).toBe(false);
    expect(inputs(el.querySelector('ngx-ds-chip-group')).some((i) => i.disabled)).toBe(false);
  });

  it('disables color-picker inputs', () => {
    const { el, disableAll } = setup();
    disableAll();
    const all = inputs(el.querySelector('ngx-ds-color-picker'));
    expect(all.length).toBeGreaterThan(0);
    expect(all.every((i) => i.disabled)).toBe(true);
  });

  it('disables chip-group buttons', () => {
    const { el, disableAll } = setup();
    disableAll();
    const all = inputs(el.querySelector('ngx-ds-chip-group'));
    expect(all.length).toBe(2);
    expect(all.every((i) => i.disabled)).toBe(true);
  });

  it('disables number-input field and steppers', () => {
    const { el, disableAll } = setup();
    disableAll();
    const all = inputs(el.querySelector('ngx-ds-number-input'));
    expect(all.length).toBe(3);
    expect(all.every((i) => i.disabled)).toBe(true);
  });

  it('disables the date-range-picker trigger and keeps it closed', () => {
    const { fixture, el, disableAll } = setup();
    disableAll();
    const trigger = el.querySelector<HTMLElement>('ngx-ds-date-range-picker [role="button"]')!;
    expect(trigger.getAttribute('aria-disabled')).toBe('true');
    expect(trigger.getAttribute('tabindex')).toBe('-1');
    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('re-enables when the control is enabled again', () => {
    const { fixture, el, disableAll } = setup();
    disableAll();
    fixture.componentInstance.qty.enable();
    fixture.detectChanges();
    const field = el.querySelector<HTMLInputElement>('ngx-ds-number-input input')!;
    expect(field.disabled).toBe(false);
  });
});
