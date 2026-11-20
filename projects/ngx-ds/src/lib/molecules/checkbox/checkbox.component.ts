import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  signal,
  computed,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Size } from '../../shared/size';

export type CheckboxSize = Size;
export type CheckboxColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';

let nextId = 0;

@Component({
  selector: 'ngx-ds-checkbox',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  /** Accessible name when there is no visible `label`. */
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly size = input<CheckboxSize>('md');
  readonly color = input<CheckboxColor>('primary');
  readonly indeterminate = input<boolean>(false);
  readonly labelPosition = input<'left' | 'right'>('right');

  readonly checked = model<boolean>(false);

  readonly id = `ngx-checkbox-${nextId++}`;

  readonly disabled = input<boolean>(false);
  readonly #cvaDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  readonly hostClasses = computed(() => {
    const classes = ['checkbox', `checkbox--${this.size()}`, `checkbox--${this.color()}`];
    if (this.checked()) classes.push('checkbox--checked');
    if (this.indeterminate() && !this.checked()) classes.push('checkbox--indeterminate');
    if (this.isDisabled()) classes.push('checkbox--disabled');
    return classes.join(' ');
  });

  onBlur(): void {
    this.onTouched();
  }

  onNativeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checked.set(input.checked);
    this.onChange(input.checked);
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }
  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }
}
