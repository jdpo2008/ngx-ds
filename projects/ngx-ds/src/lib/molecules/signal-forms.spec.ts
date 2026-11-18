import { Component, Type, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormField, disabled, form, max, required } from '@angular/forms/signals';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ChipGroupComponent } from './chip-group/chip-group.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import {
  DateRange,
  DateRangePickerComponent,
} from './date-range-picker/date-range-picker.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { InputComponent } from './input/input.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { NumberInputComponent } from './number-input/number-input.component';
import { OtpInputComponent } from './otp-input/otp-input.component';
import { RadioComponent } from './radio/radio.component';
import { RangeSliderComponent } from './range-slider/range-slider.component';
import { RatingComponent } from './rating/rating.component';
import { SegmentedControlComponent } from './segmented-control/segmented-control.component';
import { SelectComponent } from './select/select.component';
import { SwitchComponent } from './switch/switch.component';
import { TextareaComponent } from './textarea/textarea.component';

interface Model {
  name: string;
  bio: string;
  qty: number;
  agree: boolean;
  notify: boolean;
  color: string;
  size: string;
  fruit: string | null;
  city: string | null;
  tags: string[];
  chips: (string | number)[];
  day: Date | null;
  range: DateRange | null;
  code: string;
  volume: number;
  stars: number;
  view: string | number | null;
  pet: string | null;
}

const opts = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
];

@Component({
  standalone: true,
  imports: [
    FormField,
    AutocompleteComponent,
    CheckboxComponent,
    ChipGroupComponent,
    ColorPickerComponent,
    DatepickerComponent,
    DateRangePickerComponent,
    DropdownComponent,
    InputComponent,
    MultiSelectComponent,
    NumberInputComponent,
    OtpInputComponent,
    RadioComponent,
    RangeSliderComponent,
    RatingComponent,
    SegmentedControlComponent,
    SelectComponent,
    SwitchComponent,
    TextareaComponent,
  ],
  template: `
    <ngx-ds-input [formField]="f.name" />
    <ngx-ds-textarea [formField]="f.bio" />
    <ngx-ds-number-input [formField]="f.qty" />
    <ngx-ds-checkbox [formField]="f.agree" />
    <ngx-ds-switch [formField]="f.notify" />
    <ngx-ds-color-picker [formField]="f.color" />
    <ngx-ds-select [options]="opts" [formField]="f.size" />
    <ngx-ds-dropdown [options]="opts" [formField]="f.fruit" />
    <ngx-ds-autocomplete [options]="opts" [formField]="f.city" />
    <ngx-ds-multi-select [options]="opts" [formField]="f.tags" />
    <ngx-ds-chip-group [chips]="opts" [formField]="f.chips" />
    <ngx-ds-datepicker [formField]="f.day" />
    <ngx-ds-date-range-picker [formField]="f.range" />
    <ngx-ds-otp-input [formField]="f.code" />
    <ngx-ds-range-slider [formField]="f.volume" />
    <ngx-ds-rating [formField]="f.stars" />
    <ngx-ds-segmented-control [options]="opts" [formField]="f.view" />
    <ngx-ds-radio value="cat" [formField]="f.pet" />
    <ngx-ds-radio value="dog" [formField]="f.pet" />
  `,
})
class Host {
  opts = opts;
  off = signal(false);
  model = signal<Model>({
    name: 'Ada',
    bio: 'Hi',
    qty: 3,
    agree: true,
    notify: true,
    color: '#ff0000',
    size: 'b',
    fruit: 'a',
    city: 'b',
    tags: ['a'],
    chips: ['b'],
    day: new Date(2026, 0, 15),
    range: { start: new Date(2026, 0, 1), end: new Date(2026, 0, 5) },
    code: '123456',
    volume: 40,
    stars: 4,
    view: 'b',
    pet: 'dog',
  });
  f = form(this.model, (p) => {
    required(p.name, { message: 'Name is required' });
    required(p.bio);
    disabled(p.name, () => this.off());
    disabled(p.qty, () => this.off());
    max(p.qty, 10);
  });
}

function setup() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  const cmp = <T>(type: Type<T>, index = 0): T =>
    fixture.debugElement.queryAll(By.directive(type))[index].componentInstance as T;
  return { fixture, host: fixture.componentInstance, el, cmp };
}

describe('Signal Forms [formField]', () => {
  it('writes the model into every control', () => {
    const { host, cmp } = setup();
    const m = host.model();
    expect(cmp(InputComponent).value()).toBe(m.name);
    expect(cmp(TextareaComponent).value()).toBe(m.bio);
    expect(cmp(NumberInputComponent).value()).toBe(m.qty);
    expect(cmp(CheckboxComponent).checked()).toBe(true);
    expect(cmp(SwitchComponent).checked()).toBe(true);
    expect(cmp(ColorPickerComponent).value()).toBe(m.color);
    expect(cmp(SelectComponent).value()).toBe(m.size);
    expect(cmp(DropdownComponent).value()).toBe(m.fruit);
    expect(cmp(AutocompleteComponent).value()).toBe(m.city);
    expect(cmp(MultiSelectComponent).value()).toEqual(m.tags);
    expect(cmp(ChipGroupComponent).selected()).toEqual(m.chips);
    expect(cmp(DatepickerComponent).value()).toEqual(m.day);
    expect(cmp(DateRangePickerComponent).start()).toEqual(m.range!.start);
    expect(cmp(DateRangePickerComponent).end()).toEqual(m.range!.end);
    expect(cmp(OtpInputComponent).value()).toBe(m.code);
    expect(cmp(RangeSliderComponent).value()).toBe(m.volume);
    expect(cmp(RatingComponent).value()).toBe(m.stars);
    expect(cmp(SegmentedControlComponent).value()).toBe(m.view);
  });

  it('checks the radio that matches the model', () => {
    const { el } = setup();
    const radios = el.querySelectorAll<HTMLInputElement>('ngx-ds-radio input');
    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(true);
  });

  it('follows later model updates', () => {
    const { fixture, host, cmp } = setup();
    host.f.name().value.set('Grace');
    host.f.stars().value.set(2);
    fixture.detectChanges();
    expect(cmp(InputComponent).value()).toBe('Grace');
    expect(cmp(RatingComponent).value()).toBe(2);
  });

  it('writes user input back to the model', () => {
    const { fixture, host, el } = setup();
    const input = el.querySelector<HTMLInputElement>('ngx-ds-input input')!;
    input.value = 'Linus';
    input.dispatchEvent(new Event('input'));
    el.querySelector<HTMLInputElement>('ngx-ds-checkbox input')!.click();
    el.querySelector<HTMLButtonElement>('ngx-ds-segmented-control button')!.click();
    el.querySelectorAll<HTMLButtonElement>('ngx-ds-number-input button')[1].click();
    fixture.detectChanges();
    expect(host.model().name).toBe('Linus');
    expect(host.model().agree).toBe(false);
    expect(host.model().view).toBe('a');
    expect(host.model().qty).toBe(4);
  });

  it('marks the field as touched on blur', () => {
    const { fixture, host, el } = setup();
    expect(host.f.name().touched()).toBe(false);
    el.querySelector<HTMLInputElement>('ngx-ds-input input')!.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(host.f.name().touched()).toBe(true);
  });

  it('disables the control when the field is disabled', () => {
    const { fixture, host, el } = setup();
    const field = el.querySelector<HTMLInputElement>('ngx-ds-input input')!;
    expect(field.disabled).toBe(false);
    host.off.set(true);
    fixture.detectChanges();
    expect(field.disabled).toBe(true);
    const qty = Array.from(
      el.querySelectorAll<HTMLElement>('ngx-ds-number-input input, ngx-ds-number-input button'),
    );
    expect(qty.every((e) => (e as HTMLInputElement).disabled)).toBe(true);
  });

  it('binds the field max validator to the number input', () => {
    const { cmp } = setup();
    expect(cmp(NumberInputComponent).max()).toBe(10);
    expect(cmp(RangeSliderComponent).max()).toBe(100);
  });

  it('reports validity from the schema', () => {
    const { fixture, host, el } = setup();
    const input = el.querySelector<HTMLInputElement>('ngx-ds-input input')!;
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(host.f.name().invalid()).toBe(true);
  });

  it('shows the field error message once the field is touched', () => {
    const { fixture, el } = setup();
    const input = el.querySelector<HTMLInputElement>('ngx-ds-input input')!;
    const message = () => el.querySelector('ngx-ds-input .ngx-input__message--error');
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(message()).toBeNull();

    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(message()?.textContent?.trim()).toBe('Name is required');
    expect(el.querySelector('ngx-ds-input .ngx-input__field--error')).not.toBeNull();
  });

  it('marks the error state without text when the error has no message', () => {
    const { fixture, el } = setup();
    const area = el.querySelector<HTMLTextAreaElement>('ngx-ds-textarea textarea')!;
    area.value = '';
    area.dispatchEvent(new Event('input'));
    area.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(el.querySelector('ngx-ds-textarea .ngx-textarea__field--error')).not.toBeNull();
    expect(el.querySelector('ngx-ds-textarea .ngx-textarea__message--error')).toBeNull();
  });
});
