import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  afterNextRender,
  computed,
  input,
  model,
  output,
  signal,
  inject,
} from '@angular/core';
import { Search } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { KbdComponent } from '../../atoms/kbd/kbd.component';
import { FocusTrapDirective } from '../../directives/focus-trap/focus-trap.directive';
import { NGX_DS_LABELS } from '../../shared/labels';

export interface CommandItem {
  id: string | number;
  label: string;
  description?: string;
  category?: string;
  keywords?: string[];
  kbd?: string[];
  disabled?: boolean;
}

let nextId = 0;

@Component({
  selector: 'ngx-ds-command-palette',
  standalone: true,
  imports: [IconComponent, KbdComponent, FocusTrapDirective],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'onKeydown($event)' },
})
export class CommandPaletteComponent {
  readonly i18n = inject(NGX_DS_LABELS);
  readonly #injector = inject(Injector);

  readonly open = model<boolean>(false);
  readonly items = input<CommandItem[]>([]);
  readonly placeholder = input<string | undefined>(undefined);
  readonly openShortcut = input<string>('k'); // activated with Ctrl/Cmd + this key

  readonly itemSelect = output<CommandItem>();

  readonly SearchIcon = Search;

  readonly #query = signal('');
  readonly #cursor = signal(0);

  readonly query = this.#query.asReadonly();

  readonly filteredItems = computed(() => {
    const q = this.#query().toLowerCase().trim();
    if (!q) return this.items();
    return this.items().filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.toLowerCase().includes(q)),
    );
  });

  readonly categories = computed(() => {
    const cats = new Map<string, CommandItem[]>();
    for (const item of this.filteredItems()) {
      const cat = item.category ?? '';
      if (!cats.has(cat)) cats.set(cat, []);
      cats.get(cat)!.push(item);
    }
    return Array.from(cats.entries()).map(([cat, items]) => ({ cat, items }));
  });

  /** Items in the order they are rendered (grouped by category), which the cursor follows. */
  readonly flatItems = computed(() => this.categories().flatMap((group) => group.items));

  readonly listboxId = `ngx-cp-listbox-${nextId++}`;

  optionId(item: CommandItem): string {
    return `${this.listboxId}-option-${item.id}`;
  }

  groupLabelId(index: number): string {
    return `${this.listboxId}-group-${index}`;
  }

  /**
   * Index of the active option. Disabled items can't be active: when the cursor
   * lands on one (e.g. the first item is disabled), the nearest enabled item
   * after it, or else before it, is used. -1 when nothing can be active.
   */
  readonly activeIndex = computed(() => {
    const items = this.flatItems();
    if (items.length === 0) return -1;
    const cursor = Math.min(this.#cursor(), items.length - 1);
    for (let i = cursor; i < items.length; i++) if (!items[i].disabled) return i;
    for (let i = cursor - 1; i >= 0; i--) if (!items[i].disabled) return i;
    return -1;
  });

  readonly activeOptionId = computed(() => {
    const item = this.flatItems()[this.activeIndex()];
    return item ? this.optionId(item) : null;
  });

  /** Text of the polite live region: the result count, or the empty message. */
  readonly resultsAnnouncement = computed(() => {
    const count = this.filteredItems().length;
    if (count > 0) return this.i18n.commandResults?.(count) ?? String(count);
    const q = this.#query().trim();
    return q ? this.i18n.noResultsFor(q) : this.i18n.noResults;
  });

  onSearch(event: Event): void {
    this.#query.set((event.target as HTMLInputElement).value);
    this.#cursor.set(0);
  }

  selectItem(item: CommandItem): void {
    if (item.disabled) return;
    this.itemSelect.emit(item);
    this.close();
  }

  close(): void {
    this.open.set(false);
    this.#query.set('');
    this.#cursor.set(0);
  }

  isActive(item: CommandItem): boolean {
    const idx = this.flatItems().indexOf(item);
    return idx !== -1 && idx === this.activeIndex();
  }

  /** Mouse hover moves the cursor, so hover and keyboard share one active option. */
  hover(item: CommandItem): void {
    if (item.disabled) return;
    const idx = this.flatItems().indexOf(item);
    if (idx !== -1) this.#cursor.set(idx);
  }

  /** Moves the cursor to the next enabled item in `direction`, staying put at either end. */
  #move(direction: 1 | -1): void {
    const items = this.flatItems();
    for (let i = this.activeIndex() + direction; i >= 0 && i < items.length; i += direction) {
      if (!items[i].disabled) {
        this.#cursor.set(i);
        this.#scrollActiveIntoView();
        return;
      }
    }
  }

  #scrollActiveIntoView(): void {
    afterNextRender(
      () => {
        const id = this.activeOptionId();
        const el = id ? document.getElementById(id) : null;
        el?.scrollIntoView?.({ block: 'nearest' });
      },
      { injector: this.#injector },
    );
  }

  onKeydown(event: KeyboardEvent): void {
    const shortcut = this.openShortcut().toLowerCase();
    // Compare case-insensitively: Caps Lock or Shift turn `k` into `K`.
    if ((event.ctrlKey || event.metaKey) && event.key?.toLowerCase() === shortcut) {
      event.preventDefault();
      this.open.update((v) => !v);
      return;
    }

    if (!this.open()) return;

    const items = this.flatItems();
    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.#move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.#move(-1);
        break;
      case 'Enter': {
        const selected = items[this.activeIndex()];
        if (selected) this.selectItem(selected);
        break;
      }
    }
  }
}
