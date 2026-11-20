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

describe('MultiSelectComponent behaviour', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(MultiSelectComponent);
    fixture.componentRef.setInput('options', OPTIONS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    const cmp = fixture.componentInstance;
    const changes: (string | number)[][] = [];
    const touched = vi.fn();
    cmp.registerOnChange((v) => changes.push(v));
    cmp.registerOnTouched(touched);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    const el = fixture.nativeElement as HTMLElement;
    const trigger = el.querySelector<HTMLElement>('[role="combobox"]')!;
    const render = () => fixture.detectChanges();
    const options = () => Array.from(el.querySelectorAll<HTMLElement>('.ms__option'));
    const chips = () => Array.from(el.querySelectorAll<HTMLElement>('.ms__chip'));
    const open = () => {
      trigger.click();
      render();
    };
    return { fixture, cmp, el, trigger, render, options, chips, open, changes, touched };
  }

  afterEach(() => document.body.replaceChildren());

  it('chips follow the selection order and remove their own value', () => {
    const { open, options, chips, render, changes, cmp } = setup();
    open();
    options()[2].click();
    options()[0].click();
    render();
    expect(chips().map((c) => c.textContent!.trim())).toEqual(['Azul', 'Rojo']);
    const remove = chips()[0].querySelector<HTMLButtonElement>('.ms__chip-remove')!;
    expect(remove.getAttribute('aria-label')).toContain('Azul');
    remove.click();
    render();
    expect(cmp.value()).toEqual(['red']);
    expect(changes.at(-1)).toEqual(['red']);
  });

  it('a chip whose option is gone shows its raw value', () => {
    const { cmp, chips, render } = setup();
    cmp.writeValue(['purple']);
    render();
    expect(chips()[0].textContent!.trim()).toBe('purple');
  });

  it('a disabled control cannot be focused, opened or changed', () => {
    const { cmp, trigger, chips, render, changes } = setup();
    cmp.writeValue(['red']);
    cmp.setDisabledState(true);
    render();
    expect(trigger.getAttribute('tabindex')).toBe('-1');
    expect(trigger.getAttribute('aria-disabled')).toBe('true');
    expect(chips()[0].querySelector('.ms__chip-remove')).toBeNull();
    trigger.click();
    expect(cmp.isOpen()).toBe(false);
    cmp.toggleOption(OPTIONS[1]);
    cmp.removeChip('red', new MouseEvent('click'));
    expect(cmp.value()).toEqual(['red']);
    expect(changes).toEqual([]);
  });

  it('Escape closes, refocuses the trigger and marks touched only when open', () => {
    const { cmp, trigger, open, touched } = setup();
    const esc = () =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    esc();
    expect(touched).not.toHaveBeenCalled();
    open();
    esc();
    expect(cmp.isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);
    expect(touched).toHaveBeenCalledOnce();
  });

  it('an outside click closes, clears the search and marks touched only when open', () => {
    const { cmp, el, open, render, touched } = setup();
    document.body.click();
    expect(touched).not.toHaveBeenCalled();
    open();
    const search = el.querySelector<HTMLInputElement>('.ms__search')!;
    search.value = 'ro';
    search.dispatchEvent(new Event('input'));
    render();
    document.body.click();
    expect(cmp.isOpen()).toBe(false);
    expect(cmp.search()).toBe('');
    expect(touched).toHaveBeenCalledOnce();
  });

  it('options past maxSelected are aria-disabled and ignored', () => {
    const { cmp, open, options, render } = setup({ maxSelected: 1 });
    open();
    options()[0].click();
    render();
    expect(options()[1].getAttribute('aria-disabled')).toBe('true');
    expect(options()[0].getAttribute('aria-disabled')).toBeNull();
    options()[1].click();
    expect(cmp.value()).toEqual(['red']);
  });

  it('filters by search and shows the empty text', () => {
    const { el, open, options, render } = setup();
    open();
    const search = el.querySelector<HTMLInputElement>('.ms__search')!;
    search.value = 'ver';
    search.dispatchEvent(new Event('input'));
    render();
    expect(options().map((o) => o.textContent!.trim())).toEqual(['Verde']);
    search.value = 'zzz';
    search.dispatchEvent(new Event('input'));
    render();
    expect(el.querySelector('.ms__empty')).not.toBeNull();
  });

  it('ArrowDown in the search box focuses the first option; Enter toggles it', () => {
    const { cmp, el, open, options, render } = setup();
    open();
    const search = el.querySelector<HTMLInputElement>('.ms__search')!;
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    expect(document.activeElement).not.toBe(options()[0]);
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(options()[0]);
    options()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    render();
    expect(cmp.value()).toEqual(['red']);
    expect(cmp.isOpen()).toBe(true);
  });

  it('searchable=false hides the search box', () => {
    const { el, open } = setup({ searchable: false });
    open();
    expect(el.querySelector('.ms__search')).toBeNull();
  });

  it('label, hint and error', () => {
    const { fixture, el, trigger, render } = setup({ label: 'Colores', hint: 'Elige dos' });
    expect(el.querySelector('.ms__label')!.textContent!.trim()).toBe('Colores');
    expect(trigger.getAttribute('aria-label')).toBe('Colores');
    expect(trigger.getAttribute('aria-describedby')).toBe(el.querySelector('.ms__hint')!.id);
    fixture.componentRef.setInput('errorMessage', 'Obligatorio');
    render();
    expect(el.querySelector('.ms__hint')).toBeNull();
    expect(el.querySelector('.ms__error')!.textContent!.trim()).toBe('Obligatorio');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(trigger.className).toContain('ms__trigger--error');
  });

  it('writeValue(null) empties the selection', () => {
    const { cmp, el, render } = setup();
    cmp.writeValue(['red']);
    cmp.writeValue(null);
    render();
    expect(cmp.value()).toEqual([]);
    expect(el.querySelector('.ms__placeholder')).not.toBeNull();
  });
});
