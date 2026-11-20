### Added

- `NgxDsLabels.fileTypeNotAllowed`, the error FileUpload shows for a file that doesn't match `accept`.

### Fixed

- Autocomplete: a click anywhere on the page no longer marks the field touched or clears its text when the field isn't in use.
- Autocomplete: disabled options set `aria-disabled`.
- MultiSelect: each chip shows the label of its own value, and its remove button removes that value. Before, chips used the options order, so with a selection made in another order they showed the wrong label and removed a different value.
- MultiSelect: a form-disabled control is no longer focusable and its chips can't be removed.
- MultiSelect: Escape and clicks outside mark the field touched when they close the panel.
- MultiSelect: options blocked by `maxSelected` set `aria-disabled`.
- FileUpload: dropped files are checked against `accept`, like the ones picked in the file dialog.
- FileUpload: files can't be removed while the component is disabled.

### Security

- Autocomplete: option labels are HTML-escaped in the match highlight. Before, a label containing HTML (for example from async search results) was rendered as markup.
