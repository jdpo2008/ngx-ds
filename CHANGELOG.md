# Changelog

All notable changes to `@jdpo2008/ngx-ds` are documented here. The project follows [Semantic Versioning](https://semver.org/). Until 1.0.0, minor versions may contain breaking changes.

## [Unreleased]

## [1.2.1] - 2026-11-24

### Fixed

- Table, Modal, Drawer, Confirmation, Tabs, Stepper, ContextMenu, FileUpload, Avatar, IconButton, Skeleton and Spinner now set `font-family: var(--ngx-primary-font-family)` on their host, like the other components. Before, they took the page font, which in an app without its own styles was the browser default (Times New Roman).

## [1.2.0] - 2026-11-24

### Added

- AccordionItem: `expanded` input to open an item from outside, for example on first render. In single mode, opening one closes the others.
- Icon: new `label` input. A labelled icon is exposed as a named image (`role="img"`).
- `NgxDsLabels.selectedCount(n)`: text of the Select tag when more than two options are selected (`"3 seleccionados"` / `"3 selected"`).
- Autocomplete: keyboard navigation. ArrowDown/ArrowUp move through the enabled options (and open the panel), Enter picks the highlighted one, Escape closes the panel. The input points at the highlighted option with `aria-activedescendant`.
- `NgxDsLabels.today` label for the Datepicker Today button.
- `IconButton`: `ariaExpanded` input that sets `aria-expanded` on the button.
- AvatarGroup: the `+N` counter has an accessible name ("3 more"). New label `moreAvatars`.
- Avatar: the status is also given as visually hidden text ("Busy"), not only by the dot's colour. New label `avatarStatus`.
- Timeline: completed and error steps include a visually hidden status text, so their status is not shown by colour only. New labels `timelineCompleted` and `timelineError`.
- `NgxDsLabels.fileTypeNotAllowed`, the error FileUpload shows for a file that doesn't match `accept`.

### Changed

- Alert: `info` and `success` alerts use `role="status"` (polite) instead of `role="alert"`. `warning` and `danger` alerts keep `role="alert"`.

### Fixed

- Accordion: turning `multiple` off keeps only the first open item instead of leaving several open.
- Calendar: a disabled calendar also disables its previous/next month buttons, which stayed reachable by keyboard.
- Calendar: the month title is a polite live region, so changing month is announced.
- Navbar: the menu toggle sets `aria-controls` only while the panel exists.
- TreeSelect and MultiSelect: removing a chip with its button moves focus to the field instead of losing it.
- Datepicker, DateRangePicker: clearing the value keeps focus on the field instead of dropping it to the page.
- Datepicker: clearing the value marks the control as touched, like DateRangePicker.
- DateRangePicker: a range with only an end date shows it in the field instead of the placeholder.
- Divider: a labeled divider draws its lines again. They had no border style, so only the label showed.
- Divider: a vertical divider with a `label` no longer disappears; the label is ignored as documented.
- Divider: a vertical divider sets `aria-orientation="vertical"`, and a labeled one is named by its label (a separator hides its children from assistive tech).
- Icon: unlabelled icons are hidden from assistive technology (`aria-hidden="true"`).
- Skeleton: a `lines` value that is not a number renders one line instead of none.
- Skeleton and Spinner: respect `prefers-reduced-motion` (the shimmer stops, the spinner slows down).
- InlineEdit: the Enter that confirms an IME composition (Japanese, Chinese…) no longer saves the field.
- InlineEdit: disabling the field while it is being edited cancels the edit, and `[editing]` can't open a disabled field.
- MaskedInput: literals with digits or letters in the middle of a mask (such as `99/99/2099`) are no longer read back as input, so typing the rest of the value no longer corrupts it.
- MaskedInput: Delete in front of a literal (such as `)` or `-`) removes the next character instead of leaving the caret stuck, and Backspace right after a literal removes the previous character in one press.
- NotificationCenter: the bell sets `aria-expanded`, the filter tabs set `aria-selected`, and closing the panel with Escape while focus is inside it moves focus back to the bell instead of losing it.
- NotificationItem: pressing Enter on the action or dismiss button no longer marks the notification as read.
- RangeSlider: a thumb pushed against the other one no longer emits `rangeChange` and the form value again while it stays put.
- Input, Textarea, MaskedInput, InlineEdit and OtpInput accept a number from a form control (e.g. `new FormControl(5)`): the label floats, the counter counts it, and MaskedInput, InlineEdit and OtpInput no longer throw.
- Select in multiple mode showed "N seleccionados" in Spanish even with English labels; it now uses `selectedCount` from `NGX_DS_LABELS`.
- Splitter: `resizeEnd` is no longer emitted when a key leaves the size unchanged (for example ArrowLeft at `min`).
- Carousel: an empty `items` list no longer produces a negative slide index and an invalid track transform.
- Carousel: when an arrow becomes disabled at the end of a non-looping carousel, focus moves to the other arrow instead of being lost.
- Table: in client-side mode, the page is clamped to the last one when the data shrinks, instead of showing an empty page.
- Table: client-side sorting compares text with the locale, so case and accents no longer split the order and "item 9" comes before "item 10".
- Table: the expand, column and row-action buttons now set `aria-expanded` on the real button (the expand button set it on the wrapper element).
- Table: Escape closes the column menu and the row action menu, and returns focus to the button that opened it.
- Table: sortable column headers can be focused with Tab and sorted with Enter or Space.
- Select: removing a chip or clearing the value keeps focus in the field.
- Select: "Select all" no longer drops a selected option that is disabled.
- Autocomplete: Tab closes the panel and restores the selected label (or keeps the text with `allowCustom`).
- Autocomplete: writing a value with no matching option clears the old label, and fills in the new one when its option arrives.
- TimePicker: clearing the value keeps focus on the field and marks the control as touched.
- Autocomplete: clearing cancels a search still waiting on the debounce, so the old results no longer come back after `searchChange` emits `''`.
- Toast: the position containers now stay in the page as polite live regions, so screen readers announce new toasts. Before, each container was created together with its first toast, and many screen readers ignored it. Error toasts keep `role="alert"`; the other types no longer carry `role="status"`.
- Select and Datepicker: clicking anywhere on the page no longer marks their form control as touched when the panel was never opened (it showed validation errors on untouched fields).
- AvatarGroup: avatars past `max` are now actually hidden; before, only the `+N` count was added and every avatar stayed visible.
- Breadcrumb: with `maxItems` set to 1, the current page is shown after the ellipsis instead of the first item, and the ellipsis is no longer marked as the current page.
- ButtonGroup: with `fullWidth`, the component itself is now a block, so the group spans its container instead of only its inner row.
- EmptyState: the decorative icon is hidden from assistive technology (`aria-hidden="true"`).
- Radio: selecting a radio in a group bound to one reactive `FormControl`, or in a group without forms, no longer leaves the previous radio styled as checked.
- Radio: with `[checked]`, a click the parent ignores no longer leaves the native radio checked.
- Checkbox, Radio, Switch: leaving the control marks it as touched, so validation messages appear on blur and not only after a change.
- `ConfirmationService`: calling `confirm()` while a dialog is open, or calling `close()`, resolved nothing, so the earlier promise stayed pending forever. Both now resolve it with `false`.
- `ConfirmationComponent` locks the page scroll while open, and Escape only cancels it when it is the topmost overlay (a modal or drawer under it stays open).
- `ColorPickerComponent`: setting the `value` input, or `writeValue` with a `#rgb` hex, did not move the sliders. Short and upper-case hex values are stored as `#rrggbb` lower-case, and an invalid value falls back to the default colour.
- `ColorPickerComponent`: a typed hex is kept exactly instead of being rounded through HSL (`#123456` became `#123354`), and moving the hue at 0 % saturation no longer resets it.
- `ColorPickerComponent` marks the form control as touched on blur, not on every change.
- CommandPalette: the arrow keys follow the rendered order (grouped by category), not the order of `items`.
- Tooltip: hover and focus together no longer stack two tooltips (the first one stayed on screen).
- The Datepicker "Hoy" button text was hard-coded; it now follows `NGX_DS_LABELS`.
- The Datepicker Today button could select a date listed in `disabledDates`.
- DateRangePicker kept a half-picked range when closed with Escape, an outside click or Enter; the previous range is now restored.
- DateRangePicker now marks the field as touched when an outside click closes the panel.
- `Accordion`: each panel is a `region` linked to its trigger (`aria-controls` / `aria-labelledby`), and the content of a closed panel is `inert`, so it no longer receives keyboard focus.
- `Drawer`: with a `title`, the dialog is named by the visible heading (`aria-labelledby`) instead of a duplicate `aria-label`.
- `Sidebar`: item icons are hidden from screen readers, and the collapse toggle reports `aria-expanded`.
- Dropdown: clicking anywhere on the page no longer marks its form control as touched when the panel was never opened (it showed validation errors on untouched fields).
- Lightbox: a swipe that ends outside the image no longer closes it.
- FormField: the hint and error ids are added to the control's own `aria-describedby` instead of replacing it.
- AvatarGroup: a negative `max` no longer reports more hidden avatars than there are.
- ButtonGroup: only the corners between buttons are squared, so rounded buttons keep their pill shape at both ends.
- Avatar: initials have an accessible name from `alt`.
- Avatar: shows the initials when the image fails to load, and tries again when `src` changes.
- Button: sets `aria-busy="true"` while loading.
- Input: the password visibility toggle can be reached with the keyboard, is disabled together with the field, and hides its icon from screen readers.
- Timeline: the decorative status dot is hidden from screen readers.
- `Menu`: keys pressed in a submenu no longer also move the parent menu, and Escape in a submenu closes only that submenu instead of the whole menu or the `ContextMenu` around it.
- `Menu`: when the first item is disabled, the tab stop goes to the first enabled item, so the menu can still be reached with Tab.
- `Menu`: a submenu is named after its parent item, and item icons and the submenu chevron are hidden from screen readers.
- `ContextMenu`: right-clicking again while it is open no longer loses the element that should get focus back when it closes.
- Timeline: every item lost its connector line and spacing, because the "last item" rule matched each one. Only the last item hides it now.
- Timeline: `variant="compact"` had no effect; it now uses tighter rows and a smaller dot.
- Timeline: the `active` item is announced as the current step (`aria-current="step"`).
- UserMenu: without `initials` or `avatarSrc` the avatar was empty; it now shows initials taken from the name.
- UserMenu: choosing an action moves focus back to the trigger instead of losing it.
- Modal, Drawer and Lightbox: a closed overlay no longer resets the page's `overflow`, and closing one gives back the `overflow` the page had before.
- Modal, Drawer and Lightbox: with one overlay open over another (a modal over a drawer, a lightbox over a modal), closing the top one keeps the page scroll locked, and Escape closes only the top one.
- Stepper: clicking the current step no longer emits `stepChange`, and `goTo()` ignores an index outside the steps.
- ProgressBar: `aria-valuenow` stays inside `0`–`max` when `value` is out of range.
- ProgressBar: `max` of `0` no longer gives a `NaN%` width and value.
- StatCard: a `delta` that rounds to `0%` is shown as no change, without an arrow, colour or sign.
- Rating: the stars are a labelled group (`role="group"`), so the label is announced, and the selected star is marked with `aria-pressed`.
- PasswordStrength: the meter announces the strength as text (`aria-valuetext`), and its label no longer ends in a dangling ": " when the password is empty.
- Pagination: `showBoundary` had no effect. Set to `false`, it now shows only the pages around the current one.
- Pagination: an ellipsis no longer stands for a single page; that page is shown instead.
- Pagination: choosing the page already shown, or `next()` / `prev()` at the ends, no longer emits `pageChange`.
- Pagination: with `totalPages` at 0, or a `currentPage` past the end, the arrows are disabled and the page no longer drops to 0.
- SearchInput: clearing the field keeps focus in it instead of losing it to the page.
- SearchInput: Enter that confirms an IME composition no longer emits `searchSubmit`.
- SegmentedControl: choosing the option already selected no longer reports a change to the form, and focus leaving the group marks it as touched.
- Autocomplete: a click anywhere on the page no longer marks the field touched or clears its text when the field isn't in use.
- Autocomplete: disabled options set `aria-disabled`.
- MultiSelect: each chip shows the label of its own value, and its remove button removes that value. Before, chips used the options order, so with a selection made in another order they showed the wrong label and removed a different value.
- MultiSelect: a form-disabled control is no longer focusable and its chips can't be removed.
- MultiSelect: Escape and clicks outside mark the field touched when they close the panel.
- MultiSelect: options blocked by `maxSelected` set `aria-disabled`.
- FileUpload: dropped files are checked against `accept`, like the ones picked in the file dialog.
- FileUpload: files can't be removed while the component is disabled.
- Table: in client-side mode the `page` and `pageSize` inputs now set the initial page and page size (they were ignored: it always started at page 1 with 10 rows).
- Spinner: the loading text is now inside the `role="status"` live region (visually hidden), so screen readers announce it; an `aria-label` on a live region is often not read.
- Skeleton: the host is `aria-hidden="true"`, so placeholder shapes are skipped by assistive technology.
- Skeleton: a `circle` given only a `width` is now round; its height follows the width instead of the default `1rem`.
- `ToastrService`: `duration: 0` was replaced by the 5 s default, so a toast could never stay until closed. It now stays (and shows no progress bar).
- `ToastComponent`: toasts were silent for screen readers. Errors use `role="alert"`, the rest `role="status"`.
- `ChipGroupComponent`: removing a selected chip left its value in `selected` and in the form control. It is now dropped from both.
- `FormFieldComponent`: a projected control that already had an `id` (and no `for` input) was not linked to the label, hint or error. They now use the control's id.
- `FormFieldComponent`: `required` only drew the asterisk (hidden from screen readers). The control now gets `aria-required="true"`.
- NumberInput: the field shows the stored value after an entry that is clamped to the current value, or that isn't a number. Before, it kept the typed text.
- NumberInput: decimal steps are rounded, so three steps of 0.1 give 0.3 instead of 0.30000000000000004.
- NumberInput: leaving the field marks it touched.
- Tabs: when `active` points to a disabled tab or past the last one, the first enabled tab is shown and selected. Before, no panel was shown and no tab could be reached with Tab.
- Tabs: a non-lazy tab with an `ngxDsTabContent` template renders it. Before, it rendered nothing.
- Tabs: a lazy tab without a template shows its projected content instead of throwing.
- TreeSelect: Escape, clicks outside and Tab mark the field touched when they close the panel.
- TreeSelect: chips can't be removed while the control is disabled.
- TreeView: pressing Enter or Space on a node's expand toggle no longer also selects (or deselects) the node, and Space on the toggle now activates it.
- TreeView: ArrowRight expands and ArrowLeft collapses the focused node.
- TreeView: the tree is marked `aria-multiselectable` when selectable, nodes only expose `aria-selected` when the tree is selectable, disabled nodes expose `aria-disabled`, and the chevron icon is hidden from screen readers.
- Popover: the trigger points to the open panel with `aria-controls`.
- Popover: closing with Escape from inside the panel returns focus to the trigger instead of losing it.
- Popover: setting `disabled` while it is open now closes it.
- RangeSlider: the track fill stays inside the rail when the value is outside `min`–`max`.
- RangeSlider: `minGap` can no longer push a range thumb below `min` or above `max`.

### Security

- Autocomplete: option labels are HTML-escaped in the match highlight. Before, a label containing HTML (for example from async search results) was rendered as markup.

## [1.1.0] - 2026-11-19

### Added

- `DescriptionListComponent` (`ngx-ds-description-list`): label/value pairs for detail views, rendered as a semantic `<dl>`. Horizontal or vertical layout, several columns that collapse on narrow screens, sizes, dividers, a placeholder for empty values and per-item copy-to-clipboard buttons (`copied` output).
- `copy` and `copied` entries in `NGX_DS_LABELS` (ES and EN).
- `MaskedInputComponent` (`ngx-ds-masked-input`): text field that formats input with a mask such as `(999) 999-9999` (tokens `9`, `a`, `A`, `*`). Same look and options as `ngx-ds-input`, works with reactive, template-driven and Signal Forms, stores the raw value (or the formatted one with `keepLiterals`) and reports a `mask` validation error while incomplete.
- `NavbarComponent` (`ngx-ds-navbar`): top application bar with `[navbar-brand]` and `[navbar-actions]` slots, navigation links with active state and badges, an optional `sticky` mode, and a menu toggle when the bar is narrower than 768px.
- `openMenu` and `closeMenu` keys in `NgxDsLabels`.
- `StatCardComponent` (`ngx-ds-stat-card`): metric tile for dashboards with label, value, percentage change (green or red, with `invertTrend` for metrics where lower is better), optional icon, `loading` placeholders and a `[stat-footer]` slot.
- `increase`, `decrease` and `noChange` keys in `NgxDsLabels`.

## [1.0.0] - 2026-11-19

### Removed

The names deprecated in 0.7.0 are gone. Use the new names:

- Toast and Notification type `'error'`: use `'danger'`. `ToastrService.error()`: use `danger()`.
- OtpInput and FormField `error`: use `errorMessage`. OtpInput no longer has an error style without a message: set `errorMessage`, or bind it with Signal Forms.
- ChipGroup `variant="filled"`: use `"solid"`. ChipGroup `multiSelect`: use `multiple`.
- NotificationCenter and NotificationItem `dismiss` output: use `dismissed`.
- Drawer and Modal `showClose`: use `dismissible`.
- Popover `closeOnClickOutside`: use `closeOnBackdrop`.
- Alert `type` and the `AlertType` type: use `color` and `AlertColor`.

## [0.7.0] - 2026-11-18

### Added

- `disabled` input on Input, Textarea, Select, Dropdown, Autocomplete, Checkbox, Switch, Datepicker, TimePicker and TagInput, as the other form controls already had. The control is disabled when the input or the form disables it.
- `info` colour on Button, IconButton, MenuButton, Badge, Tag, Avatar, Spinner, ProgressBar, Checkbox, Radio, Switch, RangeSlider and the Table row actions. It uses the `--info-*` and `--fill-info` tokens.
- `ToastrService.danger()`.
- OtpInput `errorMessage`: shows the message under the boxes (`role="alert"`, linked with `aria-describedby`) and switches them to the error style.
- New names for inputs and outputs, in line with the rest of the library: FormField `errorMessage`, ChipGroup `variant="solid"` and `multiple`, NotificationCenter and NotificationItem `dismissed`, Drawer and Modal `dismissible`, Popover `closeOnBackdrop`, Alert `color` (type `AlertColor`).
- Prereleases: a version with a suffix (`1.0.0-rc.1`) is published to the `next` dist-tag, so `npm i @jdpo2008/ngx-ds` keeps installing the latest stable version. Try a prerelease with `npm i @jdpo2008/ngx-ds@next`.

### Changed

- ChipGroup: the CSS class `.chip-group--filled` is now `.chip-group--solid`. `variant="filled"` still renders it.

### Deprecated

These names still work and will be removed in 1.0:

- Toast and Notification type `'error'`: use `'danger'`, the name every other component uses. `ToastrService.error()`: use `danger()`.
- OtpInput and FormField `error`: use `errorMessage`.
- ChipGroup `variant="filled"`: use `"solid"`. ChipGroup `multiSelect`: use `multiple`.
- NotificationCenter and NotificationItem `dismiss` output: use `dismissed`. Both are emitted.
- Drawer and Modal `showClose`: use `dismissible`.
- Popover `closeOnClickOutside`: use `closeOnBackdrop`.
- Alert `type` and the `AlertType` type: use `color` and `AlertColor`.

### Removed

- Internal helpers are no longer exported from the package: `parseHex`, `contrastRatio`, `primaryPaletteCss`, `PRIMARY_STEPS`, `monthNames`, `weekdayNames` and `formatDayLabel`. The public colour API is `createPrimaryPalette`, `applyPrimaryColor` and the `PrimaryPalette` / `PrimaryStep` types.
- `styles/_legacy.scss` and its deprecated aliases (`--color-*`, `--border-color`, `--text-primary`, `--surface-secondary`, `--ngx-color-*`). No component read them since 0.1.0. Use the tokens in `_tokens.scss`, e.g. `--primary-500`, `--border-base`, `--text-base`, `--surface-subtle`.

## [0.6.0] - 2026-11-18

### Added

- InlineEdit molecule (`ngx-ds-inline-edit`): text that turns into a field on click. Enter or blur saves, Escape restores the previous value. Supports `multiline` (Ctrl/⌘+Enter saves), `required`, save/cancel buttons (`showActions`), `[(value)]`, `[(editing)]` and reactive forms.
- Visual regression tests: `npm run test:visual` screenshots every Storybook story in the light and dark themes and compares it with the baselines in `visual-baselines/`. CI runs it in the Playwright Docker image. New baselines come from `npm run test:visual:docker -- --update` or the "Update visual baselines" workflow. A story opts out with the `skip-visual` tag.
- Bundle size check: `npm run size` reports the size of the built package. On every PR, CI compares it with the target branch, posts the table as a PR comment and fails when the gzipped JavaScript grows more than 5 %.
- Runtime primary colour: `provideNgxDs({ colors: { primary: '#0d9488' } })` replaces the default indigo. The colour becomes `--primary-600` and the rest of the `--primary-*` scale is generated in OKLCH, for the light and the dark theme. `applyPrimaryColor(color)` changes it at any time (`null` restores indigo), and `createPrimaryPalette(color)` returns the scale. In dev mode, a warning flags a colour too light for white text (below 4.5:1).
- TreeSelect (`ngx-ds-tree-select`): a select whose options form a tree. In single mode `value` is one id; a click on a parent expands it unless `selectableParents` is set. With `multiple`, rows get checkboxes and `value` is an array: with `cascade` (the default) checking a parent checks every enabled leaf under it, and parents show a checked or mixed state. `searchable` filters by label and keeps the ancestors of matches. `expanded` is two-way bindable. The panel follows the WAI-ARIA tree pattern (arrow keys, Home / End, Right / Left to expand and collapse). It has `ControlValueAccessor` and Signal Forms `errors` / `touched`.

## [0.5.0] - 2026-11-18

### Added

- Accessibility tests: `npm run test:a11y` runs axe-core (WCAG 2.2 A/AA) on every Storybook story in the light and dark themes. It runs in CI after the Storybook build and fails on any violation, colour contrast included. A story opts out with the `skip-a11y` tag.
- Semantic fill tokens `--fill-primary`, `--fill-danger`, `--fill-success`, `--fill-warning` and `--fill-info`: solid backgrounds behind `--text-on-color`, also safe as text on `--surface-base`. They meet WCAG AA in both themes.
- `ariaLabel` input on Button, Checkbox, Switch, NumberInput and RangeSlider, for controls with no visible label.

### Changed

- Colour contrast meets WCAG AA in both themes. `--text-placeholder` is now gray-500 in the light theme, so placeholders and floating labels reach 4.5:1. Button, MenuButton, Tag, Badge, Alert, PasswordStrength, the selected days and chips, the Stepper and the notification badge use the new fill tokens, as do the error, focus and active text colours of the form controls and Tabs. In the light theme these are a shade darker than before; the dark theme is unchanged. Days from other months in Calendar, Datepicker and DateRangePicker use `--text-muted`.

### Fixed

- Popover: when the trigger is a native button or link, `aria-expanded` and `aria-haspopup` go on that element and the wrapper is no longer a second focusable button. Enter on a button trigger no longer toggles twice.
- Datepicker and TimePicker: the clear button is no longer nested inside the trigger, and it is 24 × 24 px.
- Accessible names for the Pagination arrows, the Table selection checkboxes and page-size select, the OTP digits, the RangeSlider thumbs, the Stepper steps and the Select, Dropdown and MultiSelect comboboxes.
- Timeline items are list items of the list again. A Table with a sticky header and a max height can be scrolled with the keyboard.
- RangeSlider and Rating have 24 px touch targets. The UserMenu trigger's accessible name no longer conflicts with the visible initials.

## [0.4.0] - 2026-11-18

### Added

- Splitter (`ngx-ds-splitter`): two resizable panes, side by side or stacked, projected with `[splitter-start]` and `[splitter-end]`. `size` (percent of the first pane) is two-way bindable and limited by `min` / `max`. The divider follows the WAI-ARIA window splitter pattern: drag it, use the arrow keys, Home / End, or Enter to collapse and restore the first pane. It has `step`, `disabled`, `ariaLabel` and the `resizeEnd` output.
- Carousel (`ngx-ds-carousel`): slides through a list of images with arrows, indicator dots, swipe and the arrow keys. `index` is two-way bindable. It has `loop`, `autoplay` (paused on hover and focus, with a pause button), `aspectRatio`, `fit` and the `itemClick` output. Slides follow the WAI-ARIA carousel pattern.
- Lightbox (`ngx-ds-lightbox`): full-screen image viewer with `open` and `index` two-way bindable, captions, a counter, arrow keys, swipe, a focus trap and Escape to close. It takes the same `CarouselItem[]` as Carousel.
- TagInput (`ngx-ds-tag-input`): text field that turns what you type into tags. The value is a `string[]`. Enter or a comma adds a tag, Backspace on an empty field removes the last one, and pasted text is split by the separators. It has `separators`, `maxTags`, `allowDuplicates`, `addOnBlur`, the `added` / `removed` outputs, `ControlValueAccessor` and Signal Forms `errors` / `touched`.
- TimePicker (`ngx-ds-time-picker`): time field with hour and minute columns. The value is a 24-hour `HH:mm` string. It has 12-hour display with AM/PM, `minuteStep`, `minTime` / `maxTime`, keyboard navigation, `ControlValueAccessor` and Signal Forms `errors` / `touched`.
- Form controls link their error or hint message to the focusable element with `aria-describedby` and set `aria-invalid` while they show an error. The error message of MultiSelect, NumberInput and DateRangePicker now has `role="alert"`, like the other controls.
- OtpInput accepts Signal Forms errors: it gets the `errors` and `touched` inputs and shows the error style once the field is touched.

### Fixed

- NumberInput shows a red border when it has an error. It used to show only the message.

## [0.3.0] - 2026-11-18

### Added

- Form controls show Signal Forms validation errors automatically. Once the field is touched, Input, Textarea, NumberInput, Select, Dropdown, Autocomplete, MultiSelect, Datepicker and DateRangePicker show the first error's `message` and switch to the error style. An explicit `errorMessage` still takes priority. The controls get two new inputs, `errors` and `touched`, which `[formField]` sets (#37).

## [0.2.0] - 2026-11-17

### Added

- `ng add @jdpo2008/ngx-ds` schematic. It installs `lucide-angular` and adds the design tokens stylesheet to the application's `styles` in `angular.json`. Use `--project` in a workspace with several applications (#32).
- Signal Forms support: every form control can be bound with `[formField]`. A spec covers all 18 controls (#33).
- `provideNgxDs({ locale, labels, theme })` configures the library in one call. An `en-*` locale also selects the English labels, and `theme: 'system'` follows `prefers-color-scheme` (#34).

### Fixed

- NumberInput (`min`, `max`), RangeSlider (`min`, `max`) and Rating (`max`) now accept `undefined`. Before, binding them with `[formField]` failed to compile under strict templates, because Signal Forms binds the field's `min`/`max` (`number | undefined`) to inputs with those names (#33).

## [0.1.0] - 2026-11-17

First public release.

### Components

- 13 atoms, 29 molecules, 18 organisms and the `FocusTrap` directive. They are standalone, use a signal-based API and `OnPush`. See the [README](projects/ngx-ds/README.md) for the full list.
- `ToastrService` and `ConfirmationService` drive the Toast and Confirmation organisms.

### Theming

- Design tokens as CSS custom properties: primitives (`--gray-*`, `--primary-*`, `--danger-*`, `--success-*`, `--warning-*`, `--info-*`) and a semantic layer (`--text-*`, `--surface-*`, `--border-*`). Every component reads tokens with a hardcoded fallback (#23, #24).
- Opt-in dark theme via `data-theme="dark"` or `.dark`, with WCAG AA contrast for text (#25, #26).
- Indigo is the primary color. Selection states use it in every picker (#28, #29).
- New `styles/ngx-ds.scss` entry point for consumers that needs no Tailwind.

### Forms and accessibility

- `ControlValueAccessor` on the form controls, including `setDisabledState` (#15, #16, #20).
- Keyboard navigation for listboxes, the datepicker, the date-range-picker and the calendar (#7, #8, #9).
- Template a11y fixes, and focus trapping in Modal, Drawer, Confirmation and CommandPalette (#4, #27).

### Internationalization

- `provideNgxDsLocale()` for month and weekday names and formatting (default `es-ES`) (#13).
- `provideNgxDsLabels()` for UI labels, with Spanish (default) and English sets (#14, #19).

### Breaking changes since pre-release builds

- Outputs named after native DOM events (`search`, `change`) were removed. Use their replacements (#10, #12).
- Radio emits `valueSelect` (#11).

### Tooling

- Vitest specs for every atom, molecule, organism and shared helper (#6, #18, #20, #21, #22, #27).
- CI runs format, lint, tests, the library build and the Storybook build (#3).
- Release workflow that publishes to npm when a GitHub release is published.

[1.2.1]: https://github.com/jdpo2008/ngx-ds/releases/tag/v1.2.1
[1.2.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v1.2.0
[1.1.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v1.1.0
[1.0.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v1.0.0
[0.7.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.7.0
[0.6.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.6.0
[0.5.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.5.0
[0.4.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.4.0
[0.3.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.3.0
[0.2.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.2.0
[0.1.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.1.0
