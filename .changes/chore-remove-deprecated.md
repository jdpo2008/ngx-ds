### Removed

The names deprecated in 0.7.0 are gone. Use the new names:

- Toast and Notification type `'error'`: use `'danger'`. `ToastrService.error()`: use `danger()`.
- OtpInput and FormField `error`: use `errorMessage`. OtpInput no longer has an error style without a message: set `errorMessage`, or bind it with Signal Forms.
- ChipGroup `variant="filled"`: use `"solid"`. ChipGroup `multiSelect`: use `multiple`.
- NotificationCenter and NotificationItem `dismiss` output: use `dismissed`.
- Drawer and Modal `showClose`: use `dismissible`.
- Popover `closeOnClickOutside`: use `closeOnBackdrop`.
- Alert `type` and the `AlertType` type: use `color` and `AlertColor`.
