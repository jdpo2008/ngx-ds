import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  input,
  model,
  output,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';
import { NGX_DS_LABELS } from '../../shared/labels';

// A projected trigger that is already interactive (e.g. <ngx-ds-button>) handles
// focus and keyboard itself; the wrapper must not be a second, nested button.
const INTERACTIVE = 'button, a[href], input, select, textarea, [tabindex]';

let nextId = 0;

export type PopoverPlacement =
  'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';

@Component({
  selector: 'ngx-ds-popover',
  standalone: true,
  imports: [],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent {
  readonly i18n = inject(NGX_DS_LABELS);
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly panelId = `ngx-popover-${nextId++}`;

  readonly open = model<boolean>(false);
  readonly placement = input<PopoverPlacement>('bottom');
  readonly closeOnBackdrop = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly opened = output<void>();
  readonly closed = output<void>();

  private readonly triggerRef = viewChild.required<ElementRef<HTMLElement>>('trigger');
  /** The interactive element projected as trigger, if any. */
  readonly nativeTrigger = signal<HTMLElement | null>(null);

  readonly panelClasses = computed(() => `popover__panel popover__panel--${this.placement()}`);

  toggle(): void {
    if (this.disabled()) return;
    this.open.update((v) => !v);
    if (this.open()) this.opened.emit();
    else this.closed.emit();
  }

  /** Keyboard toggle for a non-interactive trigger; native ones fire `click`. */
  onTriggerKey(event: Event): void {
    if (this.nativeTrigger()) return;
    event.preventDefault();
    this.toggle();
  }

  constructor() {
    afterNextRender(() => {
      const el = this.triggerRef().nativeElement.querySelector<HTMLElement>(INTERACTIVE);
      this.nativeTrigger.set(el);
    });

    effect(() => {
      const el = this.nativeTrigger();
      if (!el) return;
      el.setAttribute('aria-haspopup', 'dialog');
      el.setAttribute('aria-expanded', String(this.open()));
      if (this.open()) el.setAttribute('aria-controls', this.panelId);
      else el.removeAttribute('aria-controls');
    });

    // Disabling an open popover closes it.
    effect(() => {
      if (this.disabled() && untracked(this.open)) this.close();
    });

    setupEscapeClose(() => {
      if (!this.open() || !this.closeOnEscape()) return;
      const hadFocus = this.#host.nativeElement.contains(document.activeElement);
      this.close();
      // The panel is removed, so focus would fall to <body>: return it to the trigger.
      if (hadFocus) (this.nativeTrigger() ?? this.triggerRef().nativeElement).focus();
    });

    setupClickOutside(() => {
      if (!this.open() || !this.closeOnBackdrop()) return;
      this.close();
    });
  }

  private close(): void {
    this.open.set(false);
    this.closed.emit();
  }
}
