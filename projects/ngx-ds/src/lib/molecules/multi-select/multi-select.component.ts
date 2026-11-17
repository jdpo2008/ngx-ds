import {
  inject,
  Injector,
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
  ElementRef,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChevronDown, X, Check } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';
import { focusFirstOption, isActivationKey, moveOptionFocus } from '../../shared/keyboard';
import { Size } from '../../shared/size';

export interface MultiSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type MultiSelectSize = Size;

let nextId = 0;

@Component({
  selector: 'ngx-ds-multi-select',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
})
export class MultiSelectComponent implements ControlValueAccessor {
  readonly options = input<MultiSelectOption[]>([]);
  readonly value = model<(string | number)[]>([]);
  readonly placeholder = input<string>('Seleccionar...');
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly size = input<MultiSelectSize>('md');
  readonly searchable = input<boolean>(true);
  readonly maxSelected = input<number | null>(null);
  readonly disabled = input<boolean>(false);

  readonly id = `ngx-multi-${nextId++}`;

  protected readonly ChevronDownIcon = ChevronDown;
  protected readonly XIcon = X;
  protected readonly CheckIcon = Check;

  readonly #open = signal(false);
  readonly #search = signal('');
  readonly #disabledInt = signal(false);

  readonly isOpen = this.#open.asReadonly();
  readonly search = this.#search.asReadonly();

  readonly filteredOptions = computed(() => {
    const q = this.#search().toLowerCase().trim();
    if (!q) return this.options();
    return this.options().filter((o) => o.label.toLowerCase().includes(q));
  });

  readonly selectedLabels = computed(() =>
    this.options()
      .filter((o) => this.value().includes(o.value))
      .map((o) => o.label),
  );

  readonly canSelectMore = computed(() => {
    const max = this.maxSelected();
    return max === null || this.value().length < max;
  });

  readonly triggerClasses = computed(() => {
    const base = `ms__trigger ms__trigger--${this.size()}`;
    if (this.#open()) return base + ' ms__trigger--open';
    if (this.errorMessage()) return base + ' ms__trigger--error';
    return base;
  });

  // ── Keyboard ───────────────────────────────────────────────
  private readonly triggerRef = viewChild<ElementRef<HTMLElement>>('trigger');
  readonly #injector = inject(Injector);

  onTriggerKeydown(event: KeyboardEvent): void {
    // Ignore keys coming from nested controls (clear / chip-remove buttons).
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!this.isOpen()) this.toggleOpen();
      this.#focusFirstOptionAfterRender();
    } else if (isActivationKey(event)) {
      event.preventDefault();
      this.toggleOpen();
    }
  }

  onOptionKeydown(event: KeyboardEvent, option: MultiSelectOption): void {
    if (moveOptionFocus(event)) return;
    if (!isActivationKey(event)) return;
    event.preventDefault();
    this.toggleOption(option);
    if (!this.isOpen()) this.triggerRef()?.nativeElement.focus();
  }

  /** ArrowDown in the search box moves focus into the option list. */
  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    focusFirstOption(document.getElementById(this.id + '-panel'));
  }

  #focusFirstOptionAfterRender(): void {
    afterNextRender(() => focusFirstOption(document.getElementById(this.id + '-panel')), {
      injector: this.#injector,
    });
  }

  #closeOnEscape(): void {
    if (!this.isOpen()) return;
    this.#open.set(false);
    this.#search.set('');
    this.triggerRef()?.nativeElement.focus();
  }

  toggleOpen(): void {
    if (this.disabled() || this.#disabledInt()) return;
    this.#open.update((v) => !v);
    if (!this.#open()) this.#search.set('');
  }

  toggleOption(option: MultiSelectOption): void {
    if (option.disabled) return;
    const current = this.value();
    const idx = current.indexOf(option.value);
    let next: (string | number)[];
    if (idx >= 0) {
      next = current.filter((v) => v !== option.value);
    } else {
      if (!this.canSelectMore()) return;
      next = [...current, option.value];
    }
    this.value.set(next);
    this.#onChange(next);
    this.#onTouched();
  }

  removeChip(val: string | number, event: MouseEvent): void {
    event.stopPropagation();
    const next = this.value().filter((v) => v !== val);
    this.value.set(next);
    this.#onChange(next);
    this.#onTouched();
  }

  isSelected(option: MultiSelectOption): boolean {
    return this.value().includes(option.value);
  }

  onSearch(event: Event): void {
    this.#search.set((event.target as HTMLInputElement).value);
  }

  constructor() {
    setupEscapeClose(() => this.#closeOnEscape());
    setupClickOutside(() => {
      if (!this.#open()) return;
      this.#open.set(false);
      this.#search.set('');
    });
  }

  // ── CVA ───────────────────────────────────────────────────────────────────

  #onChange: (v: (string | number)[]) => void = () => {};
  #onTouched: () => void = () => {};

  writeValue(v: (string | number)[] | null): void {
    this.value.set(v ?? []);
  }
  registerOnChange(fn: (v: (string | number)[]) => void): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.#disabledInt.set(d);
  }
}
