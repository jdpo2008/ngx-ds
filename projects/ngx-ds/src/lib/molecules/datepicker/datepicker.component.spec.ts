import { TestBed } from '@angular/core/testing';
import { DatepickerComponent } from './datepicker.component';
import { NGX_DS_LABELS_EN, provideNgxDsLabels } from '../../shared/labels';

const label = (d: Date) =>
  d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

describe('DatepickerComponent keyboard navigation', () => {
  async function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(DatepickerComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    const cmp = fixture.componentInstance;
    cmp.writeValue(new Date(2026, 0, 15)); // Thursday 15 Jan 2026
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    const el = fixture.nativeElement as HTMLElement;
    const trigger = el.querySelector('[role="button"]') as HTMLElement;

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    const press = async (key: string, shiftKey = false) => {
      (document.activeElement as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }),
      );
      fixture.detectChanges();
      await fixture.whenStable();
    };
    const focusedLabel = () => (document.activeElement as HTMLElement).getAttribute('aria-label');
    return { fixture, cmp, el, trigger, press, focusedLabel };
  }

  afterEach(() => document.body.replaceChildren());

  it('opening moves focus to the selected day, the only tabbable cell', async () => {
    const { el, focusedLabel } = await setup();
    expect(focusedLabel()).toBe(label(new Date(2026, 0, 15)));
    const tabbable = el.querySelectorAll('[role="gridcell"][tabindex="0"]');
    expect(tabbable.length).toBe(1);
    expect(el.querySelectorAll('[role="row"]').length).toBe(6);
    expect(document.activeElement?.getAttribute('aria-selected')).toBe('true');
  });

  it('arrows, Home and End move the focus within the grid', async () => {
    const { press, focusedLabel } = await setup();
    await press('ArrowRight');
    expect(focusedLabel()).toBe(label(new Date(2026, 0, 16)));
    await press('ArrowDown');
    expect(focusedLabel()).toBe(label(new Date(2026, 0, 23)));
    await press('Home');
    expect(focusedLabel()).toBe(label(new Date(2026, 0, 19)));
    await press('End');
    expect(focusedLabel()).toBe(label(new Date(2026, 0, 25)));
  });

  it('crossing the month edge and PageUp/PageDown change the visible month', async () => {
    const { cmp, press, focusedLabel } = await setup();
    await press('PageDown');
    expect(cmp.headerText()).toBe('Febrero 2026');
    expect(focusedLabel()).toBe(label(new Date(2026, 1, 15)));
    await press('PageUp', true);
    expect(cmp.headerText()).toBe('Febrero 2025');
    await press('PageDown', true);
    await press('PageUp');
    await press('Home'); // Monday 12 Jan
    await press('ArrowUp');
    await press('ArrowUp'); // Monday 29 Dec 2025
    expect(cmp.headerText()).toBe('Diciembre 2025');
    expect(focusedLabel()).toBe(label(new Date(2025, 11, 29)));
  });

  it('activating a day selects it, closes and returns focus to the trigger', async () => {
    const { cmp, trigger, press } = await setup();
    await press('ArrowRight');
    (document.activeElement as HTMLElement).click();
    expect(cmp.value()?.getDate()).toBe(16);
    expect(cmp.isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('disabled days stay reachable by keyboard but cannot be selected', async () => {
    const { cmp, press, focusedLabel } = await setup({ maxDate: new Date(2026, 0, 15) });
    await press('ArrowRight');
    const day16 = document.activeElement as HTMLElement;
    expect(focusedLabel()).toBe(label(new Date(2026, 0, 16)));
    expect(day16.getAttribute('aria-disabled')).toBe('true');
    day16.click();
    expect(cmp.value()?.getDate()).toBe(15);
    expect(cmp.isOpen()).toBe(true);
  });
});

describe('DatepickerComponent outside click', () => {
  function setup() {
    const fixture = TestBed.createComponent(DatepickerComponent);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const touched = vi.fn();
    cmp.registerOnTouched(touched);
    return { fixture, cmp, touched };
  }

  it('closes the open panel and marks touched', () => {
    const { fixture, cmp, touched } = setup();
    cmp.togglePanel();
    fixture.detectChanges();
    document.body.click();
    expect(cmp.isOpen()).toBe(false);
    expect(touched).toHaveBeenCalled();
  });

  it('does not mark touched while closed', () => {
    const { touched } = setup();
    document.body.click();
    expect(touched).not.toHaveBeenCalled();
  });
});

describe('DatepickerComponent mouse and state', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(DatepickerComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    const cmp = fixture.componentInstance;
    const changed = vi.fn();
    cmp.registerOnChange(changed);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    const el = fixture.nativeElement as HTMLElement;
    const q = <T extends HTMLElement = HTMLElement>(s: string) => el.querySelector<T>(s);
    const open = () => {
      cmp.togglePanel();
      fixture.detectChanges();
    };
    return { fixture, cmp, el, q, open, changed };
  }

  const todayStart = () => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  };

  afterEach(() => document.body.replaceChildren());

  it('the month buttons move the visible month', () => {
    const { fixture, cmp, q, open } = setup();
    cmp.writeValue(new Date(2026, 0, 15));
    open();
    q<HTMLButtonElement>('[aria-label="Mes siguiente"]')!.click();
    fixture.detectChanges();
    expect(q('.ngx-datepicker__header-text')!.textContent!.trim()).toBe('Febrero 2026');
    q<HTMLButtonElement>('[aria-label="Mes anterior"]')!.click();
    q<HTMLButtonElement>('[aria-label="Mes anterior"]')!.click();
    expect(cmp.headerText()).toBe('Diciembre 2025');
  });

  it('the clear button empties the value without opening the panel', () => {
    const { fixture, cmp, q, changed } = setup();
    cmp.writeValue(new Date(2026, 0, 15));
    fixture.detectChanges();
    q<HTMLButtonElement>('.ngx-datepicker__clear')!.click();
    fixture.detectChanges();
    expect(cmp.value()).toBeNull();
    expect(changed).toHaveBeenCalledWith(null);
    expect(cmp.isOpen()).toBe(false);
    expect(q('.ngx-datepicker__clear')).toBeNull();
  });

  it('the Today button selects today and closes', () => {
    const { cmp, q, open, changed } = setup();
    open();
    q<HTMLButtonElement>('.ngx-datepicker__today-btn')!.click();
    expect(cmp.value()?.getTime()).toBe(todayStart().getTime());
    expect(changed).toHaveBeenCalledOnce();
    expect(cmp.isOpen()).toBe(false);
  });

  it('the Today button does nothing when today is out of range', () => {
    const t = todayStart();
    const tomorrow = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1);
    const { cmp, q, open, changed } = setup({ minDate: tomorrow });
    open();
    q<HTMLButtonElement>('.ngx-datepicker__today-btn')!.click();
    expect(cmp.value()).toBeNull();
    expect(changed).not.toHaveBeenCalled();
    expect(cmp.isOpen()).toBe(true);
  });

  it('the Today button does nothing when today is on a disabled weekday', () => {
    const { cmp, q, open } = setup({ disabledDaysOfWeek: [todayStart().getDay()] });
    open();
    q<HTMLButtonElement>('.ngx-datepicker__today-btn')!.click();
    expect(cmp.value()).toBeNull();
  });

  it('the Today button does nothing when today is in disabledDates', () => {
    const { cmp, q, open } = setup({ disabledDates: [new Date()] });
    open();
    expect(q('[role="gridcell"][aria-current="date"]')!.getAttribute('aria-disabled')).toBe('true');
    q<HTMLButtonElement>('.ngx-datepicker__today-btn')!.click();
    expect(cmp.value()).toBeNull();
  });

  it('the Today button follows the labels and can be hidden', () => {
    TestBed.configureTestingModule({ providers: [provideNgxDsLabels(NGX_DS_LABELS_EN)] });
    const { fixture, q, open } = setup();
    open();
    expect(q('.ngx-datepicker__today-btn')!.textContent!.trim()).toBe('Today');
    fixture.componentRef.setInput('showToday', false);
    fixture.detectChanges();
    expect(q('.ngx-datepicker__today-btn')).toBeNull();
  });

  it('disabledDates and firstDayOfWeek shape the grid', () => {
    const { el, cmp, open } = setup({
      disabledDates: [new Date(2026, 0, 20, 15, 30)],
      firstDayOfWeek: 0,
    });
    cmp.writeValue(new Date(2026, 0, 15));
    open();
    const day20 = el.querySelector(`[aria-label="${label(new Date(2026, 0, 20))}"]`)!;
    expect(day20.getAttribute('aria-disabled')).toBe('true');
    // 1 Jan 2026 is a Thursday: with Sunday first it sits in the 5th column.
    const firstRow = el.querySelectorAll('[role="row"]')[0].querySelectorAll('[role="gridcell"]');
    expect(firstRow[4].getAttribute('aria-label')).toBe(label(new Date(2026, 0, 1)));
  });

  it('Escape closes the panel and returns focus to the trigger', async () => {
    const { fixture, cmp, q, open } = setup();
    open();
    await fixture.whenStable();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(cmp.isOpen()).toBe(false);
    expect(document.activeElement).toBe(q('[role="button"]'));
  });

  it('opens with Enter but ignores keys from nested elements and other keys', () => {
    const { cmp, q } = setup({ placeholder: 'Elige' });
    q('.ngx-datepicker__placeholder')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    expect(cmp.isOpen()).toBe(false);
    const trigger = q('[role="button"]')!;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    expect(cmp.isOpen()).toBe(false);
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(cmp.isOpen()).toBe(true);
  });

  it('a disabled control does not open, clear or select', () => {
    const { fixture, cmp, q } = setup();
    cmp.writeValue(new Date(2026, 0, 15));
    cmp.setDisabledState(true);
    fixture.detectChanges();
    expect(q('[role="button"]')!.getAttribute('tabindex')).toBe('-1');
    expect(q('.ngx-datepicker__clear')).toBeNull();
    cmp.togglePanel();
    cmp.clearValue(new Event('click'));
    expect(cmp.isOpen()).toBe(false);
    expect(cmp.value()?.getDate()).toBe(15);
  });

  it('shows the error over the hint and links it with aria-describedby', () => {
    const { fixture, q } = setup({ hint: 'Formato DD/MM', label: 'Fecha', floatingLabel: true });
    expect(q('.ngx-datepicker__message--hint')!.textContent!.trim()).toBe('Formato DD/MM');
    fixture.componentRef.setInput('errorMessage', 'Obligatoria');
    fixture.detectChanges();
    const error = q('.ngx-datepicker__message--error')!;
    expect(error.textContent!.trim()).toBe('Obligatoria');
    expect(q('.ngx-datepicker__message--hint')).toBeNull();
    const trigger = q('[role="button"]')!;
    expect(trigger.getAttribute('aria-describedby')).toBe(error.id);
    expect(trigger.className).toContain('ngx-datepicker__field--error');
    expect(q('.ngx-datepicker__float-label')!.className).toContain(
      'ngx-datepicker__float-label--error',
    );
  });

  it('writeValue(null) clears the value', () => {
    const { cmp } = setup();
    cmp.writeValue(new Date(2026, 0, 15));
    cmp.writeValue(null);
    expect(cmp.value()).toBeNull();
  });

  it('clearing moves focus to the trigger and marks the control touched', () => {
    const { fixture, cmp, q } = setup();
    const touched = vi.fn();
    cmp.registerOnTouched(touched);
    cmp.writeValue(new Date(2026, 0, 15));
    fixture.detectChanges();
    const clear = q<HTMLButtonElement>('.ngx-datepicker__clear')!;
    clear.focus();
    clear.click();
    fixture.detectChanges();
    expect(document.activeElement).toBe(q('[role="button"]'));
    expect(touched).toHaveBeenCalledTimes(1);
  });
});
