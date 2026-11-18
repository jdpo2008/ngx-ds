# @jdpo2008/ngx-ds

An Angular 21 component library: standalone components, a signal-based API, `OnPush` change detection and CSS custom-property design tokens with an opt-in dark theme.

Browse every component in the [Storybook](https://jdpo2008.github.io/ngx-ds/).

## Install

```bash
ng add @jdpo2008/ngx-ds
```

`ng add` installs the package and `lucide-angular`, and adds the design tokens stylesheet to the `styles` of your application in `angular.json`. In a workspace with several applications, pass `--project <name>`.

To set it up by hand instead:

```bash
npm install @jdpo2008/ngx-ds lucide-angular
```

then load the stylesheet as described in [Styles](#styles).

Peer dependencies: `@angular/common`, `@angular/core`, `@angular/forms` and `@angular/platform-browser` 21, and `lucide-angular` 1.

## Styles

`ng add` does this for you. Otherwise, load the design tokens once, globally. Add the stylesheet to `angular.json`:

```json
"styles": ["node_modules/@jdpo2008/ngx-ds/styles/ngx-ds.scss", "src/styles.scss"]
```

or `@use` it from your global `styles.scss`:

```scss
@use '@jdpo2008/ngx-ds/styles/ngx-ds';
```

No Tailwind is required. Components use the `Poppins` font family by default but do not load it. Load it yourself, or point `--ngx-primary-font-family` at another font.

### Theming

Every color is a CSS custom property (`--primary-600`, `--text-base`, `--surface-base`, `--border-base`, …). Override any of them in your own `:root`:

```css
:root {
  --primary-600: #0d9488;
}
```

The dark theme is opt-in. Set `data-theme="dark"` on `<html>`, add the `dark` class to an ancestor, or use the `theme` option of `provideNgxDs()` (see [Configuration](#configuration)).

## Usage

Every component is standalone. Import it where you use it:

```ts
import { Component } from '@angular/core';
import { ButtonComponent, InputComponent } from '@jdpo2008/ngx-ds';

@Component({
  selector: 'app-root',
  imports: [ButtonComponent, InputComponent],
  template: `
    <ngx-ds-input [(value)]="name" />
    <ngx-ds-button (click)="save()">Save</ngx-ds-button>
  `,
})
export class AppComponent {
  name = '';
  save() {}
}
```

Form controls (Input, Select, Checkbox, Datepicker, …) implement `ControlValueAccessor`, so they also work with `ngModel` and reactive forms. SearchInput is the exception: bind it with `[(value)]`.

They also work with Signal Forms (`@angular/forms/signals`, experimental in Angular 21). Bind them with `[formField]`:

```ts
import { FormField, form, required } from '@angular/forms/signals';

@Component({
  imports: [FormField, InputComponent],
  template: `<ngx-ds-input label="Name" [formField]="f.name" />`,
})
export class Profile {
  model = signal({ name: '' });
  f = form(this.model, (p) => required(p.name, { message: 'Name is required' }));
}
```

The field's value, touched and disabled state stay in sync. The field's `min` and `max` validators also set the limits of NumberInput and RangeSlider, and `max` sets the star count of Rating. Once the field is touched, its errors show automatically: Input, Textarea, NumberInput, Select, Dropdown, Autocomplete, MultiSelect, Datepicker and DateRangePicker show the first error's `message` and switch to the error style. An error without a `message` only switches the style. An explicit `[errorMessage]` takes priority.

### Toasts and confirmations

Place the hosts once, usually in the root component, and trigger them from the services:

<!-- prettier-ignore -->
```html
<ngx-ds-toast />
<ngx-ds-confirmation />
```

```ts
const toastr = inject(ToastrService);
const confirmation = inject(ConfirmationService);

toastr.success('Changes saved');
const ok = await confirmation.confirm({
  title: 'Delete',
  message: 'Are you sure?',
  type: 'danger',
});
```

### Configuration

Labels default to Spanish and dates to `es-ES`. Configure the library app-wide with `provideNgxDs()`:

```ts
import { provideNgxDs } from '@jdpo2008/ngx-ds';

bootstrapApplication(AppComponent, {
  providers: [provideNgxDs({ locale: 'en-US', labels: { close: 'Dismiss' }, theme: 'system' })],
});
```

| Option   | Default   | Effect                                                                                                                                                    |
| -------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `locale` | `'es-ES'` | Month and weekday names, date and number formatting. An `en-*` locale also switches the labels to English.                                                |
| `labels` | —         | Overrides individual labels. Missing keys come from the locale's set.                                                                                     |
| `theme`  | —         | `'light'`, `'dark'` or `'system'` (follows `prefers-color-scheme` and updates live). Sets `data-theme` on `<html>`. Omit it to manage the theme yourself. |
| `colors` | —         | `{ primary: '#0d9488' }` replaces the default indigo. See [Brand colour](#brand-colour).                                                                  |

`provideNgxDsLocale()` and `provideNgxDsLabels()` still work for setting one thing at a time.

### Brand colour

`colors.primary` takes a `#rgb` or `#rrggbb` colour. It becomes `--primary-600` (buttons, focus rings, selected states) and the rest of the `--primary-*` scale is generated from it in OKLCH, for the light and the dark theme. Pick a colour dark enough for white text: in dev mode, ngx-ds warns when the contrast is below 4.5:1.

To change it at runtime, for example per tenant:

```ts
import { applyPrimaryColor } from '@jdpo2008/ngx-ds';

applyPrimaryColor('#e11d48'); // switch
applyPrimaryColor(null); // back to indigo
```

`createPrimaryPalette(color)` returns the generated scale if you need the values elsewhere.

## Components

- **Atoms:** Avatar, Badge, Button, Divider, Icon, IconButton, Kbd, MenuButton, ProgressBar, Skeleton, Spinner, Tag, Tooltip.
- **Molecules:** Alert, Autocomplete, AvatarGroup, Breadcrumb, ButtonGroup, Card, Checkbox, ChipGroup, ColorPicker, Datepicker, DateRangePicker, Dropdown, EmptyState, FileUpload, FormField, Input, Menu, MultiSelect, NumberInput, OtpInput, PasswordStrength, Radio, RangeSlider, Rating, SearchInput, SegmentedControl, Select, Switch, Textarea.
- **Organisms:** Accordion, Calendar, CommandPalette, Confirmation, ContextMenu, Drawer, Modal, NotificationCenter, Pagination, Popover, Sidebar, Stepper, Table, Tabs, Timeline, Toast, TreeView, UserMenu.
- **Directives:** FocusTrap.

## Changelog

See [CHANGELOG.md](https://github.com/jdpo2008/ngx-ds/blob/master/CHANGELOG.md).

## License

[MIT](https://github.com/jdpo2008/ngx-ds/blob/master/LICENSE)
