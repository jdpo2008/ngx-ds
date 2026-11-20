import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  input,
  model,
  viewChildren,
} from '@angular/core';
import { TabComponent } from './tab.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { Size } from '../../shared/size';

export type TabsVariant = 'line' | 'pill' | 'enclosed';
export type TabsSize = Size;

const ICON_SIZE: Record<TabsSize, number> = { sm: 14, md: 16, lg: 18 };

let nextId = 0;

@Component({
  selector: 'ngx-ds-tabs',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabBtn');

  readonly tabs = contentChildren(TabComponent);
  readonly active = model<number>(0);
  readonly variant = input<TabsVariant>('line');
  readonly size = input<TabsSize>('md');
  readonly fullWidth = input<boolean>(false);

  readonly id = `ngx-tabs-${nextId++}`;

  tabId(index: number): string {
    return `${this.id}-tab-${index}`;
  }
  panelId(index: number): string {
    return `${this.id}-panel-${index}`;
  }

  readonly navClasses = computed(() => {
    const classes = ['tabs__nav', `tabs__nav--${this.variant()}`, `tabs__nav--${this.size()}`];
    if (this.fullWidth()) classes.push('tabs__nav--full');
    return classes.join(' ');
  });

  readonly iconSize = computed(() => ICON_SIZE[this.size()]);

  /** The tab shown: `active`, or the first enabled tab when `active` is disabled or out of range. */
  readonly selectedIndex = computed(() => {
    const tabs = this.tabs();
    const active = this.active();
    if (tabs[active] && !tabs[active].disabled()) return active;
    const first = tabs.findIndex((t) => !t.disabled());
    return first >= 0 ? first : active;
  });

  constructor() {
    effect(() => {
      const idx = this.selectedIndex();
      this.tabs().forEach((tab, i) => {
        tab.setActive(i === idx);
        tab.setIds(this.panelId(i), this.tabId(i));
      });
    });
  }

  select(index: number): void {
    if (!this.tabs()[index]?.disabled()) {
      this.active.set(index);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const count = this.tabs().length;
    if (count === 0) return;

    let next: number;
    switch (event.key) {
      case 'ArrowRight':
        next = this.nextEnabled(this.selectedIndex(), 1);
        break;
      case 'ArrowLeft':
        next = this.nextEnabled(this.selectedIndex(), -1);
        break;
      case 'Home':
        next = this.nextEnabled(-1, 1);
        break;
      case 'End':
        next = this.nextEnabled(count, -1);
        break;
      default:
        return;
    }

    event.preventDefault();
    this.active.set(next);
    this.tabButtons()[next]?.nativeElement.focus();
  }

  // Siguiente pestaña habilitada en la dirección dada, con wrap-around
  private nextEnabled(from: number, dir: 1 | -1): number {
    const tabs = this.tabs();
    const count = tabs.length;
    let i = from;
    for (let step = 0; step < count; step++) {
      i = (i + dir + count) % count;
      if (!tabs[i]?.disabled()) return i;
    }
    return this.selectedIndex();
  }
}
