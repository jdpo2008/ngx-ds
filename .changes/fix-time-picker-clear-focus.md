### Added

- Autocomplete: keyboard navigation. ArrowDown/ArrowUp move through the enabled options (and open the panel), Enter picks the highlighted one, Escape closes the panel. The input points at the highlighted option with `aria-activedescendant`.

### Fixed

- TimePicker: clearing the value keeps focus on the field and marks the control as touched.
- Autocomplete: clearing cancels a search still waiting on the debounce, so the old results no longer come back after `searchChange` emits `''`.
