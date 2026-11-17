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
