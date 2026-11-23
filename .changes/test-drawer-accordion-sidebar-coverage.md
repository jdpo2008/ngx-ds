### Added

- `IconButton`: `ariaExpanded` input that sets `aria-expanded` on the button.

### Fixed

- `Accordion`: each panel is a `region` linked to its trigger (`aria-controls` / `aria-labelledby`), and the content of a closed panel is `inert`, so it no longer receives keyboard focus.
- `Drawer`: with a `title`, the dialog is named by the visible heading (`aria-labelledby`) instead of a duplicate `aria-label`.
- `Sidebar`: item icons are hidden from screen readers, and the collapse toggle reports `aria-expanded`.
