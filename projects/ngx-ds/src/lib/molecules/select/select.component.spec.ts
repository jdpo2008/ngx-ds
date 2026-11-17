import { TestBed } from '@angular/core/testing';
import { SelectComponent, SelectOption } from './select.component';

const OPTIONS: SelectOption[] = [
  { value: 'es', label: 'España' },
  { value: 'fr', label: 'Francia' },
  { value: 'it', label: 'Italia', disabled: true },
];

describe('SelectComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SelectComponent);
    fixture.componentRef.setInput('options', OPTIONS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const changes: unknown[] = [];
    cmp.registerOnChange((v) => changes.push(v));
    return { fixture, cmp, changes };
  }

  it('selects a single value, closes and notifies the form', () => {
    const { cmp, changes } = setup();
    cmp.togglePanel();
    cmp.selectOption(OPTIONS[1]);
    expect(cmp.value()).toBe('fr');
    expect(cmp.displayText()).toBe('Francia');
    expect(cmp.isOpen()).toBe(false);
    expect(changes).toEqual(['fr']);
  });

  it('ignores disabled options and a disabled control', () => {
    const { cmp } = setup();
    cmp.selectOption(OPTIONS[2]);
    expect(cmp.value()).toBeNull();
    cmp.setDisabledState(true);
    cmp.togglePanel();
    expect(cmp.isOpen()).toBe(false);
  });

  it('toggles values in multiple mode and summarises the label', () => {
    const { cmp } = setup({ multiple: true });
    cmp.selectOption(OPTIONS[0]);
    cmp.selectOption(OPTIONS[1]);
    expect(cmp.value()).toEqual(['es', 'fr']);
    expect(cmp.displayText()).toBe('España, Francia');
    cmp.selectOption(OPTIONS[0]);
    expect(cmp.value()).toEqual(['fr']);
    cmp.selectAll();
    expect(cmp.value()).toEqual(['es', 'fr']);
  });

  it('filters options by search text', () => {
    const { cmp } = setup({ searchable: true });
    cmp.onSearchChange('fra');
    expect(cmp.filteredOptions().map((o) => o.value)).toEqual(['fr']);
  });

  it('writeValue updates the displayed value', () => {
    const { cmp } = setup();
    cmp.writeValue('es');
    expect(cmp.displayText()).toBe('España');
  });

  it('opens from the keyboard and closes with Escape', () => {
    const { fixture, cmp } = setup();
    const trigger = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(cmp.isOpen()).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(cmp.isOpen()).toBe(false);
  });

  it('ArrowDown opens the panel and arrows move focus over enabled options', async () => {
    const { fixture, cmp } = setup();
    document.body.appendChild(fixture.nativeElement);
    const trigger = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(cmp.isOpen()).toBe(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const options = Array.from(
      fixture.nativeElement.querySelectorAll('[role="option"]'),
    ) as HTMLElement[];
    expect(options.every((o) => o.tabIndex === -1)).toBe(true);
    expect(document.activeElement).toBe(options[0]);

    const press = (key: string) =>
      (document.activeElement as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true }),
      );
    press('ArrowDown');
    expect(document.activeElement).toBe(options[1]);
    press('ArrowDown'); // options[2] is disabled → wraps to the first
    expect(document.activeElement).toBe(options[0]);
    press('ArrowUp');
    expect(document.activeElement).toBe(options[1]);
    press('Home');
    expect(document.activeElement).toBe(options[0]);
    press('End');
    expect(document.activeElement).toBe(options[1]);
    fixture.destroy();
  });

  it('selects an option with Enter', () => {
    const { fixture, cmp } = setup();
    cmp.togglePanel();
    fixture.detectChanges();
    const option = fixture.nativeElement.querySelectorAll('[role="option"]')[0] as HTMLElement;
    option.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(cmp.value()).toBe('es');
  });
});
