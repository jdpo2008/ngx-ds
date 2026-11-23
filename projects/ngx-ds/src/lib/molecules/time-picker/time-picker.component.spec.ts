import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormField, form, required } from '@angular/forms/signals';
import { TimePickerComponent, parseTime } from './time-picker.component';

async function setup(inputs: Record<string, unknown> = {}, value: string | null = null) {
  const fixture = TestBed.createComponent(TimePickerComponent);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  const cmp = fixture.componentInstance;
  cmp.writeValue(value);
  fixture.detectChanges();
  document.body.appendChild(fixture.nativeElement);
  const el = fixture.nativeElement as HTMLElement;
  const trigger = el.querySelector('[role="button"]') as HTMLElement;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const open = async () => {
    trigger.click();
    await render();
  };
  const column = (i: number) =>
    Array.from(
      el.querySelectorAll<HTMLButtonElement>(
        `[role="listbox"]:nth-of-type(${i + 1}) [role="option"]`,
      ),
    );
  const option = (i: number, label: string) =>
    column(i).find((o) => o.textContent!.trim() === label)!;
  const press = async (key: string) => {
    (document.activeElement as HTMLElement).dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    );
    await render();
  };
  return { fixture, cmp, el, trigger, render, open, column, option, press };
}

describe('parseTime', () => {
  it('parses HH:mm into minutes and rejects invalid values', () => {
    expect(parseTime('09:30')).toBe(570);
    expect(parseTime('9:05')).toBe(545);
    expect(parseTime('24:00')).toBeNull();
    expect(parseTime('12:60')).toBeNull();
    expect(parseTime('abc')).toBeNull();
    expect(parseTime(null)).toBeNull();
  });
});

describe('TimePickerComponent', () => {
  afterEach(() => document.body.replaceChildren());

  it('shows the placeholder, then the value in 24-hour format', async () => {
    const { el, fixture, cmp } = await setup();
    expect(el.querySelector('.ngx-time-picker__placeholder')!.textContent!.trim()).toBe('HH:MM');
    cmp.writeValue('14:05');
    fixture.detectChanges();
    expect(el.querySelector('.ngx-time-picker__value')!.textContent!.trim()).toBe('14:05');
  });

  it('opens a panel with 24 hours and minutes in steps of minuteStep', async () => {
    const { open, column, trigger } = await setup({ minuteStep: 15 });
    await open();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(column(0).length).toBe(24);
    expect(column(1).map((o) => o.textContent!.trim())).toEqual(['00', '15', '30', '45']);
  });

  it('picking an hour then a minute sets the value and closes the panel', async () => {
    const { cmp, el, open, option, render } = await setup();
    const changes: (string | null)[] = [];
    cmp.registerOnChange((v) => changes.push(v));
    await open();
    option(0, '09').click();
    await render();
    expect(cmp.value()).toBe('09:00');
    option(1, '30').click();
    await render();
    expect(cmp.value()).toBe('09:30');
    expect(changes).toEqual(['09:00', '09:30']);
    expect(el.querySelector('.ngx-time-picker__panel')).toBeNull();
  });

  it('disables the times outside minTime / maxTime', async () => {
    const { cmp, open, option, render } = await setup(
      { minTime: '09:30', maxTime: '17:00', minuteStep: 15 },
      '09:45',
    );
    await open();
    expect(option(0, '08').getAttribute('aria-disabled')).toBe('true');
    expect(option(0, '09').getAttribute('aria-disabled')).toBeNull();
    expect(option(0, '18').getAttribute('aria-disabled')).toBe('true');
    expect(option(1, '15').getAttribute('aria-disabled')).toBe('true');

    // Moving to 17h keeps the minute only when it is still allowed.
    option(0, '17').click();
    await render();
    expect(cmp.value()).toBe('17:00');
  });

  it('12-hour format shows h:mm AM/PM and the period column switches the hour', async () => {
    const { cmp, el, open, column, option, render } = await setup({ hourFormat: '12' }, '14:30');
    expect(el.querySelector('.ngx-time-picker__value')!.textContent!.trim()).toBe('2:30 PM');
    await open();
    expect(column(0)[0].textContent!.trim()).toBe('12');
    expect(option(2, 'PM').getAttribute('aria-selected')).toBe('true');
    option(2, 'AM').click();
    await render();
    expect(cmp.value()).toBe('02:30');
  });

  it('opening focuses the selected hour; arrows move inside the column', async () => {
    const { open, press } = await setup({}, '10:00');
    await open();
    expect(document.activeElement!.textContent!.trim()).toBe('10');
    await press('ArrowDown');
    expect(document.activeElement!.textContent!.trim()).toBe('11');
    await press('Home');
    expect(document.activeElement!.textContent!.trim()).toBe('00');
    await press('End');
    expect(document.activeElement!.textContent!.trim()).toBe('23');
  });

  it('Escape closes the panel and returns focus to the trigger', async () => {
    const { el, trigger, open, render } = await setup();
    await open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await render();
    expect(el.querySelector('.ngx-time-picker__panel')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('the clear button resets the value', async () => {
    const { cmp, el, render } = await setup({}, '08:00');
    el.querySelector<HTMLButtonElement>('.ngx-time-picker__clear')!.click();
    await render();
    expect(cmp.value()).toBeNull();
    expect(el.querySelector('.ngx-time-picker__clear')).toBeNull();
  });

  it('clearing moves focus to the trigger and marks the control touched', async () => {
    const { cmp, el, trigger, render } = await setup({}, '08:00');
    const touched = vi.fn();
    cmp.registerOnTouched(touched);
    const clear = el.querySelector<HTMLButtonElement>('.ngx-time-picker__clear')!;
    clear.focus();
    clear.click();
    await render();
    expect(document.activeElement).toBe(trigger);
    expect(touched).toHaveBeenCalledTimes(1);
  });

  it('does not open when disabled', async () => {
    const { cmp, el, open } = await setup();
    cmp.setDisabledState(true);
    await open();
    expect(el.querySelector('.ngx-time-picker__panel')).toBeNull();
  });
});

@Component({
  standalone: true,
  imports: [TimePickerComponent, FormField],
  template: `<ngx-ds-time-picker [formField]="f.start" />`,
})
class SignalHost {
  model = signal({ start: '' as string | null });
  f = form(this.model, (p) => required(p.start, { message: 'La hora es obligatoria' }));
}

describe('TimePickerComponent with Signal Forms', () => {
  it('syncs the model and shows the error once touched', async () => {
    const fixture = TestBed.createComponent(SignalHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const cmp = fixture.debugElement.query(By.directive(TimePickerComponent))
      .componentInstance as TimePickerComponent;
    const el = fixture.nativeElement as HTMLElement;

    host.model.set({ start: '07:15' });
    fixture.detectChanges();
    expect(cmp.value()).toBe('07:15');

    host.model.set({ start: null });
    fixture.detectChanges();
    expect(el.querySelector('[role="alert"]')).toBeNull();

    host.f.start().markAsTouched();
    fixture.detectChanges();
    const alert = el.querySelector('[role="alert"]')!;
    expect(alert.textContent!.trim()).toBe('La hora es obligatoria');
    expect(el.querySelector('[role="button"]')!.getAttribute('aria-describedby')).toBe(alert.id);
  });
});

describe('TimePickerComponent edge cases', () => {
  afterEach(() => document.body.replaceChildren());

  it('a minute picked before an hour uses the first hour that allows it', async () => {
    const { cmp, open, option, render } = await setup({ minTime: '09:10', minuteStep: 5 });
    await open();
    option(1, '05').click();
    await render();
    expect(cmp.value()).toBe('10:05');
    expect(cmp.isOpen()).toBe(false);
  });

  it('a minute no hour allows is ignored', async () => {
    const { cmp, open, option, render } = await setup({ minTime: '10:00', maxTime: '10:00' });
    await open();
    option(1, '05').click();
    await render();
    expect(cmp.value()).toBeNull();
    expect(cmp.isOpen()).toBe(true);
  });

  it('minuteStep is clamped to 1–60', async () => {
    const { fixture, open, column, render } = await setup({ minuteStep: 0 });
    await open();
    expect(column(1).length).toBe(60);
    fixture.componentRef.setInput('minuteStep', 90);
    await render();
    expect(column(1).map((o) => o.textContent!.trim())).toEqual(['00']);
  });

  it('12-hour: PM before an hour switches the hour column', async () => {
    const { cmp, open, option, column, render } = await setup({ hourFormat: '12' });
    await open();
    option(2, 'PM').click();
    await render();
    expect(cmp.value()).toBeNull();
    expect(option(2, 'PM').getAttribute('aria-selected')).toBe('true');
    option(0, '3').click();
    await render();
    expect(cmp.value()).toBe('15:00');
    expect(column(0)[0].textContent!.trim()).toBe('12');
  });

  it('12-hour: a period with no allowed hour is disabled', async () => {
    const { cmp, open, option, render } = await setup(
      { hourFormat: '12', minTime: '13:00' },
      '14:00',
    );
    await open();
    const am = option(2, 'AM');
    expect(am.getAttribute('aria-disabled')).toBe('true');
    am.click();
    await render();
    expect(cmp.value()).toBe('14:00');
    expect(option(2, 'PM').getAttribute('aria-selected')).toBe('true');
  });

  it('12-hour: switching period keeps the value when the new hour is not allowed', async () => {
    const { cmp, open, option, render } = await setup(
      { hourFormat: '12', maxTime: '12:00' },
      '02:30',
    );
    expect(cmp.displayValue()).toBe('2:30 AM');
    await open();
    option(2, 'PM').click();
    await render();
    expect(cmp.value()).toBe('02:30');
  });

  it('ArrowUp moves up the column and other keys do nothing', async () => {
    const { open, press } = await setup({}, '10:00');
    await open();
    await press('ArrowUp');
    expect(document.activeElement!.textContent!.trim()).toBe('09');
    await press('a');
    expect(document.activeElement!.textContent!.trim()).toBe('09');
  });

  it('Enter opens; keys from nested elements are ignored', async () => {
    const { cmp, el, trigger } = await setup();
    el.querySelector('.ngx-time-picker__placeholder')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    expect(cmp.isOpen()).toBe(false);
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(cmp.isOpen()).toBe(false);
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(cmp.isOpen()).toBe(true);
  });

  it('an outside click closes and marks touched only when open', async () => {
    const { cmp, open } = await setup();
    const touched = vi.fn();
    cmp.registerOnTouched(touched);
    document.body.click();
    expect(touched).not.toHaveBeenCalled();
    await open();
    document.body.click();
    expect(cmp.isOpen()).toBe(false);
    expect(touched).toHaveBeenCalledOnce();
  });

  it('a disabled control ignores clear and option picks', async () => {
    const { cmp } = await setup({}, '08:00');
    cmp.setDisabledState(true);
    cmp.clearValue(new Event('click'));
    cmp.select('hour', { value: 9, label: '09', disabled: false, selected: false });
    cmp.select('minute', { value: 30, label: '30', disabled: false, selected: false });
    cmp.select('period', { value: 12, label: 'PM', disabled: false, selected: false });
    expect(cmp.value()).toBe('08:00');
  });

  it('floating label, hint and error classes', async () => {
    const { fixture, el, trigger, open, render } = await setup({
      label: 'Hora',
      floatingLabel: true,
      hint: 'Entre 9 y 17',
      size: 'lg',
    });
    const float = () => el.querySelector('.ngx-time-picker__float-label')!;
    expect(float().className).not.toContain('--active');
    expect(el.querySelector('.ngx-time-picker__message--hint')!.textContent!.trim()).toBe(
      'Entre 9 y 17',
    );
    await open();
    expect(float().className).toContain('ngx-time-picker__float-label--active');
    expect(float().className).toContain('ngx-time-picker__float-label--focused');
    expect(trigger.className).toContain('ngx-time-picker__field--lg');
    fixture.componentRef.setInput('errorMessage', 'Fuera de horario');
    await render();
    expect(float().className).toContain('ngx-time-picker__float-label--error');
    expect(trigger.className).toContain('ngx-time-picker__field--error');
    expect(el.querySelector('.ngx-time-picker__message--hint')).toBeNull();
  });
});
