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
import { LucideChevronRight as ChevronRight } from '@lucide/angular';
import { IconInput } from '../../atoms/icon/icon.types';
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

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly itemBtns = viewChildren<ElementRef<HTMLButtonElement>>('itemBtn');

  /** Set when this menu is a submenu of another menu. */
  private readonly parentMenu = inject(MenuComponent, { optional: true, skipSelf: true });

  private readonly submenus = viewChildren(MenuComponent);

  readonly activeIndex = signal(0);
  /** Set once the user moves through the items; from then on disabled items can hold focus. */
  readonly #moved = signal(false);
  /**
   * The item that holds the tab stop: the active one, or the first enabled one while the
   * user hasn't moved yet and the active one is disabled.
   */
  readonly focusIndex = computed(() => {
    const items = this.items();
    const i = this.activeIndex();
    if (items[i] && (!items[i].disabled || this.#moved())) return i;
    const first = items.findIndex((it) => !it.disabled);
    return first === -1 ? i : first;
  });
  readonly openSubmenu = signal<string | null>(null);
  readonly chevronRight: IconInput = ChevronRight;

  readonly iconSize = computed(() => ICON_SIZE[this.size()]);

  constructor() {
    afterNextRender(() => {
      if (this.autofocus()) this.focusFirst();
    });
  }

  /** Moves focus to the first enabled item. */
  focusFirst(): void {
    const first = this.nextEnabled(-1, 1);
    this.activeIndex.set(first);
    this.focusItem(first);
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
        this.moveTo(0);
        break;
      case 'End':
        event.preventDefault();
        this.moveTo(items.length - 1);
        break;
      case 'ArrowRight':
      case 'Enter': {
        // Keys bubbling up from an open submenu belong to the submenu's items (index -1).
        const index = this.targetIndex(event);
        const item = items[index];
        if (item?.children?.length && !item.disabled) {
          event.preventDefault();
          this.activeIndex.set(index);
          this.openAndFocusSubmenu(item);
        } else {
          handled = false;
        }
        break;
      }
      case 'ArrowLeft':
        // Only a submenu closes on ArrowLeft; a top-level menu has nothing to go back to.
        if (this.parentMenu) {
          event.preventDefault();
          this.closed.emit();
        } else {
          handled = false;
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.closed.emit();
        break;
      case 'Tab':
        // Tab leaves the whole menu: a submenu lets it bubble to the top-level menu, which
        // closes without preventDefault so focus moves on naturally.
        if (this.parentMenu) handled = false;
        else this.closed.emit();
        break;
      default:
        handled = this.typeahead(event);
    }
    // A submenu sits inside its parent's host: keep its keys from also moving
    // the parent or reaching document-level Escape handlers.
    if (handled && this.parentMenu) event.stopPropagation();
  }

  /** Focuses the next enabled item whose label starts with the typed character. */
  private typeahead(event: KeyboardEvent): boolean {
    const { key } = event;
    if (key.length !== 1 || key === ' ' || event.ctrlKey || event.metaKey || event.altKey) {
      return false;
    }
    const items = this.items();
    const count = items.length;
    const char = key.toLocaleLowerCase();
    const start = this.focusIndex();
    for (let step = 1; step <= count; step++) {
      const i = (start + step) % count;
      const item = items[i];
      if (!item.disabled && item.label.trim().toLocaleLowerCase().startsWith(char)) {
        this.moveTo(i);
        break;
      }
    }
    return true;
  }

  private openAndFocusSubmenu(item: MenuItem): void {
    if (this.openSubmenu() === item.id) {
      // Already open: the submenu won't autofocus again, so move focus into it here.
      this.submenus()[0]?.focusFirst();
    } else {
      this.openSubmenu.set(item.id);
    }
  }

  /** The index of the item the key was pressed on, the tab stop for the host, or -1. */
  private targetIndex(event: KeyboardEvent): number {
    const target = event.target;
    if (target === this.host.nativeElement) return this.focusIndex();
    return this.itemBtns().findIndex((b) => b.nativeElement === target);
  }

  private moveActive(dir: 1 | -1): void {
    const count = this.items().length;
    this.moveTo((this.focusIndex() + dir + count) % count);
  }

  private moveTo(index: number): void {
    this.#moved.set(true);
    this.activeIndex.set(index);
    this.focusItem(index);
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
