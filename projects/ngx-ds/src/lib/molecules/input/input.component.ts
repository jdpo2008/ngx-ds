import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  signal,
  computed,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldErrors, fieldErrorText, fieldHasError } from '../../shared/field-error';
import { LucideIconData, Eye, EyeOff } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { Size } from '../../shared/size';
import { NGX_DS_LABELS } from '../../shared/labels';

export type InputSize = Size;
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

const ICON_SIZE: Record<InputSize, number> = { sm: 14, md: 16, lg: 18 };

let nextId = 0;

@Component({
  selector: 'ngx-ds-input',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  readonly i18n = inject(NGX_DS_LABELS);

  // ── Configuration ────────────────────────────────────────────
  readonly label = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly placeholder = input<string>('');
  readonly type = input<InputType>('text');
  readonly size = input<InputSize>('md');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  /** Set by Signal Forms `[formField]`. Its errors show once the field is touched. */
  readonly errors = input<FieldErrors>([]);
  readonly touched = input<boolean>(false);
  readonly iconLeft = input<LucideIconData | undefined>(undefined);
  readonly iconRight = input<LucideIconData | undefined>(undefined);
  readonly readonly = input<boolean>(false);

  // ── Value — two-way bindable (signal forms) ──────────────────
  readonly value = model<string>('');

  readonly id = `ngx-input-${nextId++}`;
  readonly messageId = `${this.id}-message`;

  // ── Internal state ───────────────────────────────────────────
  readonly disabled = input<boolean>(false);
  readonly #cvaDisabled = signal(false);
  readonly #focused = signal(false);
  readonly #showPassword = signal(false);

  readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  readonly isFocused = this.#focused.asReadonly();

  readonly eyeIcon = computed(() => (this.#showPassword() ? EyeOff : Eye));
  readonly effectiveType = computed(() =>
    this.type() === 'password' && this.#showPassword() ? 'text' : this.type(),
  );

  // ── Derived ──────────────────────────────────────────────────
  readonly isFloating = computed(() => this.#focused() || this.value().length > 0);

  readonly hasError = computed(() =>
    fieldHasError(this.errorMessage(), this.errors(), this.touched()),
  );
  readonly errorText = computed(() =>
    fieldErrorText(this.errorMessage(), this.errors(), this.touched()),
  );

  readonly iconSize = computed(() => ICON_SIZE[this.size()]);

  // In floating mode the placeholder only appears once the label has floated up
  readonly effectivePlaceholder = computed(() =>
    this.floatingLabel() && this.label() && !this.isFloating() ? '' : this.placeholder(),
  );

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

  // ── CVA ──────────────────────────────────────────────────────
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  togglePassword(): void {
    this.#showPassword.update((v) => !v);
  }

  onFocus(): void {
    this.#focused.set(true);
  }

  onBlur(): void {
    this.#focused.set(false);
    this.onTouched();
  }

  writeValue(v: string): void {
    this.value.set(v ?? '');
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
}
