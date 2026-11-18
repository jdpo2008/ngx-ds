import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ChipGroupComponent } from './molecules/chip-group/chip-group.component';
import { FormFieldComponent } from './molecules/form-field/form-field.component';
import { OtpInputComponent } from './molecules/otp-input/otp-input.component';
import { DrawerComponent } from './organisms/drawer/drawer.component';
import { ModalComponent } from './organisms/modal/modal.component';
import { NgxNotification } from './organisms/notification-center/notification.types';
import { NotificationItemComponent } from './organisms/notification-center/notification-item/notification-item.component';
import { PopoverComponent } from './organisms/popover/popover.component';

function create<T>(component: Type<T>, inputs: Record<string, unknown>) {
  const fixture = TestBed.createComponent(component);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  fixture.detectChanges();
  return { fixture, cmp: fixture.componentInstance, el: fixture.nativeElement as HTMLElement };
}

describe('OtpInput errorMessage', () => {
  it('shows the message, links it to the boxes and marks them invalid', () => {
    const { el } = create(OtpInputComponent, { length: 4, errorMessage: 'Código incorrecto' });
    const message = el.querySelector('.otp__message')!;
    expect(message.textContent).toContain('Código incorrecto');
    expect(message.getAttribute('role')).toBe('alert');
    const box = el.querySelector('input')!;
    expect(box.getAttribute('aria-describedby')).toBe(message.id);
    expect(box.getAttribute('aria-invalid')).toBe('true');
  });

  it('keeps the deprecated error boolean: error style without a message', () => {
    const { el } = create(OtpInputComponent, { length: 4, error: true });
    expect(el.querySelector('input')!.getAttribute('aria-invalid')).toBe('true');
    expect(el.querySelector('.otp__message')).toBeNull();
  });
});

describe('FormField errorMessage', () => {
  it.each(['errorMessage', 'error'])('shows the message set with %s', (name) => {
    const { el } = create(FormFieldComponent, { [name]: 'Obligatorio' });
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Obligatorio');
  });
});

describe('ChipGroup renames', () => {
  const chips = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
  ];

  it.each(['solid', 'filled'])('variant %s uses the solid style', (variant) => {
    const { el } = create(ChipGroupComponent, { chips, variant });
    expect(el.querySelector('.chip-group--solid')).not.toBeNull();
    expect(el.querySelector('.chip-group--filled')).toBeNull();
  });

  it.each([{ multiple: false }, { multiSelect: false }, { multiple: true, multiSelect: false }])(
    'selects a single chip with %o',
    (inputs) => {
      const { cmp } = create(ChipGroupComponent, { chips, selected: ['a'], ...inputs });
      cmp.toggle(chips[1]);
      expect(cmp.selected()).toEqual(['b']);
    },
  );

  it('selects several chips by default', () => {
    const { cmp } = create(ChipGroupComponent, { chips, selected: ['a'] });
    cmp.toggle(chips[1]);
    expect(cmp.selected()).toEqual(['a', 'b']);
  });
});

describe('NotificationItem dismissed', () => {
  it('emits dismissed and the deprecated dismiss', () => {
    const notification: NgxNotification = { id: 1, type: 'info', title: 'Hola' };
    const { cmp, el } = create(NotificationItemComponent, { notification });
    const got: string[] = [];
    cmp.dismissed.subscribe(() => got.push('dismissed'));
    cmp.dismiss.subscribe(() => got.push('dismiss'));
    el.querySelector<HTMLElement>(
      '.notif-item__dismiss button, button.notif-item__dismiss',
    )!.click();
    expect(got).toEqual(['dismissed', 'dismiss']);
  });
});

describe.each([
  ['Drawer', DrawerComponent, '.drawer__close'],
  ['Modal', ModalComponent, '.modal__close'],
] as const)('%s dismissible', (_name, component, selector) => {
  it('shows the close button by default', () => {
    const { el } = create(component as Type<unknown>, { open: true });
    expect(el.querySelector(selector)).not.toBeNull();
  });

  it.each([{ dismissible: false }, { showClose: false }])('hides it with %o', (inputs) => {
    const { el } = create(component as Type<unknown>, { open: true, ...inputs });
    expect(el.querySelector(selector)).toBeNull();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });
});

describe('Popover closeOnBackdrop', () => {
  function clickOutside(inputs: Record<string, unknown>) {
    const { fixture, cmp } = create(PopoverComponent, { open: true, ...inputs });
    document.body.click();
    fixture.detectChanges();
    return cmp.open();
  }

  it('closes on an outside click by default', () => {
    expect(clickOutside({})).toBe(false);
  });

  it.each([{ closeOnBackdrop: false }, { closeOnClickOutside: false }])(
    'stays open with %o',
    (inputs) => {
      expect(clickOutside(inputs)).toBe(true);
    },
  );
});
