import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  signal,
  computed,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldErrors, fieldErrorText, fieldHasError } from '../../shared/field-error';
import { Size } from '../../shared/size';

export type TextareaSize = Size;
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

let nextId = 0;

@Component({
  selector: 'ngx-ds-textarea',
  standalone: true,
  imports: [],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  // ── Configuration ────────────────────────────────────────────
  readonly label = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly placeholder = input<string>('');
  readonly size = input<TextareaSize>('md');
  readonly resize = input<TextareaResize>('vertical');
  readonly rows = input<number>(3);
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  /** Set by Signal Forms `[formField]`. Its errors show once the field is touched. */
  readonly errors = input<FieldErrors>([]);
  readonly touched = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly maxLength = input<number | undefined>(undefined);
  readonly showCount = input<boolean>(false);

  // ── Value ─────────────────────────────────────────────────────
  readonly value = model<string>('');

  readonly id = `ngx-textarea-${nextId++}`;
  readonly messageId = `${this.id}-message`;

  // ── Internal state ────────────────────────────────────────────
  readonly #disabled = signal(false);
  readonly #focused = signal(false);

  readonly isDisabled = this.#disabled.asReadonly();
  readonly isFocused = this.#focused.asReadonly();

  // ── Derived ───────────────────────────────────────────────────
  readonly hasError = computed(() =>
    fieldHasError(this.errorMessage(), this.errors(), this.touched()),
  );
  readonly errorText = computed(() =>
    fieldErrorText(this.errorMessage(), this.errors(), this.touched()),
  );

  readonly isFloating = computed(() => this.#focused() || this.value().length > 0);

  readonly charCount = computed(() => this.value().length);

  readonly effectivePlaceholder = computed(() =>
    this.floatingLabel() && this.label() && !this.isFloating() ? '' : this.placeholder(),
  );

  readonly fieldClasses = computed(() => {
    const base = 'ngx-textarea__field';
    return [
      base,
      `${base}--${this.size()}`,
      `${base}--resize-${this.resize()}`,
      this.isFocused() ? `${base}--focused` : '',
      this.hasError() ? `${base}--error` : '',
      this.isDisabled() ? `${base}--disabled` : '',
      this.floatingLabel() ? `${base}--floating` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  readonly floatLabelClasses = computed(() => {
    const base = 'ngx-textarea__float-label';
    return [
      base,
      this.isFloating() ? `${base}--active` : '',
      this.isFocused() ? `${base}--focused` : '',
      this.hasError() ? `${base}--error` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  // ── CVA ───────────────────────────────────────────────────────
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value.set(val);
    this.onChange(val);
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
    this.#disabled.set(disabled);
  }
}
