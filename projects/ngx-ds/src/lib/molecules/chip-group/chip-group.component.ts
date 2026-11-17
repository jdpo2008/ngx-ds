import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { X } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { Size } from '../../shared/size';

export interface ChipItem {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type ChipGroupSize = Size;
export type ChipGroupVariant = 'filled' | 'outline' | 'soft';

@Component({
  selector: 'ngx-ds-chip-group',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './chip-group.component.html',
  styleUrl: './chip-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipGroupComponent),
      multi: true,
    },
  ],
})
export class ChipGroupComponent implements ControlValueAccessor {
  readonly chips = input<ChipItem[]>([]);
  readonly selected = model<(string | number)[]>([]);
  readonly selectable = input<boolean>(true);
  readonly removable = input<boolean>(false);
  readonly multiSelect = input<boolean>(true);
  readonly size = input<ChipGroupSize>('md');
  readonly variant = input<ChipGroupVariant>('soft');
  readonly disabled = input<boolean>(false);

  readonly removed = output<ChipItem>();

  readonly XIcon = X;

  readonly hostClasses = computed(
    () => `chip-group chip-group--${this.size()} chip-group--${this.variant()}`,
  );

  isSelected(chip: ChipItem): boolean {
    return this.selected().includes(chip.value);
  }

  toggle(chip: ChipItem): void {
    if (!this.selectable() || chip.disabled || this.disabled()) return;

    const current = this.selected();
    const idx = current.indexOf(chip.value);

    let next: (string | number)[];
    if (idx >= 0) {
      next = this.multiSelect() ? current.filter((v) => v !== chip.value) : [];
    } else {
      next = this.multiSelect() ? [...current, chip.value] : [chip.value];
    }

    this.selected.set(next);
    this.#onChange(next);
    this.#onTouched();
  }

  remove(chip: ChipItem, event: MouseEvent): void {
    event.stopPropagation();
    this.removed.emit(chip);
  }

  // ── CVA ───────────────────────────────────────────────────────────────────

  #onChange: (v: (string | number)[]) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(v: (string | number)[] | null): void {
    this.selected.set(v ?? []);
  }
  registerOnChange(fn: (v: (string | number)[]) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(_d: boolean): void {}
}
