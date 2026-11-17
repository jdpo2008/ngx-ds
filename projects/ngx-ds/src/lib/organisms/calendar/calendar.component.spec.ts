import { TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';

const label = (d: Date) =>
  d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

describe('CalendarComponent keyboard navigation', () => {
  async function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(CalendarComponent);
    fixture.componentRef.setInput('value', new Date(2026, 0, 15)); // Thursday 15 Jan 2026
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    const cmp = fixture.componentInstance;
    const selected: Date[] = [];
    cmp.dateSelect.subscribe((d) => selected.push(d));
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    const el = fixture.nativeElement as HTMLElement;

    const tabbable = () => el.querySelectorAll<HTMLElement>('[role="gridcell"][tabindex="0"]');
    tabbable()[0]?.focus();

    const press = async (key: string, shiftKey = false) => {
      (document.activeElement as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }),
      );
      fixture.detectChanges();
      await fixture.whenStable();
    };
    const focusedLabel = () => (document.activeElement as HTMLElement).getAttribute('aria-label');
    return { fixture, cmp, el, tabbable, press, focusedLabel, selected };
  }

  afterEach(() => document.body.replaceChildren());

  it('renders a labelled grid of 6 rows with a single tabbable day', async () => {
    const { cmp, el, tabbable } = await setup();
    const grid = el.querySelector('[role="grid"]');
    expect(grid?.getAttribute('aria-label')).toBe('Enero 2026');
    expect(cmp.title()).toBe('Enero 2026');
    expect(el.querySelectorAll('[role="row"]').length).toBe(6);
    expect(tabbable().length).toBe(1);
    expect(tabbable()[0].getAttribute('aria-label')).toBe(label(new Date(2026, 0, 15)));
    expect(tabbable()[0].getAttribute('aria-selected')).toBe('true');
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
    expect(cmp.title()).toBe('Febrero 2026');
    expect(focusedLabel()).toBe(label(new Date(2026, 1, 15)));
    await press('PageUp', true);
    expect(cmp.title()).toBe('Febrero 2025');
    await press('PageDown', true);
    await press('PageUp');
    await press('Home'); // Monday 12 Jan
    await press('ArrowUp');
    await press('ArrowUp'); // Monday 29 Dec 2025
    expect(cmp.title()).toBe('Diciembre 2025');
    expect(focusedLabel()).toBe(label(new Date(2025, 11, 29)));
  });

  it('the month buttons move the view and keep one tabbable day', async () => {
    const { fixture, cmp, tabbable } = await setup();
    cmp.nextMonth();
    fixture.detectChanges();
    expect(cmp.title()).toBe('Febrero 2026');
    expect(tabbable().length).toBe(1);
    expect(tabbable()[0].getAttribute('aria-label')).toBe(label(new Date(2026, 1, 15)));
  });

  it('activating a focused day selects it and emits dateSelect', async () => {
    const { fixture, cmp, press, selected } = await setup();
    await press('ArrowRight');
    (document.activeElement as HTMLElement).click();
    fixture.detectChanges();
    expect(cmp.value()?.getDate()).toBe(16);
    expect(selected.map((d) => d.getDate())).toEqual([16]);
    expect(document.activeElement?.getAttribute('aria-selected')).toBe('true');
  });

  it('disabled days stay reachable by keyboard but cannot be selected', async () => {
    const { cmp, press, focusedLabel, selected } = await setup({
      maxDate: new Date(2026, 0, 15),
    });
    await press('ArrowRight');
    const day16 = document.activeElement as HTMLElement;
    expect(focusedLabel()).toBe(label(new Date(2026, 0, 16)));
    expect(day16.getAttribute('aria-disabled')).toBe('true');
    day16.click();
    expect(cmp.value()?.getDate()).toBe(15);
    expect(selected).toEqual([]);
  });

  it('a disabled calendar has no tabbable day', async () => {
    const { tabbable } = await setup({ disabled: true });
    expect(tabbable().length).toBe(0);
  });
});
