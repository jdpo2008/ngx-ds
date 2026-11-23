### Fixed

- ProgressBar: `aria-valuenow` stays inside `0`–`max` when `value` is out of range.
- ProgressBar: `max` of `0` no longer gives a `NaN%` width and value.
- StatCard: a `delta` that rounds to `0%` is shown as no change, without an arrow, colour or sign.
