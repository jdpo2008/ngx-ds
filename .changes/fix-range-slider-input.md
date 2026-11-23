### Fixed

- RangeSlider: a thumb pushed against the other one no longer emits `rangeChange` and the form value again while it stays put.
- Input, Textarea, MaskedInput, InlineEdit and OtpInput accept a number from a form control (e.g. `new FormControl(5)`): the label floats, the counter counts it, and MaskedInput, InlineEdit and OtpInput no longer throw.
