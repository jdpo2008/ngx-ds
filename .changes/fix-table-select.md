### Fixed

- Table: the expand, column and row-action buttons now set `aria-expanded` on the real button (the expand button set it on the wrapper element).
- Table: Escape closes the column menu and the row action menu, and returns focus to the button that opened it.
- Table: sortable column headers can be focused with Tab and sorted with Enter or Space.
- Select: removing a chip or clearing the value keeps focus in the field.
- Select: "Select all" no longer drops a selected option that is disabled.
- Autocomplete: Tab closes the panel and restores the selected label (or keeps the text with `allowCustom`).
- Autocomplete: writing a value with no matching option clears the old label, and fills in the new one when its option arrives.
