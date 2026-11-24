import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
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

/**
 * Opens a menu on right click, Shift+F10 or the ContextMenu key over the projected content.
 * Keyboard users can only open it when the projected target is focusable: give it
 * `tabindex="0"` (or use a focusable element) and an accessible name.
 */
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

  private readonly injector = inject(Injector);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly menuRef = viewChild(MenuComponent);
  private lastActive: HTMLElement | null = null;
  private frame = 0;

  readonly isOpen = signal(false);
  readonly visible = signal(false);
  readonly posX = signal(0);
  readonly posY = signal(0);

  constructor() {
    setupClickOutside(() => this.close());
    setupEscapeClose(() => this.close(), this.isOpen);
    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this.frame));
  }

  onContextMenu(event: MouseEvent): void {
    if (this.disabled()) return;
    event.preventDefault();

    // Reopening in place keeps the element that had focus before the first open.
    if (!this.isOpen()) this.lastActive = this.doc.activeElement as HTMLElement | null;
    const { x, y } = this.anchorPoint(event);
    this.posX.set(x);
    this.posY.set(y);
    this.visible.set(false);
    this.isOpen.set(true);
    this.opened.emit();

    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.clampPosition());
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
    // The panel is `visibility: hidden` until now, and a hidden element can't take focus:
    // focus the first item once the visible class has been rendered.
    afterNextRender(() => this.menuRef()?.focusFirst(), { injector: this.injector });
  }

  /**
   * Where to open the menu. Shift+F10 and the ContextMenu key fire `contextmenu` on the
   * focused element with no pointer position (0, 0): open below that element instead.
   */
  private anchorPoint(event: MouseEvent): { x: number; y: number } {
    if (event.clientX !== 0 || event.clientY !== 0) return { x: event.clientX, y: event.clientY };
    const target = event.target instanceof Element ? event.target : null;
    const rect = target?.getBoundingClientRect();
    return rect ? { x: rect.left, y: rect.bottom } : { x: 0, y: 0 };
  }
}
