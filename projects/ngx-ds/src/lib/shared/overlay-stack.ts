import { DestroyRef, Signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/** Open overlays, oldest first. Shared by every modal, drawer and lightbox. */
const stack: object[] = [];
let savedOverflow = '';

/**
 * Registers an overlay (modal, drawer, lightbox) that locks page scroll while `open` is true.
 *
 * The page stays locked until the last open overlay closes, then gets back the `overflow`
 * it had before the first one opened. Returns a function telling whether this overlay is
 * the topmost open one, so that only it reacts to Escape.
 *
 * Must be called in an injection context (constructor / field initializer).
 */
export function setupOverlay(open: Signal<boolean>): () => boolean {
  const body = inject(DOCUMENT).body;
  const token = {};

  const release = () => {
    const i = stack.indexOf(token);
    if (i === -1) return;
    stack.splice(i, 1);
    if (stack.length === 0) body.style.overflow = savedOverflow;
  };

  effect(() => {
    if (!open()) {
      release();
      return;
    }
    if (stack.includes(token)) return;
    if (stack.length === 0) {
      savedOverflow = body.style.overflow;
      body.style.overflow = 'hidden';
    }
    stack.push(token);
  });

  inject(DestroyRef).onDestroy(release);

  return () => stack[stack.length - 1] === token;
}
