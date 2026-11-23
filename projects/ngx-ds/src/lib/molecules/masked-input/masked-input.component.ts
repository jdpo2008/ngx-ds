import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { LucideIconData } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { FieldErrors, fieldErrorText, fieldHasError } from '../../shared/field-error';
import { Size } from '../../shared/size';
import { applyMask, caretAfter, extractRaw, isMaskToken, maskGuide, tokenCount } from './mask';

export type MaskedInputSize = Size;

const ICON_SIZE: Record<MaskedInputSize, number> = { sm: 14, md: 16, lg: 18 };

let nextId = 0;

/**
 * Text field that formats what the user types with a mask such as `(999) 999-9999`.
 * Tokens: `9` digit, `a` letter, `A` letter in upper case, `*` letter or digit;
 * every other character is a literal inserted automatically.
 */
@Component({
  selector: 'ngx-ds-masked-input',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './masked-input.component.html',
  // Same look as ngx-ds-input: it reuses its styles and class names.
  styleUrl: '../input/input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskedInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MaskedInputComponent),
      multi: true,
    },
  ],
})
export class MaskedInputComponent implements ControlValueAccessor, Validator {
  // ── Configuration ────────────────────────────────────────────
  readonly mask = input.required<string>();
  /** When true, `value` includes the literals (`(555) 123-4567`); otherwise only `5551234567`. */
  readonly keepLiterals = input<boolean>(false);
  readonly label = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  /** Defaults to the shape of the mask, e.g. `(___) ___-____`. */
  readonly placeholder = input<string | undefined>(undefined);
  readonly size = input<MaskedInputSize>('md');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  /** Set by Signal Forms `[formField]`. Its errors show once the field is touched. */
  readonly errors = input<FieldErrors>([]);
  readonly touched = input<boolean>(false);
  readonly iconLeft = input<LucideIconData | undefined>(undefined);
  readonly autocomplete = input<string | null>(null);
  readonly readonly = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  // ── Value — two-way bindable (signal forms) ──────────────────
  readonly value = model<string>('');

  readonly id = `ngx-masked-input-${nextId++}`;
  readonly messageId = `${this.id}-message`;

  // ── Internal state ───────────────────────────────────────────
  readonly #cvaDisabled = signal(false);
  readonly #focused = signal(false);

  readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  readonly isFocused = this.#focused.asReadonly();

  // ── Derived ──────────────────────────────────────────────────
  readonly #result = computed(() => applyMask(extractRaw(this.value(), this.mask()), this.mask()));
  /** Formatted text shown in the field. */
  readonly display = computed(() => this.#result().masked);
  /** True when every slot of the mask is filled. */
  readonly isComplete = computed(() => this.#result().raw.length === tokenCount(this.mask()));

  readonly inputMode = computed(() =>
    [...this.mask()].filter(isMaskToken).every((t) => t === '9') ? 'numeric' : 'text',
  );

  readonly isFloating = computed(() => this.#focused() || this.display().length > 0);

  readonly hasError = computed(() =>
    fieldHasError(this.errorMessage(), this.errors(), this.touched()),
  );
  readonly errorText = computed(() =>
    fieldErrorText(this.errorMessage(), this.errors(), this.touched()),
  );

  readonly iconSize = computed(() => ICON_SIZE[this.size()]);

  readonly effectivePlaceholder = computed(() => {
    if (this.floatingLabel() && this.label() && !this.isFloating()) return '';
    return this.placeholder() ?? maskGuide(this.mask());
  });

  readonly fieldClasses = computed(() => {
    const base = 'ngx-input__field';
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
    const base = 'ngx-input__float-label';
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

  // ── Events ───────────────────────────────────────────────────
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const mask = this.mask();
    const caret = el.selectionStart ?? el.value.length;

    const result = applyMask(extractRaw(el.value, mask), mask);
    const before = applyMask(extractRaw(el.value.slice(0, caret), mask), mask).raw.length;

    // Write the formatted text now: when it is unchanged (a rejected key) the binding won't.
    el.value = result.masked;
    const pos = caretAfter(result.masked, mask, before);
    el.setSelectionRange(pos, pos);

    const next = this.keepLiterals() ? result.masked : result.raw;
    if (next !== this.value()) {
      this.value.set(next);
      this.onChange(next);
    }
  }

  onFocus(): void {
    this.#focused.set(true);
  }

  onBlur(): void {
    this.#focused.set(false);
    this.onTouched();
  }

  // ── CVA ──────────────────────────────────────────────────────
  writeValue(v: string | null): void {
    // Forms may hand over a number (e.g. a numeric FormControl).
    this.value.set(v == null ? '' : String(v));
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }

  // ── Validator (reactive / template-driven forms) ─────────────
  validate(control: AbstractControl): ValidationErrors | null {
    const mask = this.mask();
    const raw = applyMask(extractRaw(String(control.value ?? ''), mask), mask).raw;
    const required = tokenCount(mask);
    if (raw.length === 0 || raw.length === required) return null;
    return { mask: { requiredLength: required, actualLength: raw.length } };
  }
}
