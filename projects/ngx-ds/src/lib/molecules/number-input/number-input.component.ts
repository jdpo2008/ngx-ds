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
import { Plus, Minus } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { Size } from '../../shared/size';
import { NGX_DS_LABELS } from '../../shared/labels';

export type NumberInputSize = Size;

const ICON_SIZES: Record<NumberInputSize, number> = { sm: 14, md: 16, lg: 18 };

let nextId = 0;

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
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly #formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.#formDisabled());

  readonly id = `ngx-number-${nextId++}`;

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

  readonly hostClasses = computed(() => `number-input number-input--${this.size()}`);

  decrement(): void {
    if (!this.canDecrement()) return;
    const next = this.value() - this.step();
    const min = this.min();
    const clamped = min !== null ? Math.max(next, min) : next;
    this.setValue(clamped);
  }

  increment(): void {
    if (!this.canIncrement()) return;
    const next = this.value() + this.step();
    const max = this.max();
    const clamped = max !== null ? Math.min(next, max) : next;
    this.setValue(clamped);
  }

  onInputChange(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const n = parseFloat(raw);
    if (isNaN(n)) return;
    const min = this.min();
    const max = this.max();
    const clamped = min !== null && n < min ? min : max !== null && n > max ? max : n;
    this.setValue(clamped);
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
