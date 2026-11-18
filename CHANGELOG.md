# Changelog

All notable changes to `@jdpo2008/ngx-ds` are documented here. The project follows [Semantic Versioning](https://semver.org/). Until 1.0.0, minor versions may contain breaking changes.

## [Unreleased]

### Added

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

[0.3.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.3.0
[0.2.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.2.0
[0.1.0]: https://github.com/jdpo2008/ngx-ds/releases/tag/v0.1.0
