import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent, MultiSelectOption } from './multi-select.component';

const OPTIONS: MultiSelectOption[] = [
  { label: 'Rojo', value: 'red' },
  { label: 'Verde', value: 'green' },
  { label: 'Azul', value: 'blue' },
];

describe('MultiSelectComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(MultiSelectComponent);
    fixture.componentRef.setInput('options', OPTIONS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const trigger = el.querySelector<HTMLElement>('[role="combobox"]')!;
    const options = () => Array.from(el.querySelectorAll<HTMLElement>('.ms__option'));
    const open = () => {
      trigger.click();
      fixture.detectChanges();
    };
    return { fixture, cmp: fixture.componentInstance, el, trigger, options, open };
  }

  it('shows the translated placeholder and opens on click', () => {
    const { el, trigger, open } = setup();
    expect(el.querySelector('.ms__placeholder')?.textContent).toContain('Seleccionar...');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    open();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('[role="listbox"]')).not.toBeNull();
  });

  it('toggles options and renders chips', () => {
    const { fixture, cmp, el, options, open } = setup();
    open();
    options()[0].click();
    options()[2].click();
    fixture.detectChanges();
    expect(cmp.value()).toEqual(['red', 'blue']);
    expect(options()[0].getAttribute('aria-selected')).toBe('true');
    expect(el.querySelectorAll('.ms__chip').length).toBe(2);
    options()[0].click();
    expect(cmp.value()).toEqual(['blue']);
  });

  it('removes a chip without opening the panel', () => {
    const { fixture, cmp, el, trigger } = setup({ value: ['red', 'green'] });
    el.querySelector<HTMLButtonElement>('.ms__chip-remove')!.click();
    fixture.detectChanges();
    expect(cmp.value()).toEqual(['green']);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('stops selecting at maxSelected', () => {
    const { cmp, options, open } = setup({ maxSelected: 1 });
    open();
    options()[0].click();
    options()[1].click();
    expect(cmp.value()).toEqual(['red']);
  });

  it('filters options and shows the empty state', () => {
    const { fixture, el, options, open } = setup();
    open();
    const search = el.querySelector<HTMLInputElement>('.ms__search')!;
    search.value = 'ver';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(options().map((o) => o.textContent?.trim())).toEqual(['Verde']);
    search.value = 'zzz';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(el.querySelector('.ms__empty')?.textContent).toContain('Sin resultados');
  });

  it('opens with ArrowDown and closes with Escape', () => {
    const { fixture, trigger } = setup();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes when clicking outside', () => {
    const { fixture, trigger, open } = setup();
    open();
    document.body.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  describe('with reactive forms', () => {
    @Component({
      standalone: true,
      imports: [MultiSelectComponent, ReactiveFormsModule],
      template: `<ngx-ds-multi-select [options]="options" [formControl]="ctrl" />`,
    })
    class Host {
      options = OPTIONS;
      ctrl = new FormControl<(string | number)[] | null>(['green']);
    }

    it('syncs value, touched and disabled state', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const ctrl = fixture.componentInstance.ctrl;
      const el = fixture.nativeElement as HTMLElement;
      const trigger = el.querySelector<HTMLElement>('[role="combobox"]')!;
      expect(el.querySelector('.ms__chip')?.textContent).toContain('Verde');

      trigger.click();
      fixture.detectChanges();
      el.querySelectorAll<HTMLElement>('.ms__option')[0].click();
      expect(ctrl.value).toEqual(['green', 'red']);
      expect(ctrl.touched).toBe(true);

      trigger.click();
      ctrl.disable();
      fixture.detectChanges();
      trigger.click();
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
