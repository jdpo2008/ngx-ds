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
import { Star } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { Size } from '../../shared/size';
import { NGX_DS_LABELS } from '../../shared/labels';

export type RatingSize = Size;

const SIZES: Record<RatingSize, number> = { sm: 16, md: 22, lg: 28 };

@Component({
  selector: 'ngx-ds-rating',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true,
    },
  ],
})
export class RatingComponent implements ControlValueAccessor {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly value = model<number>(0);
  readonly max = input<number>(5);
  readonly size = input<RatingSize>('md');
  readonly readonly = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly label = input<string>('');

  readonly #hover = signal<number>(-1);

  readonly iconSize = computed(() => SIZES[this.size()]);

  readonly StarIcon = Star;

  stars = computed(() => Array.from({ length: this.max() }, (_, i) => i + 1));

  isFilled(index: number): boolean {
    const hover = this.#hover();
    const active = hover >= 0 ? hover : this.value();
    return index <= active;
  }

  onHover(index: number): void {
    if (this.readonly() || this.disabled()) return;
    this.#hover.set(index);
  }

  onLeave(): void {
    this.#hover.set(-1);
  }

  onClick(index: number): void {
    if (this.readonly() || this.disabled()) return;
    const next = this.value() === index ? 0 : index;
    this.value.set(next);
    this.#onChange(next);
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
  setDisabledState(_d: boolean): void {}
}
