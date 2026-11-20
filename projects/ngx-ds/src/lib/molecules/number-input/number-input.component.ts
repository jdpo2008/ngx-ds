import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  forwardRef,
  input,
  model,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldErrors, fieldErrorText, fieldHasError } from '../../shared/field-error';
import { Plus, Minus } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { Size } from '../../shared/size';
import { NGX_DS_LABELS } from '../../shared/labels';

export type NumberInputSize = Size;

const ICON_SIZES: Record<NumberInputSize, number> = { sm: 14, md: 16, lg: 18 };

let nextId = 0;

function decimals(n: number): number {
  if (!isFinite(n)) return 0;
  const [mantissa, exp] = String(n).split('e');
  const frac = mantissa.split('.')[1]?.length ?? 0;
  return Math.max(0, frac - Number(exp ?? 0));
}

@Component({
  selector: 'ngx-ds-number-input',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
})
export class NumberInputComponent implements ControlValueAccessor {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly value = model<number>(0);
  // `undefined` is accepted so Signal Forms can bind the field's min/max.
  readonly min = input(null, { transform: (v: number | null | undefined) => v ?? null });
  readonly max = input(null, { transform: (v: number | null | undefined) => v ?? null });
  readonly step = input<number>(1);
  readonly size = input<NumberInputSize>('md');
  readonly label = input<string>('');
  /** Accessible name when there is no visible `label`. */
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  /** Set by Signal Forms `[formField]`. Its errors show once the field is touched. */
  readonly errors = input<FieldErrors>([]);
  readonly touched = input<boolean>(false);
  readonly hasError = computed(() =>
    fieldHasError(this.errorMessage(), this.errors(), this.touched()),
  );
  readonly errorText = computed(() =>
    fieldErrorText(this.errorMessage(), this.errors(), this.touched()),
  );
  readonly disabled = input<boolean>(false);
  readonly #formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.#formDisabled());

  readonly id = `ngx-number-${nextId++}`;
  readonly messageId = `${this.id}-message`;

  protected readonly PlusIcon = Plus;
  protected readonly MinusIcon = Minus;

  readonly iconSize = computed(() => ICON_SIZES[this.size()]);

  readonly canDecrement = computed(() => {
    const min = this.min();
    return !this.isDisabled() && (min === null || this.value() > min);
  });

  readonly canIncrement = computed(() => {
    const max = this.max();
    return !this.isDisabled() && (max === null || this.value() < max);
  });

  readonly hostClasses = computed(
    () =>
      `number-input number-input--${this.size()}` + (this.hasError() ? ' number-input--error' : ''),
  );

  decrement(): void {
    if (!this.canDecrement()) return;
    const next = this.#round(this.value() - this.step());
    const min = this.min();
    const clamped = min !== null ? Math.max(next, min) : next;
    this.setValue(clamped);
  }

  increment(): void {
    if (!this.canIncrement()) return;
    const next = this.#round(this.value() + this.step());
    const max = this.max();
    const clamped = max !== null ? Math.min(next, max) : next;
    this.setValue(clamped);
  }

  onInputChange(event: Event): void {
    const field = event.target as HTMLInputElement;
    const n = parseFloat(field.value);
    if (!isNaN(n)) {
      const min = this.min();
      const max = this.max();
      this.setValue(min !== null && n < min ? min : max !== null && n > max ? max : n);
    }
    // The [value] binding doesn't rewrite the field when the signal keeps the same value
    // (a clamped entry equal to the current value, or text that isn't a number).
    field.value = String(this.value());
  }

  onBlur(): void {
    this.#onTouched();
  }

  /** Rounds to the decimals of the value or the step, so 0.1 + 0.2 gives 0.3. */
  #round(n: number): number {
    const p = Math.max(decimals(this.value()), decimals(this.step()));
    return Math.round(n * 10 ** p) / 10 ** p;
  }

  private setValue(v: number): void {
    this.value.set(v);
    this.#onChange(v);
    this.#onTouched();
  }

  // ── CVA ───────────────────────────────────────────────────────────────────

  #onChange: (v: number) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(v: number): void {
    this.value.set(v ?? 0);
  }
  registerOnChange(fn: (v: number) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.#formDisabled.set(isDisabled);
  }
}
