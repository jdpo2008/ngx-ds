import { DestroyRef, Signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/** Open overlays, oldest first. Shared by every modal, drawer and lightbox. */
const stack: object[] = [];
let savedOverflow = '';

/**
 * Everything open that closes on Escape, oldest first: the overlays above, plus panels,
 * pickers and menus. A single Escape is meant for the last one opened.
 */
const layers: object[] = [];

export interface EscapeLayer {
  /** This layer is open and nothing opened after it is still open. */
  isTop: () => boolean;
  /** This layer is open and something opened after it is still open. */
  isCovered: () => boolean;
}

/**
 * Registers something that closes on Escape (a dropdown panel, a picker, a menu) as an
 * escape layer while `open` is true. A modal or drawer underneath it then leaves that
 * Escape to it, and the next Escape closes the modal.
 *
 * Must be called in an injection context (constructor / field initializer).
 */
export function setupEscapeLayer(open: Signal<boolean>): EscapeLayer {
  const token = {};

  const release = () => {
    const i = layers.indexOf(token);
    if (i !== -1) layers.splice(i, 1);
  };

  effect(() => {
    if (!open()) release();
    else if (!layers.includes(token)) layers.push(token);
  });

  inject(DestroyRef).onDestroy(release);

  return {
    isTop: () => layers[layers.length - 1] === token,
    isCovered: () => {
      const i = layers.indexOf(token);
      return i !== -1 && i < layers.length - 1;
    },
  };
}

/**
 * Registers an overlay (modal, drawer, lightbox) that locks page scroll while `open` is true.
 *
 * The page stays locked until the last open overlay closes, then gets back the `overflow`
 * it had before the first one opened. Returns a function telling whether this overlay is
 * the topmost open escape layer (see `setupEscapeLayer`), so that only it reacts to Escape.
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

  return setupEscapeLayer(open).isTop;
}
