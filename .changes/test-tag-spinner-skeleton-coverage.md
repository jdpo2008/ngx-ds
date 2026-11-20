### Fixed

- Spinner: the loading text is now inside the `role="status"` live region (visually hidden), so screen readers announce it; an `aria-label` on a live region is often not read.
- Skeleton: the host is `aria-hidden="true"`, so placeholder shapes are skipped by assistive technology.
- Skeleton: a `circle` given only a `width` is now round; its height follows the width instead of the default `1rem`.
