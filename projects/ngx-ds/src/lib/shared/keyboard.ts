/** True for the keys that activate a button-like element: Enter and Space. */
export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === 'Enter' || event.key === ' ';
}

const ENABLED_OPTION = '[role="option"]:not([aria-disabled="true"])';

/** Focuses the first enabled `role="option"` inside `listbox`, if any. */
export function focusFirstOption(listbox: Element | null | undefined): void {
  listbox?.querySelector<HTMLElement>(ENABLED_OPTION)?.focus();
}

/**
 * Listbox arrow navigation for a keydown fired on a `role="option"` element.
 * ArrowDown / ArrowUp move to the next / previous enabled option (wrapping),
 * Home / End jump to the first / last. Returns true when the key was handled.
 */
export function moveOptionFocus(event: KeyboardEvent): boolean {
  const current = event.currentTarget as HTMLElement | null;
  const listbox = current?.closest('[role="listbox"]');
  if (!current || !listbox) return false;

  const options = Array.from(listbox.querySelectorAll<HTMLElement>(ENABLED_OPTION));
  const last = options.length - 1;
  const i = options.indexOf(current);
  let next: number;
  switch (event.key) {
    case 'ArrowDown':
      next = i >= last ? 0 : i + 1;
      break;
    case 'ArrowUp':
      next = i <= 0 ? last : i - 1;
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = last;
      break;
    default:
      return false;
  }
  event.preventDefault();
  options[next]?.focus();
  return true;
}
