### Fixed

- `Menu`: keys pressed in a submenu no longer also move the parent menu, and Escape in a submenu closes only that submenu instead of the whole menu or the `ContextMenu` around it.
- `Menu`: when the first item is disabled, the tab stop goes to the first enabled item, so the menu can still be reached with Tab.
- `Menu`: a submenu is named after its parent item, and item icons and the submenu chevron are hidden from screen readers.
- `ContextMenu`: right-clicking again while it is open no longer loses the element that should get focus back when it closes.
