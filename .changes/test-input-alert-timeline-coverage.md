### Added

- Timeline: completed and error steps include a visually hidden status text, so their status is not shown by colour only. New labels `timelineCompleted` and `timelineError`.

### Changed

- Alert: `info` and `success` alerts use `role="status"` (polite) instead of `role="alert"`. `warning` and `danger` alerts keep `role="alert"`.

### Fixed

- Input: the password visibility toggle can be reached with the keyboard, is disabled together with the field, and hides its icon from screen readers.
- Timeline: the decorative status dot is hidden from screen readers.
