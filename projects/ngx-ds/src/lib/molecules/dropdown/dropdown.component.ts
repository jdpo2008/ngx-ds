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
import { ChevronDown, ChevronUp, Check, X } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';
import { focusFirstOption, isActivationKey, moveOptionFocus } from '../../shared/keyboard';
import { Size } from '../../shared/size';

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type DropdownValue = string | number;
export type DropdownSize = Size;

const ICON_SIZE: Record<DropdownSize, number> = { sm: 14, md: 16, lg: 18 };

let nextId = 0;

@Component({
  selector: 'ngx-ds-dropdown',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  // ── Configuration ──────────────────────────────────────────
  readonly options = input<DropdownOption[]>([]);
  readonly label = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly placeholder = input<string>('Seleccionar...');
  readonly size = input<DropdownSize>('md');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');

  // ── Value ─────────────────────────────────────────────────
  readonly value = model<DropdownValue | null>(null);

  readonly id = `ngx-dropdown-${nextId++}`;

  // ── Icons ──────────────────────────────────────────────────
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;
  readonly CheckIcon = Check;
  readonly XIcon = X;

  // ── Internal state ─────────────────────────────────────────
  readonly #open = signal(false);
  readonly #disabled = signal(false);
  readonly #focused = signal(false);

  readonly isOpen = this.#open.asReadonly();
  readonly isDisabled = this.#disabled.asReadonly();

  readonly iconSize = computed(() => ICON_SIZE[this.size()]);
  readonly hasError = computed(() => this.errorMessage().length > 0);

  readonly hasValue = computed(() => this.value() !== null && this.value() !== undefined);

  readonly isFloating = computed(() => this.#focused() || this.hasValue());

  readonly displayText = computed(() => {
    const v = this.value();
    if (v === null || v === undefined) return '';
    return this.options().find((o) => o.value === v)?.label ?? String(v);
  });

  readonly triggerClasses = computed(() => {
    const base = 'ngx-dropdown__trigger';
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
    const base = 'ngx-dropdown__float-label';
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

  onOptionKeydown(event: KeyboardEvent, option: DropdownOption): void {
    if (moveOptionFocus(event)) return;
    if (!isActivationKey(event)) return;
    event.preventDefault();
    this.selectOption(option);
    if (!this.isOpen()) this.triggerRef()?.nativeElement.focus();
  }

  #focusFirstOptionAfterRender(): void {
    afterNextRender(() => focusFirstOption(document.getElementById(this.id + '-panel')), {
      injector: this.#injector,
    });
  }

  #closeOnEscape(): void {
    if (!this.isOpen()) return;
    this.#open.set(false);
    this.triggerRef()?.nativeElement.focus();
  }

  togglePanel(): void {
    if (this.isDisabled()) return;
    this.#open.update((v) => !v);
    this.#focused.set(this.#open());
  }

  isSelected(optionValue: DropdownValue): boolean {
    return this.value() === optionValue;
  }

  selectOption(option: DropdownOption): void {
    if (option.disabled || this.isDisabled()) return;
    this.value.set(option.value);
    this.onChange(option.value);
    this.#open.set(false);
    this.#focused.set(false);
  }

  clearValue(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.value.set(null);
    this.onChange(null);
  }

  // ── CVA ───────────────────────────────────────────────────
  private onChange: (v: DropdownValue | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: DropdownValue | null): void {
    this.value.set(v ?? null);
  }
  registerOnChange(fn: (v: DropdownValue | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#disabled.set(disabled);
  }
}
