### Added

- Icon: new `label` input. A labelled icon is exposed as a named image (`role="img"`).

### Fixed

- Icon: unlabelled icons are hidden from assistive technology (`aria-hidden="true"`).
- Skeleton: a `lines` value that is not a number renders one line instead of none.
- Skeleton and Spinner: respect `prefers-reduced-motion` (the shimmer stops, the spinner slows down).
