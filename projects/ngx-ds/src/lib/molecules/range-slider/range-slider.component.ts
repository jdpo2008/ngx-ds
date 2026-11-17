import { Component, ChangeDetectionStrategy, input, model, output, computed } from '@angular/core';

export type SliderColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

const TRACK_COLORS: Record<SliderColor, string> = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
};

let nextId = 0;

@Component({
  selector: 'ngx-ds-range-slider',
  standalone: true,
  imports: [],
  templateUrl: './range-slider.component.html',
  styleUrl: './range-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeSliderComponent {
  readonly id = `ngx-range-slider-${nextId++}`;
  readonly value = model<number>(0);
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly step = input<number>(1);
  readonly disabled = input<boolean>(false);
  readonly label = input<string>('');
  readonly showValue = input<boolean>(true);
  readonly showMinMax = input<boolean>(false);
  readonly color = input<SliderColor>('primary');

  readonly range = input<boolean>(false);
  readonly values = model<[number, number]>([0, 100]);
  readonly minGap = input<number>(0);
  readonly ariaLabelStart = input<string>('');
  readonly ariaLabelEnd = input<string>('');

  // TODO: rename (breaking) — native DOM event name.
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly change = output<number>();
  readonly rangeChange = output<[number, number]>();

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
    this.change.emit(val);
  }

  protected onStartInput(event: Event): void {
    const raw = Number((event.target as HTMLInputElement).value);
    const [, end] = this.values();
    const clamped = Math.min(raw, end - this.minGap());
    (event.target as HTMLInputElement).value = String(clamped);
    const next: [number, number] = [clamped, end];
    this.values.set(next);
    this.rangeChange.emit(next);
  }

  protected onEndInput(event: Event): void {
    const raw = Number((event.target as HTMLInputElement).value);
    const [start] = this.values();
    const clamped = Math.max(raw, start + this.minGap());
    (event.target as HTMLInputElement).value = String(clamped);
    const next: [number, number] = [start, clamped];
    this.values.set(next);
    this.rangeChange.emit(next);
  }
}
