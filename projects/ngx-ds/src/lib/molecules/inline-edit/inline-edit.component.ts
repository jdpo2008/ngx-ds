import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Check, Pencil, X } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { NGX_DS_LABELS } from '../../shared/labels';
import { Size } from '../../shared/size';

export type InlineEditSize = Size;

const ICON_SIZE: Record<InlineEditSize, number> = { sm: 12, md: 14, lg: 16 };

/**
 * Text that turns into a field on click. Enter (Ctrl/⌘+Enter when `multiline`) or
 * blur saves, Escape restores the previous value.
 *
 * Works with `[(value)]`, reactive forms and Signal Forms `[formField]`.
 */
@Component({
  selector: 'ngx-ds-inline-edit',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './inline-edit.component.html',
  styleUrl: './inline-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InlineEditComponent),
      multi: true,
    },
  ],
})
export class InlineEditComponent implements ControlValueAccessor {
  readonly i18n = inject(NGX_DS_LABELS);
  readonly #injector = inject(Injector);

  // ── Configuration ────────────────────────────────────────────
  /** Names the field for assistive tech ("Edit <label>"). Not shown. */
  readonly label = input<string>('');
  /** Shown, muted, while the value is empty. */
  readonly placeholder = input<string>('');
  readonly size = input<InlineEditSize>('md');
  /** Uses a textarea. Enter adds a line, Ctrl/⌘+Enter saves. */
  readonly multiline = input<boolean>(false);
  /** An empty value is not saved: the previous one is restored. */
  readonly required = input<boolean>(false);
  /** Shows save and cancel buttons while editing. */
  readonly showActions = input<boolean>(false);
  /** Saves when the field loses focus. With `false`, leaving the field cancels. */
  readonly saveOnBlur = input<boolean>(true);
  readonly disabled = input<boolean>(false);

  // ── Value ─────────────────────────────────────────────────────
  readonly value = model<string>('');
  /** Whether the field is being edited. Bind it to start editing from outside. */
  readonly editing = model<boolean>(false);

  /** Emits the new value when an edit is saved and the value changed. */
  readonly saved = output<string>();
  /** Emits when an edit is cancelled. */
  readonly cancelled = output<void>();

  private readonly fieldRef =
    viewChild<ElementRef<HTMLInputElement | HTMLTextAreaElement>>('field');
  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  readonly #draft = signal('');
  readonly #cvaDisabled = signal(false);

  readonly draft = this.#draft.asReadonly();
  readonly isDisabled = computed(() => this.disabled() || this.#cvaDisabled());
  readonly isEmpty = computed(() => this.value().trim() === '');
  readonly iconSize = computed(() => ICON_SIZE[this.size()]);
  readonly triggerLabel = computed(() => this.i18n.edit(this.label()));
  readonly hostClasses = computed(() =>
    [
      'ie',
      `ie--${this.size()}`,
      this.multiline() ? 'ie--multiline' : '',
      this.isDisabled() ? 'ie--disabled' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  readonly icons = { Pencil, Check, X };

  constructor() {
    // Entering edit mode, from a click or from a bound `[(editing)]`, starts a draft
    // from the current value and focuses the field.
    // A disabled field can't be edited: an edit in progress is cancelled, and a bound
    // `[editing]` is turned back off.
    let wasEditing = false;
    effect(() => {
      const editing = this.editing();
      if (editing && this.isDisabled()) {
        untracked(() => (wasEditing ? this.cancel() : this.editing.set(false)));
        wasEditing = false;
        return;
      }
      if (editing && !wasEditing) untracked(() => this.#begin());
      wasEditing = editing;
    });
  }

  // ── Actions ──────────────────────────────────────────────────
  edit(): void {
    if (this.isDisabled()) return;
    this.editing.set(true);
  }

  save(): void {
    if (!this.editing()) return;
    const next = this.multiline() ? this.#draft() : this.#draft().trim();
    if (this.required() && next.trim() === '') {
      this.cancel();
      return;
    }
    this.#end();
    if (next !== this.value()) {
      this.value.set(next);
      this.onChange(next);
      this.saved.emit(next);
    }
    this.onTouched();
  }

  cancel(): void {
    if (!this.editing()) return;
    this.#end();
    this.onTouched();
    this.cancelled.emit();
  }

  onInput(event: Event): void {
    this.#draft.set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }

  onKeydown(event: KeyboardEvent): void {
    // Enter or Escape while composing (Japanese, Chinese…) belongs to the IME.
    if (event.isComposing) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.cancel();
      this.#focusTrigger();
    } else if (event.key === 'Enter' && (!this.multiline() || event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.save();
      this.#focusTrigger();
    }
  }

  onBlur(event: FocusEvent): void {
    // Moving to the save/cancel buttons is not leaving the field.
    const next = event.relatedTarget as Node | null;
    if (next && (event.currentTarget as HTMLElement).parentElement?.contains(next)) return;
    if (this.saveOnBlur()) this.save();
    else this.cancel();
  }

  onAction(kind: 'save' | 'cancel'): void {
    if (kind === 'save') this.save();
    else this.cancel();
    this.#focusTrigger();
  }

  #begin(): void {
    this.#draft.set(this.value());
    afterNextRender(
      () => {
        const field = this.fieldRef()?.nativeElement;
        field?.focus();
        field?.select();
      },
      { injector: this.#injector },
    );
  }

  #end(): void {
    this.editing.set(false);
  }

  #focusTrigger(): void {
    afterNextRender(() => this.triggerRef()?.nativeElement.focus(), { injector: this.#injector });
  }

  // ── CVA ──────────────────────────────────────────────────────
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string | null): void {
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
