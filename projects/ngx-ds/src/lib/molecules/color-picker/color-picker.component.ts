import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NGX_DS_LABELS } from '../../shared/labels';

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
  readonly value = model<string>('#6366f1');
  readonly label = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly #formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.#formDisabled());

  readonly #h = signal(234);
  readonly #s = signal(89);
  readonly #l = signal(60);

  readonly hue = this.#h.asReadonly();
  readonly saturation = this.#s.asReadonly();
  readonly lightness = this.#l.asReadonly();

  readonly hexValue = computed(() => hslToHex(this.#h(), this.#s(), this.#l()));

  readonly #hexInput = signal(this.value());

  readonly hexInput = this.#hexInput.asReadonly();

  readonly gradientStyle = computed(
    () =>
      `linear-gradient(to right, hsl(${this.#h()}, 0%, ${this.#l()}%), hsl(${this.#h()}, 100%, ${this.#l()}%))`,
  );

  readonly lightnessStyle = computed(
    () =>
      `linear-gradient(to right, hsl(${this.#h()}, ${this.#s()}%, 0%), hsl(${this.#h()}, ${this.#s()}%, 50%), hsl(${this.#h()}, ${this.#s()}%, 100%))`,
  );

  readonly previewStyle = computed(() => `background: ${this.hexValue()}`);

  onHueChange(event: Event): void {
    this.#h.set(Number((event.target as HTMLInputElement).value));
    this.#syncHex();
  }

  onSatChange(event: Event): void {
    this.#s.set(Number((event.target as HTMLInputElement).value));
    this.#syncHex();
  }

  onLightChange(event: Event): void {
    this.#l.set(Number((event.target as HTMLInputElement).value));
    this.#syncHex();
  }

  onHexInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.#hexInput.set(raw);
    if (/^#[0-9a-fA-F]{6}$/.test(raw) || /^#[0-9a-fA-F]{3}$/.test(raw)) {
      const [h, s, l] = hexToHsl(raw);
      this.#h.set(h);
      this.#s.set(s);
      this.#l.set(l);
      this.#syncHex();
    }
  }

  #syncHex(): void {
    const hex = this.hexValue();
    this.value.set(hex);
    this.#hexInput.set(hex);
    this.#onChange(hex);
    this.#onTouched();
  }

  // ── CVA ──────────────────────────────────────────────────────────────────

  #onChange: (v: string) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(v: string | null): void {
    const hex = v || '#6366f1';
    this.value.set(hex);
    this.#hexInput.set(hex);
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      const [h, s, l] = hexToHsl(hex);
      this.#h.set(h);
      this.#s.set(s);
      this.#l.set(l);
    }
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
