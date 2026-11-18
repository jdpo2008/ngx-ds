# Changelog

All notable changes to `@jdpo2008/ngx-ds` are documented here. The project follows [Semantic Versioning](https://semver.org/). Until 1.0.0, minor versions may contain breaking changes.

## [Unreleased]

### Added

- `info` colour on Button, IconButton, MenuButton, Badge, Tag, Avatar, Spinner, ProgressBar, Checkbox, Radio, Switch, RangeSlider and the Table row actions. It uses the `--info-*` and `--fill-info` tokens.
- `ToastrService.danger()`.

### Deprecated

- The `'error'` type of Toast and Notification. Use `'danger'`, the name every other component uses. `'error'` still works and shows the danger style; it will be removed in 1.0. `ToastrService.error()` is deprecated in favour of `danger()`.

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

[0.6.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.6.0
[0.5.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.5.0
[0.4.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.4.0
[0.3.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.3.0
[0.2.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.2.0
[0.1.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.1.0
