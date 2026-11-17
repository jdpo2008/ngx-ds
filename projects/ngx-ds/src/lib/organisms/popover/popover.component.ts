import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';

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
  readonly open = model<boolean>(false);
  readonly placement = input<PopoverPlacement>('bottom');
  readonly closeOnClickOutside = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>('Popover');

  readonly opened = output<void>();
  readonly closed = output<void>();

  readonly panelClasses = computed(() => `popover__panel popover__panel--${this.placement()}`);

  toggle(): void {
    if (this.disabled()) return;
    this.open.update((v) => !v);
    if (this.open()) this.opened.emit();
    else this.closed.emit();
  }

  constructor() {
    setupEscapeClose(() => {
      if (this.open() && this.closeOnEscape()) this.close();
    });

    setupClickOutside(() => {
      if (!this.open() || !this.closeOnClickOutside()) return;
      this.close();
    });
  }

  private close(): void {
    this.open.set(false);
    this.closed.emit();
  }
}
