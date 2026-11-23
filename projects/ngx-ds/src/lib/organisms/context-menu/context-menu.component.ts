import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MenuComponent } from '../../molecules/menu/menu.component';
import type { MenuItem } from '../../molecules/menu/menu.types';
import { Size } from '../../shared/size';
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';

export type { MenuItem } from '../../molecules/menu/menu.types';

@Component({
  selector: 'ngx-ds-context-menu',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuComponent {
  private readonly doc = inject(DOCUMENT);

  readonly items = input.required<MenuItem[]>();
  readonly disabled = input<boolean>(false);
  readonly size = input<Size>('md');

  readonly itemClick = output<MenuItem>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private lastActive: HTMLElement | null = null;

  readonly isOpen = signal(false);
  readonly visible = signal(false);
  readonly posX = signal(0);
  readonly posY = signal(0);

  constructor() {
    setupClickOutside(() => this.close());
    setupEscapeClose(() => this.close());
  }

  onContextMenu(event: MouseEvent): void {
    if (this.disabled()) return;
    event.preventDefault();

    // Reopening in place keeps the element that had focus before the first open.
    if (!this.isOpen()) this.lastActive = this.doc.activeElement as HTMLElement | null;
    this.posX.set(event.clientX);
    this.posY.set(event.clientY);
    this.visible.set(false);
    this.isOpen.set(true);
    this.opened.emit();

    requestAnimationFrame(() => this.clampPosition());
  }

  onMenuItemClick(item: MenuItem): void {
    this.itemClick.emit(item);
    this.close();
  }

  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.visible.set(false);
    this.closed.emit();
    this.lastActive?.focus?.();
    this.lastActive = null;
  }

  private clampPosition(): void {
    const el = this.panelRef()?.nativeElement;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vw = this.doc.documentElement.clientWidth;
    const vh = this.doc.documentElement.clientHeight;
    const margin = 8;

    let x = this.posX();
    let y = this.posY();

    if (x + rect.width > vw - margin) x = Math.max(margin, vw - rect.width - margin);
    if (y + rect.height > vh - margin) y = Math.max(margin, vh - rect.height - margin);

    this.posX.set(x);
    this.posY.set(y);
    this.visible.set(true);
  }
}
