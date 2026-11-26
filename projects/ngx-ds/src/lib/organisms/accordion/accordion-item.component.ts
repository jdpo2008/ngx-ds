import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { LucideChevronDown as ChevronDown } from '@lucide/angular';
import { IconInput } from '../../atoms/icon/icon.types';
import { IconComponent } from '../../atoms/icon/icon.component';
import { ACCORDION_CONTROLLER } from './accordion.token';
import { Size } from '../../shared/size';

export type AccordionVariant = 'default' | 'flush' | 'ghost';
export type AccordionSize = Size;

let nextId = 0;

const ICON_SIZE: Record<AccordionSize, number> = { sm: 14, md: 16, lg: 18 };

@Component({
  selector: 'ngx-ds-accordion-item',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionItemComponent {
  private readonly controller = inject(ACCORDION_CONTROLLER, { optional: true });

  readonly triggerId = `ngx-accordion-trigger-${nextId}`;
  readonly panelId = `ngx-accordion-panel-${nextId++}`;

  // ── Inputs ────────────────────────────────────────────────────
  readonly label = input.required<string>();
  readonly description = input<string>('');
  readonly icon = input<IconInput | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  /** Opens or closes the item from outside; in single mode, opening it closes the others. */
  readonly expanded = input<boolean>(false);

  // ── State set by parent ───────────────────────────────────────
  readonly _open = signal(false);
  readonly _variant = signal<AccordionVariant>('default');
  readonly _size = signal<AccordionSize>('md');

  setOpen(v: boolean): void {
    this._open.set(v);
  }
  setVariant(v: AccordionVariant): void {
    this._variant.set(v);
  }
  setSize(s: AccordionSize): void {
    this._size.set(s);
  }

  constructor() {
    effect(() => {
      const open = this.expanded();
      untracked(() => {
        this._open.set(open);
        if (open) this.controller?.itemOpened(this);
      });
    });
  }

  // ── Icons ─────────────────────────────────────────────────────
  protected readonly chevronIcon = ChevronDown;

  // ── Derived ───────────────────────────────────────────────────
  protected readonly iconSize = computed(() => ICON_SIZE[this._size()]);

  protected readonly itemClasses = computed(() => {
    const b = 'accordion-item';
    return [
      b,
      `${b}--${this._variant()}`,
      `${b}--${this._size()}`,
      this._open() ? `${b}--open` : '',
      this.disabled() ? `${b}--disabled` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  // ── Behavior ──────────────────────────────────────────────────
  protected toggle(): void {
    if (this.disabled()) return;
    const opening = !this._open();
    this._open.set(opening);
    if (opening) this.controller?.itemOpened(this);
  }
}
