### Fixed

- Table, Modal, Drawer, Confirmation, Tabs, Stepper, ContextMenu, FileUpload, Avatar, IconButton, Skeleton and Spinner now set `font-family: var(--ngx-primary-font-family)` on their host, like the other components. Before, they took the page font, which in an app without its own styles was the browser default (Times New Roman).
