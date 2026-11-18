import {
  inject,
  Injector,
  afterNextRender,
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  signal,
  computed,
  forwardRef,
  ElementRef,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldErrors, fieldErrorText, fieldHasError } from '../../shared/field-error';
import { ChevronDown, ChevronUp, Check, X, Search } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';
import { focusFirstOption, isActivationKey, moveOptionFocus } from '../../shared/keyboard';
import { Size } from '../../shared/size';
import { NGX_DS_LABELS } from '../../shared/labels';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type SelectValue = string | number;
export type SelectSize = Size;

const ICON_SIZE: Record<SelectSize, number> = { sm: 14, md: 16, lg: 18 };

let nextId = 0;

@Component({
  selector: 'ngx-ds-select',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  readonly i18n = inject(NGX_DS_LABELS);

  // ── Configuration ──────────────────────────────────────────
  readonly options = input<SelectOption[]>([]);
  readonly multiple = input<boolean>(false);
  readonly searchable = input<boolean>(false);
  readonly label = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly placeholder = input<string | undefined>(undefined);
  readonly size = input<SelectSize>('md');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  /** Set by Signal Forms `[formField]`. Its errors show once the field is touched. */
  readonly errors = input<FieldErrors>([]);
  readonly touched = input<boolean>(false);

  // ── Value ─────────────────────────────────────────────────
  readonly value = model<SelectValue | SelectValue[] | null>(null);

  readonly id = `ngx-select-${nextId++}`;
  readonly messageId = `${this.id}-message`;

  // ── Icons ──────────────────────────────────────────────────
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;
  readonly CheckIcon = Check;
  readonly XIcon = X;
  readonly SearchIcon = Search;

  // ── Internal state ─────────────────────────────────────────
  readonly #open = signal(false);
  readonly #search = signal('');
  readonly disabled = input<boolean>(false);
  readonly #cvaDisabled = signal(false);
  readonly #focused = signal(false);

  readonly isOpen = this.#open.asReadonly();
  readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  readonly searchText = this.#search.asReadonly();

  readonly iconSize = computed(() => ICON_SIZE[this.size()]);
  readonly hasError = computed(() =>
    fieldHasError(this.errorMessage(), this.errors(), this.touched()),
  );
  readonly errorText = computed(() =>
    fieldErrorText(this.errorMessage(), this.errors(), this.touched()),
  );

  // ── Derived ────────────────────────────────────────────────
  readonly selectedValues = computed<SelectValue[]>(() => {
    const v = this.value();
    if (v === null || v === undefined) return [];
    return Array.isArray(v) ? v : [v];
  });

  readonly isFloating = computed(() => this.#focused() || this.selectedValues().length > 0);

  readonly filteredOptions = computed(() => {
    const q = this.#search().toLowerCase().trim();
    if (!q) return this.options();
    return this.options().filter((o) => o.label.toLowerCase().includes(q));
  });

  readonly displayText = computed(() => {
    const vals = this.selectedValues();
    if (!vals.length) return '';

    if (this.multiple()) {
      if (vals.length <= 2) {
        return vals
          .map((v) => this.options().find((o) => o.value === v)?.label ?? String(v))
          .join(', ');
      }
      return `${vals.length} seleccionados`;
    }

    return this.options().find((o) => o.value === vals[0])?.label ?? String(vals[0]);
  });

  readonly triggerClasses = computed(() => {
    const base = 'ngx-select__trigger';
    return [
      base,
      `${base}--${this.size()}`,
      this.isOpen() ? `${base}--open` : '',
      this.hasError() ? `${base}--error` : '',
      this.isDisabled() ? `${base}--disabled` : '',
      this.#focused() ? `${base}--focused` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  readonly floatLabelClasses = computed(() => {
    const base = 'ngx-select__float-label';
    return [
      base,
      this.isFloating() ? `${base}--active` : '',
      this.isOpen() ? `${base}--focused` : '',
      this.hasError() ? `${base}--error` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  // ── Click outside ──────────────────────────────────────────
  constructor() {
    setupEscapeClose(() => this.#closeOnEscape());
    setupClickOutside(() => {
      this.#open.set(false);
      this.#search.set('');
      this.onTouched();
    });
  }

  // ── Interactions ───────────────────────────────────────────
  // ── Keyboard ───────────────────────────────────────────────
  private readonly triggerRef = viewChild<ElementRef<HTMLElement>>('trigger');
  readonly #injector = inject(Injector);

  onTriggerKeydown(event: KeyboardEvent): void {
    // Ignore keys coming from nested controls (clear / chip-remove buttons).
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!this.isOpen()) this.togglePanel();
      this.#focusFirstOptionAfterRender();
    } else if (isActivationKey(event)) {
      event.preventDefault();
      this.togglePanel();
    }
  }

  onOptionKeydown(event: KeyboardEvent, option: SelectOption): void {
    if (moveOptionFocus(event)) return;
    if (!isActivationKey(event)) return;
    event.preventDefault();
    this.selectOption(option);
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

  togglePanel(): void {
    if (this.isDisabled()) return;
    this.#open.update((v) => !v);
    if (!this.#open()) this.#search.set('');
    this.#focused.set(this.#open());
  }

  onSearchChange(text: string): void {
    this.#search.set(text);
  }

  isSelected(optionValue: SelectValue): boolean {
    return this.selectedValues().includes(optionValue);
  }

  selectOption(option: SelectOption): void {
    if (option.disabled || this.isDisabled()) return;

    if (this.multiple()) {
      const current = this.selectedValues();
      const newVal = current.includes(option.value)
        ? current.filter((v) => v !== option.value)
        : [...current, option.value];
      this.value.set(newVal);
      this.onChange(newVal);
    } else {
      this.value.set(option.value);
      this.onChange(option.value);
      this.#open.set(false);
      this.#focused.set(false);
      this.#search.set('');
    }
  }

  removeTag(optionValue: SelectValue, event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    const newVal = this.selectedValues().filter((v) => v !== optionValue);
    this.value.set(newVal.length ? newVal : null);
    this.onChange(newVal.length ? newVal : null);
  }

  tagLabel(optionValue: SelectValue): string {
    return this.options().find((o) => o.value === optionValue)?.label ?? String(optionValue);
  }

  selectAll(): void {
    const all = this.options()
      .filter((o) => !o.disabled)
      .map((o) => o.value);
    this.value.set(all);
    this.onChange(all);
  }

  clearAll(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.value.set(null);
    this.onChange(null);
  }

  // ── CVA ───────────────────────────────────────────────────
  private onChange: (v: SelectValue | SelectValue[] | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: SelectValue | SelectValue[] | null): void {
    this.value.set(v ?? null);
  }
  registerOnChange(fn: (v: SelectValue | SelectValue[] | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }
}
