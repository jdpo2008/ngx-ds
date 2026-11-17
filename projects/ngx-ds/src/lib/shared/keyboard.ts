/** True for the keys that activate a button-like element: Enter and Space. */
export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === 'Enter' || event.key === ' ';
}
