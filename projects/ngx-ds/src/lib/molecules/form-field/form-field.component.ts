import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  afterRenderEffect,
  computed,
  inject,
  input,
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
  /** @deprecated Use `errorMessage`. Removed in 1.0. */
  readonly error = input<string>('');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly for = input<string | null>(null);

  private readonly generatedId = `ngx-ff-${nextId++}`;

  readonly fieldId = computed(() => this.for() ?? this.generatedId);
  readonly hintId = computed(() => `${this.fieldId()}-hint`);
  readonly errorId = computed(() => `${this.fieldId()}-error`);
  readonly errorText = computed(() => this.errorMessage() || this.error());

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  constructor() {
    afterRenderEffect(() => {
      const control = this.host.nativeElement.querySelector('input, select, textarea');
      if (!control) return;

      if (!control.getAttribute('id')) {
        this.renderer.setAttribute(control, 'id', this.fieldId());
      }

      const hasError = this.errorText().length > 0;
      const hasHint = this.hint().length > 0;

      if (hasError) {
        this.renderer.setAttribute(control, 'aria-describedby', this.errorId());
        this.renderer.setAttribute(control, 'aria-invalid', 'true');
      } else if (hasHint) {
        this.renderer.setAttribute(control, 'aria-describedby', this.hintId());
        this.renderer.removeAttribute(control, 'aria-invalid');
      } else {
        this.renderer.removeAttribute(control, 'aria-describedby');
        this.renderer.removeAttribute(control, 'aria-invalid');
      }
    });
  }
}
