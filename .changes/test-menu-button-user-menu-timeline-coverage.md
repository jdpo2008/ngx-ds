### Fixed

- Timeline: every item lost its connector line and spacing, because the "last item" rule matched each one. Only the last item hides it now.
- Timeline: `variant="compact"` had no effect; it now uses tighter rows and a smaller dot.
- Timeline: the `active` item is announced as the current step (`aria-current="step"`).
- UserMenu: without `initials` or `avatarSrc` the avatar was empty; it now shows initials taken from the name.
- UserMenu: choosing an action moves focus back to the trigger instead of losing it.
