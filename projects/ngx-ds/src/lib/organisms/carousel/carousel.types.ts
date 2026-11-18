/** One image of a Carousel or Lightbox. */
export interface CarouselItem {
  src: string;
  /** Alternative text. Use `''` only for decorative images. */
  alt: string;
  caption?: string;
}

/**
 * Moves `index` by `delta` inside a list of `count` items. With `loop` it wraps
 * around; without it, it stops at the first and last item.
 */
export function stepIndex(index: number, delta: number, count: number, loop: boolean): number {
  if (count <= 0) return 0;
  const next = index + delta;
  if (loop) return ((next % count) + count) % count;
  return Math.min(Math.max(next, 0), count - 1);
}
