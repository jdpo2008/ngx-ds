import { Signal, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { InputComponent } from './input/input.component';
import { SelectComponent } from './select/select.component';
import { SwitchComponent } from './switch/switch.component';
import { TagInputComponent } from './tag-input/tag-input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { TimePickerComponent } from './time-picker/time-picker.component';

interface DisableableControl {
  isDisabled: Signal<boolean>;
  setDisabledState(disabled: boolean): void;
}

const controls: [string, Type<DisableableControl>][] = [
  ['Autocomplete', AutocompleteComponent],
  ['Checkbox', CheckboxComponent],
  ['Datepicker', DatepickerComponent],
  ['Dropdown', DropdownComponent],
  ['Input', InputComponent],
  ['Select', SelectComponent],
  ['Switch', SwitchComponent],
  ['TagInput', TagInputComponent],
  ['Textarea', TextareaComponent],
  ['TimePicker', TimePickerComponent],
];

describe.each(controls)('%s disabled input', (_name, type) => {
  function create() {
    const fixture = TestBed.createComponent(type);
    fixture.detectChanges();
    return fixture;
  }

  it('is disabled by the [disabled] input', () => {
    const fixture = create();
    expect(fixture.componentInstance.isDisabled()).toBe(false);

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(fixture.componentInstance.isDisabled()).toBe(true);
    expect(
      fixture.nativeElement.querySelector('[disabled], [aria-disabled="true"]'),
    ).not.toBeNull();
  });

  it('stays disabled while either the input or the form disables it', () => {
    const fixture = create();
    const control = fixture.componentInstance;

    fixture.componentRef.setInput('disabled', true);
    control.setDisabledState(false);
    expect(control.isDisabled()).toBe(true);

    fixture.componentRef.setInput('disabled', false);
    control.setDisabledState(true);
    expect(control.isDisabled()).toBe(true);

    control.setDisabledState(false);
    expect(control.isDisabled()).toBe(false);
  });
});
