### Fixed

- `ToastrService`: `duration: 0` was replaced by the 5 s default, so a toast could never stay until closed. It now stays (and shows no progress bar).
- `ToastComponent`: toasts were silent for screen readers. Errors use `role="alert"`, the rest `role="status"`.
- `ChipGroupComponent`: removing a selected chip left its value in `selected` and in the form control. It is now dropped from both.
- `FormFieldComponent`: a projected control that already had an `id` (and no `for` input) was not linked to the label, hint or error. They now use the control's id.
- `FormFieldComponent`: `required` only drew the asterisk (hidden from screen readers). The control now gets `aria-required="true"`.
