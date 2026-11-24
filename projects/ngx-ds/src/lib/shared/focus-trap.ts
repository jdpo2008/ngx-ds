const TABBABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]',
].join(', ');

/** Elements of `container` reachable with Tab, in DOM order (skips `tabindex="-1"`). */
export function tabbableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter(
    (el) => el.tabIndex >= 0,
  );
}

/**
 * Keeps Tab / Shift+Tab inside `container`: from the last tabbable element Tab
 * wraps to the first, and Shift+Tab from the first wraps to the last. Call it
 * from the container's `keydown` handler. Unlike `ngxFocusTrap`, it never moves
 * focus when the container appears or goes away: the caller decides where focus
 * starts and where it returns (a click outside must not pull it back).
 */
export function trapTabKey(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== 'Tab') return;
  const items = tabbableElements(container);
  if (items.length === 0) {
    event.preventDefault();
    return;
  }
  const first = items[0];
  const last = items[items.length - 1];
  const active = container.ownerDocument.activeElement;
  if (event.shiftKey && (active === first || !container.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !container.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}
