### Added

- `NgxDsLabels.selectedCount(n)`: text of the Select tag when more than two options are selected (`"3 seleccionados"` / `"3 selected"`).

### Fixed

- Select in multiple mode showed "N seleccionados" in Spanish even with English labels; it now uses `selectedCount` from `NGX_DS_LABELS`.
