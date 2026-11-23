import {
  afterNextRender,
  Injector,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { NGX_DS_LABELS } from '../../shared/labels';
import { CarouselItem, stepIndex } from './carousel.types';

export type CarouselFit = 'cover' | 'contain';

/** Minimum horizontal drag, in px, that counts as a swipe. */
const SWIPE_THRESHOLD = 40;

@Component({
  selector: 'ngx-ds-carousel',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent {
  readonly i18n = inject(NGX_DS_LABELS);
  readonly #injector = inject(Injector);
  protected readonly icons = { ChevronLeft, ChevronRight, Pause, Play };

  // ── Inputs ───────────────────────────────────────────────────
  readonly items = input.required<CarouselItem[]>();
  /** Index of the visible slide. Two-way bindable. */
  readonly index = model<number>(0);
  /** After the last slide comes the first one again. */
  readonly loop = input<boolean>(true);
  /** Milliseconds between slides. `0` turns autoplay off. */
  readonly autoplay = input<number>(0);
  readonly showArrows = input<boolean>(true);
  readonly showIndicators = input<boolean>(true);
  /** CSS `aspect-ratio` of the viewport. */
  readonly aspectRatio = input<string>('16 / 9');
  readonly fit = input<CarouselFit>('cover');
  /** Accessible name of the carousel region. */
  readonly ariaLabel = input<string>('');

  /** Emitted when a slide image is clicked, e.g. to open a Lightbox. */
  readonly itemClick = output<{ item: CarouselItem; index: number }>();

  // ── State ────────────────────────────────────────────────────
  /** Autoplay paused with the pause button. */
  readonly #userPaused = signal(false);
  readonly #hovered = signal(false);
  readonly #focused = signal(false);
  #pointerStart: number | null = null;

  // ── Derived ──────────────────────────────────────────────────
  readonly count = computed(() => this.items().length);
  readonly current = computed(() => Math.max(Math.min(this.index(), this.count() - 1), 0));
  readonly hasAutoplay = computed(() => this.autoplay() > 0 && this.count() > 1);
  readonly isPlaying = computed(
    () => this.hasAutoplay() && !this.#userPaused() && !this.#hovered() && !this.#focused(),
  );
  readonly isUserPaused = this.#userPaused.asReadonly();
  readonly canPrev = computed(() => this.loop() || this.current() > 0);
  readonly canNext = computed(() => this.loop() || this.current() < this.count() - 1);
  readonly trackTransform = computed(() => `translateX(-${this.current() * 100}%)`);

  constructor() {
    // The interval restarts whenever the slide changes, so a manual move gets a full period.
    effect((onCleanup) => {
      if (!this.isPlaying()) return;
      this.current();
      const id = setInterval(() => this.next(), this.autoplay());
      onCleanup(() => clearInterval(id));
    });
  }

  // ── Navigation ───────────────────────────────────────────────

  goTo(index: number): void {
    if (index >= 0 && index < this.count()) this.index.set(index);
  }

  prev(): void {
    this.index.set(stepIndex(this.current(), -1, this.count(), this.loop()));
  }

  next(): void {
    this.index.set(stepIndex(this.current(), 1, this.count(), this.loop()));
  }

  /** Steps from an arrow; if that arrow is now disabled, focus moves to the other one. */
  onArrow(delta: 1 | -1, event: Event): void {
    if (delta < 0) this.prev();
    else this.next();
    if (delta < 0 ? this.canPrev() : this.canNext()) return;
    const other = delta < 0 ? '.carousel__arrow--next' : '.carousel__arrow--prev';
    const target = (event.currentTarget as HTMLElement).parentElement?.querySelector<HTMLElement>(
      other,
    );
    // The other arrow may still be disabled until this change renders.
    afterNextRender(() => target?.focus(), { injector: this.#injector });
  }

  toggleAutoplay(): void {
    this.#userPaused.update((p) => !p);
  }

  // ── Events ───────────────────────────────────────────────────

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.prev();
        break;
      case 'ArrowRight':
        this.next();
        break;
      case 'Home':
        this.goTo(0);
        break;
      case 'End':
        this.goTo(this.count() - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  onMouseEnter(): void {
    this.#hovered.set(true);
  }

  onMouseLeave(): void {
    this.#hovered.set(false);
  }

  onFocusIn(): void {
    this.#focused.set(true);
  }

  onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement;
    if (!host.contains(event.relatedTarget as Node | null)) this.#focused.set(false);
  }

  onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.#pointerStart = event.clientX;
  }

  onPointerUp(event: PointerEvent): void {
    if (this.#pointerStart === null) return;
    const delta = event.clientX - this.#pointerStart;
    this.#pointerStart = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) this.next();
    else this.prev();
  }

  onPointerCancel(): void {
    this.#pointerStart = null;
  }

  onItemClick(item: CarouselItem, index: number): void {
    this.itemClick.emit({ item, index });
  }
}
