import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  model,
  signal,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NGX_DS_LABELS } from '../../shared/labels';

const DEFAULT_COLOR = '#6366f1';

/** `#rgb` / `#rrggbb` in any case → `#rrggbb` lower-case; anything else → null. */
function normalizeHex(value: string | null | undefined): string | null {
  const v = (value ?? '').trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(v)) return v;
  if (/^#[0-9a-f]{3}$/.test(v)) return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  return null;
}

function hexToHsl(hex: string): [number, number, number] {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

let nextId = 0;

@Component({
  selector: 'ngx-ds-color-picker',
  standalone: true,
  imports: [],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
  ],
})
export class ColorPickerComponent implements ControlValueAccessor {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly id = `ngx-color-picker-${nextId++}`;
  readonly value = model<string>(DEFAULT_COLOR);
  readonly label = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly #formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.#formDisabled());

  /** The current colour as `#rrggbb` (the default when `value` is not a valid hex). */
  readonly hexValue = computed(() => normalizeHex(this.value()) ?? DEFAULT_COLOR);

  /**
   * Slider positions follow `value`, but keep the previous ones when they still produce the same
   * hex, so a hue chosen at 0 % saturation is not lost.
   */
  readonly #hsl = linkedSignal<string, [number, number, number]>({
    source: this.hexValue,
    computation: (hex, previous) =>
      previous && hslToHex(...previous.value) === hex ? previous.value : hexToHsl(hex),
  });

  readonly hue = computed(() => this.#hsl()[0]);
  readonly saturation = computed(() => this.#hsl()[1]);
  readonly lightness = computed(() => this.#hsl()[2]);

  /** Text in the hex field: what the user typed until it is valid, then the current value. */
  readonly #hexInput = linkedSignal(() => this.hexValue());
  readonly hexInput = this.#hexInput.asReadonly();

  readonly gradientStyle = computed(
    () =>
      `linear-gradient(to right, hsl(${this.hue()}, 0%, ${this.lightness()}%), hsl(${this.hue()}, 100%, ${this.lightness()}%))`,
  );

  readonly lightnessStyle = computed(
    () =>
      `linear-gradient(to right, hsl(${this.hue()}, ${this.saturation()}%, 0%), hsl(${this.hue()}, ${this.saturation()}%, 50%), hsl(${this.hue()}, ${this.saturation()}%, 100%))`,
  );

  readonly previewStyle = computed(() => `background: ${this.hexValue()}`);

  onHueChange(event: Event): void {
    this.#setChannel(0, event);
  }

  onSatChange(event: Event): void {
    this.#setChannel(1, event);
  }

  onLightChange(event: Event): void {
    this.#setChannel(2, event);
  }

  onHexInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const hex = normalizeHex(raw);
    if (hex) this.#emit(hex);
    // Keep the text as typed while editing; blur shows the normalized value.
    this.#hexInput.set(raw);
  }

  onBlur(): void {
    this.#hexInput.set(this.hexValue());
    this.#onTouched();
  }

  #setChannel(index: 0 | 1 | 2, event: Event): void {
    const hsl = [...this.#hsl()] as [number, number, number];
    hsl[index] = Number((event.target as HTMLInputElement).value);
    const hex = hslToHex(...hsl);
    this.#emit(hex);
    this.#hsl.set(hsl);
  }

  #emit(hex: string): void {
    this.value.set(hex);
    this.#onChange(hex);
  }

  // ── CVA ──────────────────────────────────────────────────────────────────

  #onChange: (v: string) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(v: string | null): void {
    this.value.set(normalizeHex(v) ?? DEFAULT_COLOR);
  }
  registerOnChange(fn: (v: string) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.#formDisabled.set(isDisabled);
  }
}
