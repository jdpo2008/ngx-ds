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

export type SwitchSize = Size;
export type SwitchColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';

let nextId = 0;

@Component({
  selector: 'ngx-ds-switch',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  /** Accessible name when there is no visible `label`. */
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly labelPosition = input<'left' | 'right'>('right');
  readonly size = input<SwitchSize>('md');
  readonly color = input<SwitchColor>('primary');
  readonly labelOn = input<string>('');
  readonly labelOff = input<string>('');

  readonly checked = model<boolean>(false);

  readonly id = `ngx-switch-${nextId++}`;

  readonly disabled = input<boolean>(false);
  readonly #cvaDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  readonly hostClasses = computed(() => {
    const classes = ['switch', `switch--${this.size()}`, `switch--${this.color()}`];
    if (this.checked()) classes.push('switch--checked');
    if (this.isDisabled()) classes.push('switch--disabled');
    return classes.join(' ');
  });

  readonly activeLabel = computed(() => (this.checked() ? this.labelOn() : this.labelOff()));

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
