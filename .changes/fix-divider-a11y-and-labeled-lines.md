### Fixed

- Divider: a labeled divider draws its lines again. They had no border style, so only the label showed.
- Divider: a vertical divider with a `label` no longer disappears; the label is ignored as documented.
- Divider: a vertical divider sets `aria-orientation="vertical"`, and a labeled one is named by its label (a separator hides its children from assistive tech).
