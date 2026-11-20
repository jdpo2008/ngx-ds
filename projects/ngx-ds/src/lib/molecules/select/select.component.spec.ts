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

  describe('rendering', () => {
    function render(inputs: Record<string, unknown> = {}) {
      const ctx = setup(inputs);
      const el = ctx.fixture.nativeElement as HTMLElement;
      const trigger = el.querySelector<HTMLElement>('[role="combobox"]')!;
      const q = (sel: string) => el.querySelector<HTMLElement>(sel);
      const qa = (sel: string) => Array.from(el.querySelectorAll<HTMLElement>(sel));
      return { ...ctx, el, trigger, q, qa };
    }

    it('shows the default or a custom placeholder', () => {
      const { fixture, q } = render();
      expect(q('.ngx-select__placeholder')!.textContent!.trim()).toBe('Seleccionar...');
      fixture.componentRef.setInput('placeholder', 'Elige país');
      fixture.detectChanges();
      expect(q('.ngx-select__placeholder')!.textContent!.trim()).toBe('Elige país');
    });

    it('renders a static label tied to the trigger, or a floating one', () => {
      const { fixture, q, trigger } = render({ label: 'País' });
      const label = q('label.ngx-select__label')!;
      expect(label.textContent!.trim()).toBe('País');
      expect(label.getAttribute('for')).toBe(trigger.id);
      expect(trigger.getAttribute('aria-label')).toBe('País');

      fixture.componentRef.setInput('floatingLabel', true);
      fixture.detectChanges();
      expect(q('label.ngx-select__label')).toBeNull();
      const float = q('.ngx-select__float-label')!;
      expect(float.className).not.toContain('--active');
      fixture.componentInstance.writeValue('es');
      fixture.detectChanges();
      expect(float.className).toContain('ngx-select__float-label--active');
    });

    it('links the hint and the error message to the trigger', () => {
      const { fixture, q, trigger } = render({ hint: 'Obligatorio' });
      expect(q('.ngx-select__message--hint')!.textContent!.trim()).toBe('Obligatorio');
      expect(trigger.getAttribute('aria-describedby')).toBe(q('.ngx-select__message')!.id);
      expect(trigger.hasAttribute('aria-invalid')).toBe(false);

      fixture.componentRef.setInput('errors', [{ kind: 'required', message: 'Falta' }]);
      fixture.detectChanges();
      expect(q('.ngx-select__message--error')).toBeNull(); // not touched yet
      fixture.componentRef.setInput('touched', true);
      fixture.detectChanges();
      const error = q('.ngx-select__message--error')!;
      expect(error.textContent!.trim()).toBe('Falta');
      expect(error.getAttribute('role')).toBe('alert');
      expect(q('.ngx-select__message--hint')).toBeNull();
      expect(trigger.getAttribute('aria-invalid')).toBe('true');
      expect(trigger.className).toContain('--error');
    });

    it('opens on click, marks the selected option and selects on click', () => {
      const { fixture, cmp, trigger, q, qa } = render();
      cmp.writeValue('fr');
      trigger.click();
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(q('[role="listbox"]')!.id).toBe(trigger.getAttribute('aria-controls'));
      const options = qa('[role="option"]');
      expect(options.map((o) => o.getAttribute('aria-selected'))).toEqual([
        'false',
        'true',
        'false',
      ]);
      expect(options[2].getAttribute('aria-disabled')).toBe('true');
      expect(options[1].querySelector('.ngx-select__check ngx-ds-icon')).not.toBeNull();
      options[0].click();
      fixture.detectChanges();
      expect(cmp.value()).toBe('es');
      expect(q('[role="listbox"]')).toBeNull();
      expect(q('.ngx-select__value')!.textContent!.trim()).toBe('España');
    });

    it('clears a single value from the clear button without opening', () => {
      const { fixture, cmp, changes, q } = render();
      cmp.writeValue('es');
      fixture.detectChanges();
      q('.ngx-select__clear')!.click();
      fixture.detectChanges();
      expect(cmp.value()).toBeNull();
      expect(changes).toEqual([null]);
      expect(cmp.isOpen()).toBe(false);
      expect(q('.ngx-select__clear')).toBeNull();
    });

    it('shows chips in multiple mode and removes them one by one', () => {
      const { fixture, cmp, changes, q, qa } = render({ multiple: true });
      cmp.writeValue(['es', 'fr']);
      fixture.detectChanges();
      const tags = () => qa('.ngx-select__tag');
      expect(tags().map((t) => t.textContent!.trim())).toEqual(['España', 'Francia']);
      expect(q('.ngx-select__tag-remove')!.getAttribute('aria-label')).toBe('Quitar España');
      expect(q('.ngx-select__clear')).toBeNull();

      q('.ngx-select__tag-remove')!.click();
      fixture.detectChanges();
      expect(cmp.value()).toEqual(['fr']);
      expect(cmp.isOpen()).toBe(false);
      q('.ngx-select__tag-remove')!.click();
      fixture.detectChanges();
      expect(cmp.value()).toBeNull();
      expect(changes).toEqual([['fr'], null]);
      expect(q('.ngx-select__placeholder')).not.toBeNull();
    });

    it('summarises more than two values in one tag that clears them all', () => {
      const options = [...OPTIONS.slice(0, 2), { value: 'pt', label: 'Portugal' }];
      const { fixture, cmp, changes, qa } = render({ multiple: true, options });
      cmp.writeValue(['es', 'fr', 'pt']);
      fixture.detectChanges();
      const tags = qa('.ngx-select__tag');
      expect(tags.length).toBe(1);
      expect(tags[0].textContent).toContain('3');
      const clear = tags[0].querySelector<HTMLButtonElement>('.ngx-select__tag-remove')!;
      expect(clear.getAttribute('aria-label')).toBe('Limpiar selección');
      clear.click();
      expect(cmp.value()).toBeNull();
      expect(changes).toEqual([null]);
    });

    it('hides the remove buttons when disabled', () => {
      const { fixture, cmp, q, qa } = render({ multiple: true, disabled: true });
      cmp.writeValue(['es']);
      fixture.detectChanges();
      expect(qa('.ngx-select__tag').length).toBe(1);
      expect(q('.ngx-select__tag-remove')).toBeNull();
      expect(q('[role="combobox"]')!.getAttribute('tabindex')).toBe('-1');
      cmp.removeTag('es', new Event('click'));
      cmp.clearAll(new Event('click'));
      expect(cmp.value()).toEqual(['es']);
    });

    it('offers select all only in multiple mode without search text', () => {
      const { fixture, cmp, changes, q } = render({ multiple: true, searchable: true });
      cmp.togglePanel();
      fixture.detectChanges();
      q('.ngx-select__select-all')!.click();
      fixture.detectChanges();
      expect(changes).toEqual([['es', 'fr']]);
      expect(cmp.isOpen()).toBe(true);
      expect(q('.ngx-select__checkbox--checked')).not.toBeNull();

      const search = q('.ngx-select__search-input') as HTMLInputElement;
      search.value = 'fr';
      search.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(q('.ngx-select__select-all')).toBeNull();
    });

    it('shows the no results message when the search matches nothing', () => {
      const { fixture, cmp, q, qa } = render({ searchable: true });
      cmp.togglePanel();
      fixture.detectChanges();
      const search = q('.ngx-select__search-input') as HTMLInputElement;
      search.value = 'zzz';
      search.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(qa('[role="option"]').length).toBe(0);
      expect(q('.ngx-select__empty')!.textContent!.trim()).toBe('Sin resultados');
    });

    it('moves focus from the search box to the first option with ArrowDown', () => {
      const { fixture, cmp, el, q, qa } = render({ searchable: true });
      document.body.appendChild(el);
      cmp.togglePanel();
      fixture.detectChanges();
      const search = q('.ngx-select__search-input')!;
      search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(document.activeElement).not.toBe(qa('[role="option"]')[0]);
      search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(document.activeElement).toBe(qa('[role="option"]')[0]);
      search.click(); // clicks inside the search box don't toggle the panel
      expect(cmp.isOpen()).toBe(true);
      fixture.destroy();
    });

    it('ignores keys coming from nested buttons in the trigger', () => {
      const { fixture, cmp, q } = render();
      cmp.writeValue('es');
      fixture.detectChanges();
      q('.ngx-select__clear')!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
      expect(cmp.isOpen()).toBe(false);
    });

    it('closes on an outside click, clearing the search and marking touched', () => {
      const { fixture, cmp } = render({ searchable: true });
      const touched = vi.fn();
      cmp.registerOnTouched(touched);
      cmp.togglePanel();
      cmp.onSearchChange('fr');
      fixture.detectChanges();
      document.body.click();
      expect(cmp.isOpen()).toBe(false);
      expect(cmp.searchText()).toBe('');
      expect(touched).toHaveBeenCalled();
    });
  });
});
