### Fixed

- Rating: the stars are a labelled group (`role="group"`), so the label is announced, and the selected star is marked with `aria-pressed`.
- PasswordStrength: the meter announces the strength as text (`aria-valuetext`), and its label no longer ends in a dangling ": " when the password is empty.
