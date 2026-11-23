### Fixed

- InlineEdit: the Enter that confirms an IME composition (Japanese, Chinese…) no longer saves the field.
- InlineEdit: disabling the field while it is being edited cancels the edit, and `[editing]` can't open a disabled field.
- MaskedInput: literals with digits or letters in the middle of a mask (such as `99/99/2099`) are no longer read back as input, so typing the rest of the value no longer corrupts it.
