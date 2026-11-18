import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TagComponent } from '../../atoms/tag/tag.component';
import { FieldErrors, fieldErrorText, fieldHasError } from '../../shared/field-error';
import { Size } from '../../shared/size';

export type TagInputSize = Size;

let nextId = 0;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Component({
  selector: 'ngx-ds-tag-input',
  standalone: true,
  imports: [TagComponent],
  templateUrl: './tag-input.component.html',
  styleUrl: './tag-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true,
    },
  ],
})
export class TagInputComponent implements ControlValueAccessor {
  // ── Configuration ────────────────────────────────────────────
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly size = input<TagInputSize>('md');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  /** Set by Signal Forms `[formField]`. Its errors show once the field is touched. */
  readonly errors = input<FieldErrors>([]);
  readonly touched = input<boolean>(false);
  /**
   * Keys that turn the typed text into a tag. `Enter` is a key name; any other
   * entry is a character, which also splits pasted text.
   */
  readonly separators = input<string[]>(['Enter', ',']);
  /** Maximum number of tags. `null` means no limit. */
  readonly maxTags = input<number | null>(null);
  readonly allowDuplicates = input<boolean>(false);
  /** Adds the pending text as a tag when the field loses focus. */
  readonly addOnBlur = input<boolean>(true);

  // ── Value — two-way bindable ─────────────────────────────────
  readonly value = model<string[]>([]);

  readonly added = output<string>();
  readonly removed = output<string>();

  readonly id = `ngx-tag-input-${nextId++}`;
  readonly messageId = `${this.id}-message`;

  private readonly native = viewChild.required<ElementRef<HTMLInputElement>>('native');

  // ── Internal state ───────────────────────────────────────────
  readonly disabled = input<boolean>(false);
  readonly #cvaDisabled = signal(false);
  readonly #focused = signal(false);
  readonly text = signal('');

  readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  readonly isFocused = this.#focused.asReadonly();

  // ── Derived ──────────────────────────────────────────────────
  readonly isFull = computed(() => {
    const max = this.maxTags();
    return max !== null && this.value().length >= max;
  });

  readonly hasError = computed(() =>
    fieldHasError(this.errorMessage(), this.errors(), this.touched()),
  );
  readonly errorText = computed(() =>
    fieldErrorText(this.errorMessage(), this.errors(), this.touched()),
  );

  /** The placeholder only shows while there are no tags. */
  readonly effectivePlaceholder = computed(() => (this.value().length ? '' : this.placeholder()));

  readonly fieldClasses = computed(() => {
    const base = 'ngx-tag-input__field';
    return [
      base,
      `${base}--${this.size()}`,
      this.isFocused() ? `${base}--focused` : '',
      this.hasError() ? `${base}--error` : '',
      this.isDisabled() ? `${base}--disabled` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  readonly #charSeparators = computed(() => this.separators().filter((s) => s.length === 1));

  // ── CVA ──────────────────────────────────────────────────────
  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string[] | null): void {
    this.value.set(Array.isArray(value) ? [...value] : []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.#cvaDisabled.set(disabled);
  }

  // ── Actions ──────────────────────────────────────────────────

  /** Adds the given labels, skipping blanks, duplicates and anything past `maxTags`. */
  addTags(labels: string[]): void {
    const next = [...this.value()];
    const max = this.maxTags();
    const accepted: string[] = [];
    for (const raw of labels) {
      const tag = raw.trim();
      if (!tag) continue;
      if (max !== null && next.length >= max) break;
      if (!this.allowDuplicates() && next.some((t) => t.toLowerCase() === tag.toLowerCase())) {
        continue;
      }
      next.push(tag);
      accepted.push(tag);
    }
    if (!accepted.length) return;
    this.#commit(next);
    accepted.forEach((tag) => this.added.emit(tag));
  }

  remove(index: number): void {
    if (this.isDisabled()) return;
    const tag = this.value()[index];
    if (tag === undefined) return;
    this.#commit(this.value().filter((_, i) => i !== index));
    this.removed.emit(tag);
  }

  focusInput(): void {
    if (!this.isDisabled()) this.native().nativeElement.focus();
  }

  // ── Event handlers ───────────────────────────────────────────

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const chars = this.#charSeparators();
    // A separator can arrive without a keydown (mobile keyboards, autocomplete).
    if (chars.some((c) => raw.includes(c))) {
      const parts = this.#split(raw);
      const rest = parts.pop() ?? '';
      this.addTags(parts);
      this.#setText(rest);
    } else {
      this.text.set(raw);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.isComposing) return;
    if (this.separators().includes(event.key)) {
      if (event.key === 'Enter' && !this.text().trim()) return;
      event.preventDefault();
      this.#addPending();
      return;
    }
    if (event.key === 'Backspace' && this.text() === '' && this.value().length) {
      event.preventDefault();
      this.remove(this.value().length - 1);
    }
  }

  onPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text') ?? '';
    const parts = this.#split(pasted);
    if (parts.length < 2) return;
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const before = input.value.slice(0, input.selectionStart ?? input.value.length);
    const after = input.value.slice(input.selectionEnd ?? input.value.length);
    parts[0] = before + parts[0];
    const rest = parts.pop()! + after;
    this.addTags(parts);
    this.#setText(rest);
  }

  onFocus(): void {
    this.#focused.set(true);
  }

  onBlur(): void {
    this.#focused.set(false);
    if (this.addOnBlur()) this.#addPending();
    this.onTouched();
  }

  // ── Helpers ──────────────────────────────────────────────────

  #addPending(): void {
    if (!this.text().trim()) return;
    if (!this.isFull()) this.addTags([this.text()]);
    this.#setText('');
  }

  #split(text: string): string[] {
    const chars = [...this.#charSeparators(), '\n'];
    return text.split(new RegExp(`[${chars.map(escapeRegExp).join('')}]`));
  }

  #setText(text: string): void {
    this.text.set(text);
    this.native().nativeElement.value = text;
  }

  #commit(next: string[]): void {
    this.value.set(next);
    this.onChange(next);
  }
}
