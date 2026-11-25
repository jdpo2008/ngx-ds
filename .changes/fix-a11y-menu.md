### Fixed

- ContextMenu: focuses the first item when it opens, and opens from the keyboard (Shift+F10 or the ContextMenu key) below the focused target. The target must be focusable.
- Menu: Tab closes the menu, typing a letter moves to the next item that starts with it, ArrowLeft only closes submenus, and Enter on a parent item opens its submenu and focuses its first item.
- Menu: disabled items use `aria-disabled` and stay reachable with the arrow keys, but still can't be activated.
