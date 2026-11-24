### Fixed

- Table: clickable rows can be reached with Tab and activated with Enter or Space. The expand, select and row action buttons name their row ("Expandir fila 3"), and custom labels get the row number appended.
- Table: the row action menu exposes `aria-haspopup`, `aria-expanded` and `aria-controls`, moves focus into the menu when it opens, and returns focus to its button when it closes or an action runs. The default `rowActions` label is now "Acciones de la fila" / "Row actions".
- Table: the table is marked `aria-busy` while loading, the page range is announced when it changes, the actions column header has an accessible name, and clicking the selected row's radio no longer clears a single selection.
