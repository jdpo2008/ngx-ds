import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
  computed,
  signal,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NGX_DS_LABELS } from '../../shared/labels';

export type SliderColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

// Theme tokens (with fallbacks) so consumers can restyle the slider via CSS.
const TRACK_COLORS: Record<SliderColor, string> = {
  primary: 'var(--primary-500, #6366f1)',
  secondary: 'var(--gray-500, #6b7280)',
  success: 'var(--success-500, #10b981)',
  warning: 'var(--warning-500, #f59e0b)',
  danger: 'var(--danger-500, #ef4444)',
};

let nextId = 0;

@Component({
  selector: 'ngx-ds-range-slider',
  standalone: true,
  imports: [],
  templateUrl: './range-slider.component.html',
  styleUrl: './range-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSliderComponent),
      multi: true,
    },
  ],
})
export class RangeSliderComponent implements ControlValueAccessor {
  readonly id = `ngx-range-slider-${nextId++}`;
  readonly i18n = inject(NGX_DS_LABELS);
  readonly value = model<number>(0);
  // `undefined` is accepted so Signal Forms can bind the field's min/max.
  readonly min = input(0, { transform: (v: number | undefined) => v ?? 0 });
  readonly max = input(100, { transform: (v: number | undefined) => v ?? 100 });
  readonly step = input<number>(1);
  readonly disabled = input<boolean>(false);
  readonly label = input<string>('');
  readonly showValue = input<boolean>(true);
  readonly showMinMax = input<boolean>(false);
  readonly color = input<SliderColor>('primary');

  readonly range = input<boolean>(false);
  readonly values = model<[number, number]>([0, 100]);
  readonly minGap = input<number>(0);
  /** Accessible name for the single slider when there is no visible `label`. */
  readonly ariaLabel = input<string>('');
  readonly ariaLabelStart = input<string>('');
  readonly ariaLabelEnd = input<string>('');

  readonly rangeChange = output<[number, number]>();

  readonly #formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.#formDisabled());

  protected readonly fillPercent = computed(() => {
    const min = this.min(),
      max = this.max(),
      val = this.value();
    if (max === min) return 0;
    return Math.round(((val - min) / (max - min)) * 100 * 100) / 100;
  });

  protected readonly rangeFillPercent = computed(() => {
    const min = this.min(),
      max = this.max();
    const [start, end] = this.values();
    if (max === min) return { from: 0, to: 0 };
    const toPercent = (v: number) => Math.round(((v - min) / (max - min)) * 100 * 100) / 100;
    return { from: toPercent(start), to: toPercent(end) };
  });

  protected readonly trackColor = computed(() => TRACK_COLORS[this.color()]);

  protected readonly trackStyle = computed(() => ({
    '--slider-fill': `${this.fillPercent()}%`,
    '--slider-color': this.trackColor(),
  }));

  protected readonly rangeTrackStyle = computed(() => {
    const { from, to } = this.rangeFillPercent();
    return {
      '--slider-fill-from': `${from}%`,
      '--slider-fill-to': `${to}%`,
      '--slider-color': this.trackColor(),
    };
  });

  protected onInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.value.set(val);
    this.#onChange(val);
  }

  protected onStartInput(event: Event): void {
    const raw = Number((event.target as HTMLInputElement).value);
    const [, end] = this.values();
    const clamped = Math.min(raw, end - this.minGap());
    (event.target as HTMLInputElement).value = String(clamped);
    const next: [number, number] = [clamped, end];
    this.values.set(next);
    this.rangeChange.emit(next);
    this.#onChange(next);
  }

  protected onEndInput(event: Event): void {
    const raw = Number((event.target as HTMLInputElement).value);
    const [start] = this.values();
    const clamped = Math.max(raw, start + this.minGap());
    (event.target as HTMLInputElement).value = String(clamped);
    const next: [number, number] = [start, clamped];
    this.values.set(next);
    this.rangeChange.emit(next);
    this.#onChange(next);
  }

  protected onBlur(): void {
    this.#onTouched();
  }

  // ── ControlValueAccessor ─────────────────────────────────────
  // Single mode exchanges a number; range mode exchanges [start, end].
  #onChange: (value: number | [number, number]) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(value: number | [number, number] | null): void {
    if (Array.isArray(value)) {
      this.values.set([value[0], value[1]]);
    } else if (typeof value === 'number') {
      this.value.set(value);
    } else if (this.range()) {
      this.values.set([this.min(), this.max()]);
    } else {
      this.value.set(this.min());
    }
  }

  registerOnChange(fn: (value: number | [number, number]) => void): void {
    this.#onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.#formDisabled.set(disabled);
  }
}
