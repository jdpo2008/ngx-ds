import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
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
})
export class CommandPaletteComponent {
  readonly i18n = inject(NGX_DS_LABELS);

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

  readonly flatItems = computed(() => this.filteredItems());

  readonly listboxId = `ngx-cp-listbox-${nextId++}`;

  optionId(item: CommandItem): string {
    return `${this.listboxId}-option-${item.id}`;
  }

  readonly activeOptionId = computed(() => {
    const item = this.flatItems()[this.#cursor()];
    return item ? this.optionId(item) : null;
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
    return idx === this.#cursor();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const shortcut = this.openShortcut();
    if ((event.ctrlKey || event.metaKey) && event.key === shortcut) {
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
        this.#cursor.update((c) => Math.min(c + 1, items.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.#cursor.update((c) => Math.max(c - 1, 0));
        break;
      case 'Enter': {
        const selected = items[this.#cursor()];
        if (selected) this.selectItem(selected);
        break;
      }
    }
  }
}
