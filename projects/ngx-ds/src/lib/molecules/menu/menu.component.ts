import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { ChevronRight, LucideIconData } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { KbdComponent } from '../../atoms/kbd/kbd.component';
import { DividerComponent } from '../../atoms/divider/divider.component';
import { Size } from '../../shared/size';
import type { MenuItem } from './menu.types';

export type MenuSize = Size;

const ICON_SIZE: Record<MenuSize, number> = { sm: 14, md: 16, lg: 18 };

@Component({
  selector: 'ngx-ds-menu',
  standalone: true,
  imports: [IconComponent, KbdComponent, DividerComponent, MenuComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'menu',
    '[attr.aria-label]': 'ariaLabel() || null',
    '(keydown)': 'onKeydown($event)',
  },
})
export class MenuComponent {
  readonly items = input.required<MenuItem[]>();
  readonly size = input<MenuSize>('md');
  readonly ariaLabel = input<string>('');
  readonly autofocus = input<boolean>(false);

  readonly itemClick = output<MenuItem>();
  readonly closed = output<void>();

  private readonly itemBtns = viewChildren<ElementRef<HTMLButtonElement>>('itemBtn');

  /** Set when this menu is a submenu of another menu. */
  private readonly parentMenu = inject(MenuComponent, { optional: true, skipSelf: true });

  readonly activeIndex = signal(0);
  /** The item that holds the tab stop: the active one, or the first enabled one if it is disabled. */
  readonly focusIndex = computed(() => {
    const items = this.items();
    const i = this.activeIndex();
    if (items[i] && !items[i].disabled) return i;
    const first = items.findIndex((it) => !it.disabled);
    return first === -1 ? i : first;
  });
  readonly openSubmenu = signal<string | null>(null);
  readonly chevronRight: LucideIconData = ChevronRight;

  readonly iconSize = computed(() => ICON_SIZE[this.size()]);

  constructor() {
    afterNextRender(() => {
      if (this.autofocus()) {
        this.focusItem(this.nextEnabled(-1, 1));
      }
    });
  }

  onItemClick(item: MenuItem, index: number): void {
    if (item.disabled) return;
    this.activeIndex.set(index);
    if (item.children?.length) {
      this.openSubmenu.set(this.openSubmenu() === item.id ? null : item.id);
      return;
    }
    this.itemClick.emit(item);
  }

  onSubmenuItemClick(item: MenuItem): void {
    this.itemClick.emit(item);
  }

  onSubmenuClosed(index: number): void {
    this.openSubmenu.set(null);
    this.focusItem(index);
  }

  onKeydown(event: KeyboardEvent): void {
    const items = this.items();
    if (items.length === 0) return;

    let handled = true;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveActive(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.activeIndex.set(this.nextEnabled(-1, 1));
        this.focusItem(this.activeIndex());
        break;
      case 'End':
        event.preventDefault();
        this.activeIndex.set(this.nextEnabled(items.length, -1));
        this.focusItem(this.activeIndex());
        break;
      case 'ArrowRight': {
        const item = items[this.focusIndex()];
        if (item?.children?.length && !item.disabled) {
          event.preventDefault();
          this.openSubmenu.set(item.id);
        } else {
          handled = false;
        }
        break;
      }
      case 'ArrowLeft':
      case 'Escape':
        event.preventDefault();
        this.closed.emit();
        break;
      default:
        handled = false;
    }
    // A submenu sits inside its parent's host: keep its keys from also moving
    // the parent or reaching document-level Escape handlers.
    if (handled && this.parentMenu) event.stopPropagation();
  }

  private moveActive(dir: 1 | -1): void {
    const next = this.nextEnabled(this.focusIndex(), dir);
    this.activeIndex.set(next);
    this.focusItem(next);
  }

  private nextEnabled(from: number, dir: 1 | -1): number {
    const items = this.items();
    const count = items.length;
    let i = from;
    for (let step = 0; step < count; step++) {
      i = (i + dir + count) % count;
      if (!items[i]?.disabled) return i;
    }
    return this.activeIndex();
  }

  private focusItem(index: number): void {
    this.itemBtns()[index]?.nativeElement.focus();
  }
}
