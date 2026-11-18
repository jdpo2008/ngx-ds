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
