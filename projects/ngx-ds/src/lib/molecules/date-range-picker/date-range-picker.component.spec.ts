import { TestBed } from '@angular/core/testing';
import { DateRange, DateRangePickerComponent } from './date-range-picker.component';

const label = (d: Date) =>
  d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

describe('DateRangePickerComponent keyboard navigation', () => {
  async function setup() {
    const fixture = TestBed.createComponent(DateRangePickerComponent);
    const cmp = fixture.componentInstance;
    cmp.writeValue({ start: new Date(2026, 0, 30), end: null }); // Friday 30 Jan 2026
    const changes: DateRange[] = [];
    cmp.registerOnChange((v) => changes.push(v));
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
    const activate = async () => {
      (document.activeElement as HTMLElement).click();
      fixture.detectChanges();
      await fixture.whenStable();
    };
    const focusedLabel = () => (document.activeElement as HTMLElement).getAttribute('aria-label');
    return { fixture, cmp, el, trigger, press, activate, focusedLabel, changes };
  }

  afterEach(() => document.body.replaceChildren());

  it('opens on the start date with two labelled grids and one tabbable day', async () => {
    const { cmp, el, focusedLabel } = await setup();
    expect(focusedLabel()).toBe(label(new Date(2026, 0, 30)));
    expect(cmp.leftTitle()).toBe('Enero 2026');
    const grids = Array.from(el.querySelectorAll('[role="grid"]'));
    expect(grids.map((g) => g.getAttribute('aria-label'))).toEqual(['Enero 2026', 'Febrero 2026']);
    expect(el.querySelectorAll('[role="gridcell"][tabindex="0"]').length).toBe(1);
  });

  it('moves into the right calendar without scrolling, then scrolls past it', async () => {
    const { cmp, el, press, focusedLabel } = await setup();
    await press('ArrowDown'); // 6 Feb, right calendar
    expect(focusedLabel()).toBe(label(new Date(2026, 1, 6)));
    expect(cmp.leftTitle()).toBe('Enero 2026');
    const grids = el.querySelectorAll('[role="grid"]');
    expect(grids[1].contains(document.activeElement)).toBe(true);

    await press('PageDown'); // 6 Mar → view shifts so March is on the right
    expect(focusedLabel()).toBe(label(new Date(2026, 2, 6)));
    expect(cmp.leftTitle()).toBe('Febrero 2026');
    expect(cmp.rightTitle()).toBe('Marzo 2026');

    await press('PageUp', true); // 6 Mar 2025 → before the left month
    expect(cmp.leftTitle()).toBe('Marzo 2025');
  });

  it('selects a range from the keyboard, highlighting it while moving', async () => {
    const { cmp, trigger, press, activate, changes } = await setup();
    await activate(); // start = 30 Jan
    expect(cmp.isOpen()).toBe(true);
    await press('ArrowRight');
    await press('ArrowRight'); // 1 Feb
    expect(cmp.inRange(new Date(2026, 0, 31))).toBe(true);
    await activate();
    expect(cmp.isOpen()).toBe(false);
    expect(changes).toEqual([{ start: new Date(2026, 0, 30), end: new Date(2026, 1, 1) }]);
    expect(document.activeElement).toBe(trigger);
  });

  it('labels the month navigation buttons', async () => {
    const { el } = await setup();
    const labels = Array.from(el.querySelectorAll('.drp__nav-btn[aria-label]')).map((b) =>
      b.getAttribute('aria-label'),
    );
    expect(labels).toEqual(['Mes anterior', 'Mes siguiente']);
  });
});

describe('DateRangePickerComponent mouse and state', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(DateRangePickerComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    const cmp = fixture.componentInstance;
    const changes: DateRange[] = [];
    const touched = vi.fn();
    cmp.registerOnChange((v) => changes.push(v));
    cmp.registerOnTouched(touched);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    const el = fixture.nativeElement as HTMLElement;
    const q = <T extends HTMLElement = HTMLElement>(s: string) => el.querySelector<T>(s);
    const trigger = () => q('[role="button"]')!;
    const day = (d: Date) => q<HTMLButtonElement>(`[aria-label="${label(d)}"]`)!;
    const render = () => fixture.detectChanges();
    return { fixture, cmp, el, q, trigger, day, render, changes, touched };
  }

  afterEach(() => document.body.replaceChildren());

  it('picks a range with the mouse, previewing it on hover', () => {
    const { cmp, q, trigger, day, render, changes, touched } = setup();
    cmp.writeValue({ start: new Date(2026, 0, 10), end: null });
    trigger().click();
    render();
    day(new Date(2026, 0, 12)).click();
    render();
    expect(q('.drp__text')!.textContent!.trim()).toBe('12/01/2026 – ...');
    day(new Date(2026, 0, 15)).dispatchEvent(new MouseEvent('mouseenter'));
    render();
    expect(day(new Date(2026, 0, 14)).classList).toContain('drp__day--in-range');
    q('.drp__panel')!.dispatchEvent(new MouseEvent('mouseleave'));
    render();
    expect(day(new Date(2026, 0, 14)).classList).not.toContain('drp__day--in-range');
    day(new Date(2026, 0, 16)).click();
    render();
    expect(cmp.isOpen()).toBe(false);
    expect(q('.drp__text')!.textContent!.trim()).toBe('12/01/2026 – 16/01/2026');
    expect(changes).toEqual([{ start: new Date(2026, 0, 12), end: new Date(2026, 0, 16) }]);
    expect(touched).toHaveBeenCalledOnce();
  });

  it('swaps the ends when the second day is before the first', () => {
    const { cmp, trigger, day, render } = setup();
    cmp.writeValue({ start: new Date(2026, 0, 20), end: null });
    trigger().click();
    render();
    day(new Date(2026, 0, 20)).click();
    day(new Date(2026, 0, 5)).click();
    expect(cmp.start()).toEqual(new Date(2026, 0, 5));
    expect(cmp.end()).toEqual(new Date(2026, 0, 20));
  });

  it('days outside minDate and maxDate cannot be picked or previewed', () => {
    const { cmp, trigger, day, render } = setup({
      minDate: new Date(2026, 0, 5),
      maxDate: new Date(2026, 0, 25),
    });
    cmp.writeValue({ start: new Date(2026, 0, 10), end: null });
    trigger().click();
    render();
    const early = day(new Date(2026, 0, 4));
    expect(early.getAttribute('aria-disabled')).toBe('true');
    early.click();
    expect(cmp.start()).toEqual(new Date(2026, 0, 10));
    day(new Date(2026, 0, 10)).click();
    day(new Date(2026, 0, 26)).dispatchEvent(new MouseEvent('mouseenter'));
    render();
    expect(day(new Date(2026, 0, 20)).classList).not.toContain('drp__day--in-range');
  });

  it('the month buttons move both calendars, across the year', () => {
    const { cmp, q, trigger, render } = setup();
    cmp.writeValue({ start: new Date(2026, 10, 10), end: null });
    trigger().click();
    render();
    q<HTMLButtonElement>('[aria-label="Mes siguiente"]')!.click();
    render();
    expect(cmp.leftTitle()).toBe('Diciembre 2026');
    expect(cmp.rightTitle()).toBe('Enero 2027');
    q<HTMLButtonElement>('[aria-label="Mes anterior"]')!.click();
    expect(cmp.leftTitle()).toBe('Noviembre 2026');
  });

  it('the clear button empties the range without opening', () => {
    const { cmp, q, render, changes } = setup();
    cmp.writeValue({ start: new Date(2026, 0, 10), end: new Date(2026, 0, 12) });
    render();
    q<HTMLButtonElement>('.drp__clear')!.click();
    render();
    expect(cmp.isOpen()).toBe(false);
    expect(changes).toEqual([{ start: null, end: null }]);
    expect(q('.drp__clear')).toBeNull();
    expect(q('.drp__text')!.classList).toContain('drp__text--placeholder');
  });

  it('closing half-way restores the previous range', () => {
    const { cmp, trigger, day, render, changes } = setup();
    const range = { start: new Date(2026, 0, 10), end: new Date(2026, 0, 12) };
    cmp.writeValue(range);
    trigger().click();
    render();
    day(new Date(2026, 0, 20)).click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(cmp.isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger());
    expect({ start: cmp.start(), end: cmp.end() }).toEqual(range);

    trigger().click();
    render();
    day(new Date(2026, 0, 20)).click();
    document.body.click();
    expect(cmp.isOpen()).toBe(false);
    expect({ start: cmp.start(), end: cmp.end() }).toEqual(range);
    expect(changes).toEqual([]);
  });

  it('an outside click marks touched only when it closes the panel', () => {
    const { trigger, render, touched } = setup();
    document.body.click();
    expect(touched).not.toHaveBeenCalled();
    trigger().click();
    render();
    document.body.click();
    expect(touched).toHaveBeenCalledOnce();
  });

  it('Enter toggles the panel and keys from the clear button are ignored', () => {
    const { cmp, q, trigger, render } = setup();
    cmp.writeValue({ start: new Date(2026, 0, 10), end: null });
    render();
    q('.drp__clear')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(cmp.isOpen()).toBe(false);
    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(cmp.isOpen()).toBe(true);
    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(cmp.isOpen()).toBe(false);
  });

  it('a disabled control does not open and hides the clear button', () => {
    const { cmp, q, trigger, render } = setup();
    cmp.writeValue({ start: new Date(2026, 0, 10), end: new Date(2026, 0, 12) });
    cmp.setDisabledState(true);
    render();
    expect(trigger().getAttribute('tabindex')).toBe('-1');
    expect(trigger().classList).toContain('drp__trigger--disabled');
    expect(q('.drp__clear')).toBeNull();
    trigger().click();
    expect(cmp.isOpen()).toBe(false);
  });

  it('shows the error over the hint and links it with aria-describedby', () => {
    const { fixture, q, trigger, render } = setup({ hint: 'Máx. 30 días', label: 'Periodo' });
    expect(q('.drp__hint')!.textContent!.trim()).toBe('Máx. 30 días');
    expect(q('.drp__label')!.textContent!.trim()).toBe('Periodo');
    fixture.componentRef.setInput('errorMessage', 'Obligatorio');
    render();
    const error = q('.drp__error')!;
    expect(q('.drp__hint')).toBeNull();
    expect(trigger().getAttribute('aria-describedby')).toBe(error.id);
    expect(trigger().getAttribute('aria-invalid')).toBe('true');
    expect(trigger().classList).toContain('drp__trigger--error');
  });

  it('writeValue(null) clears both ends', () => {
    const { cmp } = setup();
    cmp.writeValue({ start: new Date(2026, 0, 10), end: new Date(2026, 0, 12) });
    cmp.writeValue(null);
    expect(cmp.start()).toBeNull();
    expect(cmp.end()).toBeNull();
    expect(cmp.triggerLabel()).toBe('');
  });
});
