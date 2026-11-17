import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { ChevronDown, LucideIconData } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { ACCORDION_CONTROLLER } from './accordion.token';
import { Size } from '../../shared/size';

export type AccordionVariant = 'default' | 'flush' | 'ghost';
export type AccordionSize = Size;

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

  // ── Inputs ────────────────────────────────────────────────────
  readonly label = input.required<string>();
  readonly description = input<string>('');
  readonly icon = input<LucideIconData | undefined>(undefined);
  readonly disabled = input<boolean>(false);

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
