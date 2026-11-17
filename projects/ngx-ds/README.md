# @jdpo2008/ngx-ds

An Angular 21 component library: standalone components, a signal-based API, `OnPush` change detection and CSS custom-property design tokens with an opt-in dark theme.

## Install

```bash
npm install @jdpo2008/ngx-ds lucide-angular
```

Peer dependencies: `@angular/common`, `@angular/core`, `@angular/forms` and `@angular/platform-browser` 21, and `lucide-angular` 1.

## Styles

Load the design tokens once, globally. Add the stylesheet to `angular.json`:

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

The dark theme is opt-in. Set `data-theme="dark"` on `<html>` or add the `dark` class to an ancestor.

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

### Language

Labels default to Spanish and dates to `es-ES`. To switch app-wide:

```ts
import { NGX_DS_LABELS_EN, provideNgxDsLabels, provideNgxDsLocale } from '@jdpo2008/ngx-ds';

bootstrapApplication(AppComponent, {
  providers: [provideNgxDsLabels(NGX_DS_LABELS_EN), provideNgxDsLocale('en-US')],
});
```

## Components

- **Atoms:** Avatar, Badge, Button, Divider, Icon, IconButton, Kbd, MenuButton, ProgressBar, Skeleton, Spinner, Tag, Tooltip.
- **Molecules:** Alert, Autocomplete, AvatarGroup, Breadcrumb, ButtonGroup, Card, Checkbox, ChipGroup, ColorPicker, Datepicker, DateRangePicker, Dropdown, EmptyState, FileUpload, FormField, Input, Menu, MultiSelect, NumberInput, OtpInput, PasswordStrength, Radio, RangeSlider, Rating, SearchInput, SegmentedControl, Select, Switch, Textarea.
- **Organisms:** Accordion, Calendar, CommandPalette, Confirmation, ContextMenu, Drawer, Modal, NotificationCenter, Pagination, Popover, Sidebar, Stepper, Table, Tabs, Timeline, Toast, TreeView, UserMenu.
- **Directives:** FocusTrap.

## Changelog

See [CHANGELOG.md](https://github.com/jdpo2008/ngx-ds/blob/master/CHANGELOG.md).
