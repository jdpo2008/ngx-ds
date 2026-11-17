import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  computed,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Size } from '../../shared/size';

export type RadioSize = Size;
export type RadioColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
export type RadioValue = string | number;

let nextId = 0;

@Component({
  selector: 'ngx-ds-radio',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true,
    },
  ],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent implements ControlValueAccessor {
  readonly value = input.required<RadioValue>();
  readonly label = input<string>('');
  readonly name = input<string>('ngx-radio-group');
  readonly size = input<RadioSize>('md');
  readonly color = input<RadioColor>('primary');
  readonly labelPosition = input<'left' | 'right'>('right');

  readonly id = `ngx-radio-${nextId++}`;

  readonly #modelValue = signal<RadioValue | null>(null);
  readonly #disabled = signal(false);
  readonly isDisabled = this.#disabled.asReadonly();
  readonly isChecked = computed(() => this.#modelValue() === this.value());

  private onChange: (v: RadioValue) => void = () => {};
  private onTouched: () => void = () => {};

  readonly hostClasses = computed(() => {
    const classes = ['radio', `radio--${this.size()}`, `radio--${this.color()}`];
    if (this.isChecked()) classes.push('radio--checked');
    if (this.#disabled()) classes.push('radio--disabled');
    return classes.join(' ');
  });

  onSelect(): void {
    if (this.#disabled()) return;
    this.#modelValue.set(this.value());
    this.onChange(this.value());
    this.onTouched();
  }

  writeValue(value: RadioValue | null): void {
    this.#modelValue.set(value);
  }
  registerOnChange(fn: (v: RadioValue) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#disabled.set(disabled);
  }
}
