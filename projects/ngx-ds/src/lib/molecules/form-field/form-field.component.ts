import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  afterRenderEffect,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

let nextId = 0;

@Component({
  selector: 'ngx-ds-form-field',
  standalone: true,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly for = input<string | null>(null);

  private readonly generatedId = `ngx-ff-${nextId++}`;

  /** The id the projected control brought with it, if any. */
  readonly #controlId = signal<string | null>(null);

  readonly fieldId = computed(() => this.for() ?? this.#controlId() ?? this.generatedId);
  readonly hintId = computed(() => `${this.fieldId()}-hint`);
  readonly errorId = computed(() => `${this.fieldId()}-error`);
  readonly errorText = computed(() => this.errorMessage());

  /** The message id this field last added to the control's aria-describedby. */
  #describedBy: string | null = null;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  constructor() {
    afterRenderEffect(() => {
      const control = this.host.nativeElement.querySelector('input, select, textarea');
      if (!control) return;

      const ownId = control.getAttribute('id');
      if (ownId) {
        // Keep the control's id and point the label and messages at it.
        if (!this.for()) this.#controlId.set(ownId);
      } else {
        this.renderer.setAttribute(control, 'id', this.fieldId());
      }

      if (this.required()) {
        this.renderer.setAttribute(control, 'aria-required', 'true');
      } else {
        this.renderer.removeAttribute(control, 'aria-required');
      }

      const hasError = this.errorText().length > 0;
      const hasHint = this.hint().length > 0;

      if (hasError) this.renderer.setAttribute(control, 'aria-invalid', 'true');
      else this.renderer.removeAttribute(control, 'aria-invalid');

      // Keep any description the control brought with it; swap only our own message id.
      const message = hasError ? this.errorId() : hasHint ? this.hintId() : null;
      const own = (control.getAttribute('aria-describedby') ?? '')
        .split(/\s+/)
        .filter((id: string) => id && id !== this.#describedBy);
      const ids = message ? [...own, message] : own;
      if (ids.length) this.renderer.setAttribute(control, 'aria-describedby', ids.join(' '));
      else this.renderer.removeAttribute(control, 'aria-describedby');
      this.#describedBy = message;
    });
  }
}
