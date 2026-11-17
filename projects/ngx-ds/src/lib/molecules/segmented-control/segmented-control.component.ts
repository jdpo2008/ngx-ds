import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Size } from '../../shared/size';

export interface SegmentOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type SegmentedControlSize = Size;

@Component({
  selector: 'ngx-ds-segmented-control',
  standalone: true,
  imports: [],
  templateUrl: './segmented-control.component.html',
  styleUrl: './segmented-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentedControlComponent),
      multi: true,
    },
  ],
})
export class SegmentedControlComponent implements ControlValueAccessor {
  readonly options = input<SegmentOption[]>([]);
  readonly value = model<string | number | null>(null);
  readonly size = input<SegmentedControlSize>('md');
  readonly fullWidth = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly hostClasses = computed(() => {
    const cls = [`segmented segmented--${this.size()}`];
    if (this.fullWidth()) cls.push('segmented--full');
    if (this.disabled()) cls.push('segmented--disabled');
    return cls.join(' ');
  });

  isSelected(option: SegmentOption): boolean {
    return this.value() === option.value;
  }

  select(option: SegmentOption): void {
    if (this.disabled() || option.disabled) return;
    this.value.set(option.value);
    this.#onChange(option.value);
    this.#onTouched();
  }

  // ── CVA ───────────────────────────────────────────────────────────────────

  #onChange: (v: string | number | null) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(v: string | number | null): void {
    this.value.set(v);
  }
  registerOnChange(fn: (v: string | number | null) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(_d: boolean): void {
    /* disabled via input */
  }
}
