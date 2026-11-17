import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  OnDestroy,
  output,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { X } from 'lucide-angular';
import { IconButtonComponent } from '../../atoms/icon-button/icon-button.component';
import { setupEscapeClose } from '../../shared/escape-close';
import { FocusTrapDirective } from '../../directives/focus-trap/focus-trap.directive';
import { NGX_DS_LABELS } from '../../shared/labels';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'ngx-ds-drawer',
  standalone: true,
  imports: [IconButtonComponent, FocusTrapDirective],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent implements OnDestroy {
  readonly i18n = inject(NGX_DS_LABELS);

  private readonly doc = inject(DOCUMENT);

  protected readonly icons = { X };

  // ── Inputs ───────────────────────────────────────────────────────────────
  readonly open = model<boolean>(false);
  readonly side = input<DrawerSide>('right');
  readonly size = input<DrawerSize>('md');
  readonly title = input<string>('');
  readonly showClose = input<boolean>(true);
  readonly closeOnBackdrop = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);

  // ── Outputs ──────────────────────────────────────────────────────────────
  readonly closed = output<void>();

  // ── Derived ──────────────────────────────────────────────────────────────
  readonly panelClasses = computed(() => `drawer drawer--${this.side()} drawer--${this.size()}`);

  constructor() {
    effect(() => {
      this.doc.body.style.overflow = this.open() ? 'hidden' : '';
    });

    setupEscapeClose(() => {
      if (this.open() && this.closeOnEscape()) this.close();
    });
  }

  ngOnDestroy(): void {
    this.doc.body.style.overflow = '';
  }

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) this.close();
  }
}
