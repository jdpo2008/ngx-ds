### Fixed

- TreeView: pressing Enter or Space on a node's expand toggle no longer also selects (or deselects) the node, and Space on the toggle now activates it.
- TreeView: ArrowRight expands and ArrowLeft collapses the focused node.
- TreeView: the tree is marked `aria-multiselectable` when selectable, nodes only expose `aria-selected` when the tree is selectable, disabled nodes expose `aria-disabled`, and the chevron icon is hidden from screen readers.
- Popover: the trigger points to the open panel with `aria-controls`.
- Popover: closing with Escape from inside the panel returns focus to the trigger instead of losing it.
- Popover: setting `disabled` while it is open now closes it.
- RangeSlider: the track fill stays inside the rail when the value is outside `min`–`max`.
- RangeSlider: `minGap` can no longer push a range thumb below `min` or above `max`.
