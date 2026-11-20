### Fixed

- `ConfirmationService`: calling `confirm()` while a dialog is open, or calling `close()`, resolved nothing, so the earlier promise stayed pending forever. Both now resolve it with `false`.
- `ConfirmationComponent` locks the page scroll while open, and Escape only cancels it when it is the topmost overlay (a modal or drawer under it stays open).
- `ColorPickerComponent`: setting the `value` input, or `writeValue` with a `#rgb` hex, did not move the sliders. Short and upper-case hex values are stored as `#rrggbb` lower-case, and an invalid value falls back to the default colour.
- `ColorPickerComponent`: a typed hex is kept exactly instead of being rounded through HSL (`#123456` became `#123354`), and moving the hue at 0 % saturation no longer resets it.
- `ColorPickerComponent` marks the form control as touched on blur, not on every change.
