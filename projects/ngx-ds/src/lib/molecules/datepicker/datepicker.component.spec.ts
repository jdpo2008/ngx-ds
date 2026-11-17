import { TestBed } from '@angular/core/testing';
import { DatepickerComponent } from './datepicker.component';

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
