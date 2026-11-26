import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { LucideX as X } from '@lucide/angular';
import { IconButtonComponent } from '../../atoms/icon-button/icon-button.component';
import { setupEscapeClose } from '../../shared/escape-close';
import { setupOverlay } from '../../shared/overlay-stack';
import { FocusTrapDirective } from '../../directives/focus-trap/focus-trap.directive';
import { NGX_DS_LABELS } from '../../shared/labels';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'ngx-ds-modal',
  standalone: true,
  imports: [IconButtonComponent, FocusTrapDirective],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  protected readonly icons = { X };

  // ── Inputs ───────────────────────────────────────────────────────────────
  readonly open = model<boolean>(false);
  readonly size = input<ModalSize>('md');
  readonly title = input<string>('');
  /** Shows the close button in the header. */
  readonly dismissible = input<boolean>(true);
  readonly closeOnBackdrop = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);

  // ── Outputs ──────────────────────────────────────────────────────────────
  readonly closed = output<void>();

  // ── Derived ──────────────────────────────────────────────────────────────
  readonly panelClasses = computed(() => `modal modal--${this.size()}`);

  constructor() {
    const isTop = setupOverlay(this.open);
    setupEscapeClose(() => {
      if (this.open() && this.closeOnEscape() && isTop()) this.close();
    });
  }

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) this.close();
  }
}
