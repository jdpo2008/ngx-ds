import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
  signal,
  computed,
  effect,
  untracked,
  forwardRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldErrors, fieldErrorText, fieldHasError } from '../../shared/field-error';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LucideIconData, Search, X } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { setupClickOutside } from '../../shared/click-outside';
import { Size } from '../../shared/size';
import { NGX_DS_LABELS } from '../../shared/labels';

export interface AutocompleteOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type AutocompleteValue = string | number;
export type AutocompleteSize = Size;

const ICON_SIZE: Record<AutocompleteSize, number> = { sm: 14, md: 16, lg: 18 };

let nextId = 0;

@Component({
  selector: 'ngx-ds-autocomplete',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent implements ControlValueAccessor, OnDestroy {
  readonly i18n = inject(NGX_DS_LABELS);

  private readonly sanitizer = inject(DomSanitizer);

  // ── Configuration ─────────────────────────────────────────
  readonly options = input<AutocompleteOption[]>([]);
  readonly label = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly placeholder = input<string | undefined>(undefined);
  readonly size = input<AutocompleteSize>('md');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  /** Set by Signal Forms `[formField]`. Its errors show once the field is touched. */
  readonly errors = input<FieldErrors>([]);
  readonly touched = input<boolean>(false);
  readonly iconLeft = input<LucideIconData | undefined>(undefined);
  /** Show loading spinner — set true while fetching async results */
  readonly loading = input<boolean>(false);
  /** Minimum characters typed before the panel opens */
  readonly minChars = input<number>(1);
  /** Debounce (ms) applied to the searchChange output — useful for async */
  readonly debounceMs = input<number>(300);
  /** Allow keeping a typed value even if it doesn't match any option */
  readonly allowCustom = input<boolean>(false);
  /** Show all options when focused with no text (minChars=0 equivalent) */
  readonly showAllOnFocus = input<boolean>(false);
  readonly noResultsText = input<string | undefined>(undefined);

  // ── Value ────────────────────────────────────────────────
  readonly value = model<AutocompleteValue | null>(null);

  // ── Outputs ──────────────────────────────────────────────
  /** Emits the current search string (debounced) — use for async data loading */
  readonly searchChange = output<string>();

  readonly id = `ngx-autocomplete-${nextId++}`;
  readonly messageId = `${this.id}-message`;

  // ── Icons ────────────────────────────────────────────────
  readonly SearchIcon = Search;
  readonly XIcon = X;

  // ── Internal state ────────────────────────────────────────
  readonly #open = signal(false);
  readonly #inputText = signal('');
  readonly disabled = input<boolean>(false);
  readonly #cvaDisabled = signal(false);
  readonly #focused = signal(false);

  readonly isOpen = this.#open.asReadonly();
  readonly inputText = this.#inputText.asReadonly();
  readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  readonly isFocused = this.#focused.asReadonly();

  private searchTimer: ReturnType<typeof setTimeout> | null = null;
  private inputEl: HTMLInputElement | null = null;

  // ── Derived ──────────────────────────────────────────────
  readonly iconSize = computed(() => ICON_SIZE[this.size()]);
  readonly hasError = computed(() =>
    fieldHasError(this.errorMessage(), this.errors(), this.touched()),
  );
  readonly errorText = computed(() =>
    fieldErrorText(this.errorMessage(), this.errors(), this.touched()),
  );
  readonly hasValue = computed(() => this.value() !== null && this.value() !== undefined);

  readonly selectedOption = computed(() => {
    const v = this.value();
    if (v === null || v === undefined) return null;
    return this.options().find((o) => o.value === v) ?? null;
  });

  readonly isFloating = computed(
    () => this.#focused() || this.hasValue() || this.#inputText().length > 0,
  );

  readonly filteredOptions = computed(() => {
    const text = this.#inputText().toLowerCase().trim();
    const min = this.minChars();
    const all = this.showAllOnFocus();
    const opts = this.options();

    if (all && text.length === 0) return opts;
    if (text.length < min) return [];
    return opts.filter((o) => o.label.toLowerCase().includes(text));
  });

  readonly showPanel = computed(() => {
    if (!this.isOpen()) return false;
    const text = this.#inputText().length;
    return this.showAllOnFocus() ? true : text >= this.minChars();
  });

  readonly fieldClasses = computed(() => {
    const base = 'ngx-autocomplete__field';
    return [
      base,
      `${base}--${this.size()}`,
      this.isFocused() ? `${base}--focused` : '',
      this.hasError() ? `${base}--error` : '',
      this.isDisabled() ? `${base}--disabled` : '',
      this.floatingLabel() ? `${base}--floating` : '',
      this.iconLeft() ? `${base}--icon-left` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  readonly floatLabelClasses = computed(() => {
    const base = 'ngx-autocomplete__float-label';
    return [
      base,
      this.isFloating() ? `${base}--active` : '',
      this.isFocused() ? `${base}--focused` : '',
      this.hasError() ? `${base}--error` : '',
      this.iconLeft() ? `${base}--offset` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  constructor() {
    // When options load asynchronously after a value is already set,
    // sync the visible input text to the option's label.
    effect(() => {
      const opt = this.selectedOption();
      if (opt) {
        const current = untracked(() => this.#inputText());
        if (current !== opt.label) this.#inputText.set(opt.label);
      }
    });

    setupClickOutside(() => this.closeAndRestore());
  }

  // ── Interactions ──────────────────────────────────────────
  onInputChange(text: string): void {
    this.#inputText.set(text);

    const selected = this.selectedOption();
    if (selected && text !== selected.label) {
      this.value.set(null);
      this.onChange(null);
    }

    const shouldOpen = this.showAllOnFocus() ? true : text.length >= this.minChars();

    this.#open.set(shouldOpen);
    this.emitSearch(text);
  }

  onFocus(): void {
    if (this.isDisabled()) return;
    this.#focused.set(true);
    const text = this.#inputText();
    const shouldOpen = this.showAllOnFocus() ? true : text.length >= this.minChars();
    this.#open.set(shouldOpen);
  }

  onBlur(): void {
    this.#focused.set(false);
    this.onTouched();
  }

  onOptionSelect(option: AutocompleteOption): void {
    if (option.disabled || this.isDisabled()) return;
    this.value.set(option.value);
    this.onChange(option.value);
    this.#inputText.set(option.label);
    this.#open.set(false);
  }

  onClear(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.value.set(null);
    this.onChange(null);
    this.#inputText.set('');
    this.#open.set(false);
    this.searchChange.emit('');
    this.inputEl?.focus();
  }

  registerInputEl(el: HTMLInputElement): void {
    this.inputEl = el;
  }

  isSelected(optionValue: AutocompleteValue): boolean {
    return this.value() === optionValue;
  }

  getHighlightedLabel(label: string): SafeHtml {
    const text = this.#inputText().trim();
    if (!text) return label;
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const highlighted = label.replace(
      new RegExp(`(${escaped})`, 'gi'),
      '<mark class="ngx-autocomplete__highlight">$1</mark>',
    );
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  // ── Helpers ───────────────────────────────────────────────
  private closeAndRestore(): void {
    this.#focused.set(false);
    this.#open.set(false);
    const selected = this.selectedOption();
    if (selected) {
      this.#inputText.set(selected.label);
    } else if (!this.allowCustom()) {
      this.#inputText.set('');
    }
    this.onTouched();
  }

  private emitSearch(text: string): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    const delay = this.debounceMs();
    if (delay > 0) {
      this.searchTimer = setTimeout(() => this.searchChange.emit(text), delay);
    } else {
      this.searchChange.emit(text);
    }
  }

  ngOnDestroy(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  // ── CVA ──────────────────────────────────────────────────
  private onChange: (v: AutocompleteValue | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: AutocompleteValue | null): void {
    this.value.set(v ?? null);
    if (v !== null && v !== undefined) {
      const opt = this.options().find((o) => o.value === v);
      if (opt) this.#inputText.set(opt.label);
    } else {
      this.#inputText.set('');
    }
  }

  registerOnChange(fn: (v: AutocompleteValue | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }
}
