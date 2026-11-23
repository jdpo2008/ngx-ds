import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { NGX_DS_LABELS } from '../../shared/labels';

export type SplitterOrientation = 'horizontal' | 'vertical';

let nextId = 0;

/**
 * Two resizable panes with a draggable divider. Project the panes with the
 * `splitter-start` and `splitter-end` attributes.
 */
@Component({
  selector: 'ngx-ds-splitter',
  standalone: true,
  templateUrl: './splitter.component.html',
  styleUrl: './splitter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitterComponent {
  readonly i18n = inject(NGX_DS_LABELS);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  // ── Inputs ───────────────────────────────────────────────────
  /** `horizontal` puts the panes side by side; `vertical` stacks them. */
  readonly orientation = input<SplitterOrientation>('horizontal');
  /** Size of the first pane, in % of the available space. Two-way bindable. */
  readonly size = model<number>(50);
  readonly min = input<number>(10);
  readonly max = input<number>(90);
  /** Percentage moved by each arrow key press. */
  readonly step = input<number>(5);
  readonly disabled = input<boolean>(false);
  /** Accessible name of the divider. */
  readonly ariaLabel = input<string>('');

  /** Emitted with the final size after a drag or a keyboard change. */
  readonly resizeEnd = output<number>();

  // ── State ────────────────────────────────────────────────────
  readonly paneId = `ngx-ds-splitter-${nextId++}`;
  readonly #dragging = signal(false);
  readonly isDragging = this.#dragging.asReadonly();
  /** Size before Enter collapsed the first pane. */
  #restoreSize: number | null = null;

  // ── Derived ──────────────────────────────────────────────────
  readonly isHorizontal = computed(() => this.orientation() === 'horizontal');
  readonly current = computed(() => this.clamp(this.size()));
  readonly template = computed(
    () => `minmax(0, ${this.current()}fr) auto minmax(0, ${100 - this.current()}fr)`,
  );
  /** A splitter that puts panes side by side has a vertical divider. */
  readonly separatorOrientation = computed(() => (this.isHorizontal() ? 'vertical' : 'horizontal'));

  // ── Keyboard ─────────────────────────────────────────────────

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const before = this.current();
    const [less, more] = this.isHorizontal()
      ? ['ArrowLeft', 'ArrowRight']
      : ['ArrowUp', 'ArrowDown'];
    switch (event.key) {
      case less:
        this.setSize(this.current() - this.step());
        break;
      case more:
        this.setSize(this.current() + this.step());
        break;
      case 'Home':
        this.setSize(this.min());
        break;
      case 'End':
        this.setSize(this.max());
        break;
      case 'Enter':
        this.toggleCollapse();
        break;
      default:
        return;
    }
    event.preventDefault();
    if (this.current() !== before) this.resizeEnd.emit(this.current());
  }

  /** Collapses the first pane to `min`, or restores the size it had before. */
  toggleCollapse(): void {
    if (this.current() > this.min()) {
      this.#restoreSize = this.current();
      this.setSize(this.min());
    } else {
      this.setSize(this.#restoreSize ?? 50);
      this.#restoreSize = null;
    }
  }

  // ── Pointer ──────────────────────────────────────────────────

  onPointerDown(event: PointerEvent): void {
    if (this.disabled() || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    this.#dragging.set(true);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.#dragging()) return;
    const handle = event.currentTarget as HTMLElement;
    const rect = this.host.nativeElement.getBoundingClientRect();
    const horizontal = this.isHorizontal();
    const handleSize = horizontal ? handle.offsetWidth : handle.offsetHeight;
    const total = (horizontal ? rect.width : rect.height) - handleSize;
    if (total <= 0) return;
    const pos =
      (horizontal ? event.clientX - rect.left : event.clientY - rect.top) - handleSize / 2;
    this.setSize(Math.round((pos / total) * 1000) / 10);
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.#dragging()) return;
    (event.currentTarget as HTMLElement).releasePointerCapture?.(event.pointerId);
    this.#dragging.set(false);
    this.resizeEnd.emit(this.current());
  }

  // ── Helpers ──────────────────────────────────────────────────

  private setSize(value: number): void {
    this.size.set(this.clamp(value));
  }

  private clamp(value: number): number {
    return Math.min(Math.max(value, this.min()), this.max());
  }
}
