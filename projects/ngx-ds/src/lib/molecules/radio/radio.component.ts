import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  computed,
  forwardRef,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Size } from '../../shared/size';

export type RadioSize = Size;
export type RadioColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
export type RadioValue = string | number;

let nextId = 0;

/** Every live radio, so selecting one can update the others in its group. */
const radios = new Set<RadioComponent>();

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
  /**
   * Controlled checked state for use without forms. When left undefined the
   * state comes from the form model (`ngModel` / `formControlName`).
   */
  readonly checked = input<boolean | undefined>(undefined);
  readonly disabled = input<boolean>(false);

  /** Emits this radio's `value` when the user selects it. */
  readonly valueSelect = output<RadioValue>();

  readonly id = `ngx-radio-${nextId++}`;

  readonly #modelValue = signal<RadioValue | null>(null);
  readonly #formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.#formDisabled());
  readonly isChecked = computed(() => this.checked() ?? this.#modelValue() === this.value());

  private readonly native = viewChild.required<ElementRef<HTMLInputElement>>('native');
  readonly #host: HTMLElement = inject(ElementRef).nativeElement;

  private onChange: (v: RadioValue) => void = () => {};
  private onTouched: () => void = () => {};

  readonly hostClasses = computed(() => {
    const classes = ['radio', `radio--${this.size()}`, `radio--${this.color()}`];
    if (this.isChecked()) classes.push('radio--checked');
    if (this.isDisabled()) classes.push('radio--disabled');
    return classes.join(' ');
  });

  constructor() {
    radios.add(this);
    inject(DestroyRef).onDestroy(() => radios.delete(this));
  }

  onSelect(): void {
    if (this.isDisabled()) return;
    const value = this.value();
    const group = this.#group();
    // A shared FormControl (or no form at all) never writes back to the
    // other radios, so tell them which value is now selected.
    for (const radio of group) radio.#modelValue.set(value);
    this.onChange(value);
    this.onTouched();
    this.valueSelect.emit(value);
    // The browser has already moved the native check. Put every radio of the
    // group back to its own state: with [checked] the parent decides, and the
    // next change detection applies its answer.
    for (const radio of group) radio.native().nativeElement.checked = radio.isChecked();
  }

  onBlur(): void {
    this.onTouched();
  }

  /** Radios with the same name in the same form (the native group), this one included. */
  #group(): RadioComponent[] {
    const form = this.#host.closest('form');
    return [...radios].filter((r) => r.name() === this.name() && r.#host.closest('form') === form);
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
    this.#formDisabled.set(disabled);
  }
}
