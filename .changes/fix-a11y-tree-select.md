### Fixed

- TreeSelect: with `searchable`, opening the panel by click or keyboard focuses the search box, and Tab / Shift+Tab move between search and tree without closing. Search results are announced in a polite live region, and "No results" is no longer inside `role="tree"`.
- TreeSelect: the chip remove buttons are no longer nested inside the `role="combobox"` element, and in cascade mode a parent whose enabled leaves are all checked reports `aria-checked="true"` even with a disabled leaf.
- TreeSelect: ArrowUp on the closed trigger opens the panel, and typing a letter in the tree moves to the next row that starts with it.
