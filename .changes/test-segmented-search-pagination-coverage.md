### Fixed

- Pagination: `showBoundary` had no effect. Set to `false`, it now shows only the pages around the current one.
- Pagination: an ellipsis no longer stands for a single page; that page is shown instead.
- Pagination: choosing the page already shown, or `next()` / `prev()` at the ends, no longer emits `pageChange`.
- Pagination: with `totalPages` at 0, or a `currentPage` past the end, the arrows are disabled and the page no longer drops to 0.
- SearchInput: clearing the field keeps focus in it instead of losing it to the page.
- SearchInput: Enter that confirms an IME composition no longer emits `searchSubmit`.
- SegmentedControl: choosing the option already selected no longer reports a change to the form, and focus leaving the group marks it as touched.
