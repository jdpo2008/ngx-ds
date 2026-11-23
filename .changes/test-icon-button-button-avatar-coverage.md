### Added

- Avatar: the status is also given as visually hidden text ("Busy"), not only by the dot's colour. New label `avatarStatus`.

### Fixed

- Avatar: initials have an accessible name from `alt`.
- Avatar: shows the initials when the image fails to load, and tries again when `src` changes.
- Button: sets `aria-busy="true"` while loading.
