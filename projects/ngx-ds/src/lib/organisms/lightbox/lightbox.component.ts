import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  OnDestroy,
  output,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ChevronLeft, ChevronRight, X } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { FocusTrapDirective } from '../../directives/focus-trap/focus-trap.directive';
import { setupEscapeClose } from '../../shared/escape-close';
import { NGX_DS_LABELS } from '../../shared/labels';
import { CarouselItem, stepIndex } from '../carousel/carousel.types';

/** Minimum horizontal drag, in px, that counts as a swipe. */
const SWIPE_THRESHOLD = 40;

@Component({
  selector: 'ngx-ds-lightbox',
  standalone: true,
  imports: [IconComponent, FocusTrapDirective],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightboxComponent implements OnDestroy {
  readonly i18n = inject(NGX_DS_LABELS);
  private readonly doc = inject(DOCUMENT);
  protected readonly icons = { ChevronLeft, ChevronRight, X };

  // ── Inputs ───────────────────────────────────────────────────
  readonly items = input.required<CarouselItem[]>();
  readonly open = model<boolean>(false);
  /** Index of the visible image. Two-way bindable. */
  readonly index = model<number>(0);
  readonly loop = input<boolean>(true);

  readonly closed = output<void>();

  #pointerStart: number | null = null;

  // ── Derived ──────────────────────────────────────────────────
  readonly count = computed(() => this.items().length);
  readonly current = computed(() => Math.min(Math.max(this.index(), 0), this.count() - 1));
  readonly item = computed<CarouselItem | undefined>(() => this.items()[this.current()]);
  readonly canPrev = computed(() => this.count() > 1 && (this.loop() || this.current() > 0));
  readonly canNext = computed(
    () => this.count() > 1 && (this.loop() || this.current() < this.count() - 1),
  );

  constructor() {
    effect(() => {
      this.doc.body.style.overflow = this.open() ? 'hidden' : '';
    });
    setupEscapeClose(() => {
      if (this.open()) this.close();
    });
  }

  ngOnDestroy(): void {
    this.doc.body.style.overflow = '';
  }

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  prev(): void {
    if (this.canPrev()) this.index.set(stepIndex(this.current(), -1, this.count(), this.loop()));
  }

  next(): void {
    if (this.canNext()) this.index.set(stepIndex(this.current(), 1, this.count(), this.loop()));
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') this.prev();
    else if (event.key === 'ArrowRight') this.next();
    else return;
    event.preventDefault();
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
}
