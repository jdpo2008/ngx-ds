import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NGX_DS_LABELS_EN, provideNgxDsLabels } from '../../shared/labels';
import { DropdownComponent, DropdownOption } from './dropdown.component';

const OPTIONS: DropdownOption[] = [
  { value: 'es', label: 'España' },
  { value: 'fr', label: 'Francia', disabled: true },
  { value: 'pt', label: 'Portugal' },
];

describe('DropdownComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(DropdownComponent);
    fixture.componentRef.setInput('options', OPTIONS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const trigger = el.querySelector<HTMLElement>('[role="combobox"]')!;
    const open = () => {
      trigger.click();
      fixture.detectChanges();
    };
    const options = () => Array.from(el.querySelectorAll<HTMLElement>('[role="option"]'));
    return { fixture, cmp: fixture.componentInstance, el, trigger, open, options };
  }

  it('shows the translated placeholder and a closed combobox', () => {
    const { el, trigger } = setup({ label: 'País' });
    expect(el.querySelector('label')?.textContent).toBe('País');
    expect(el.querySelector('.ngx-dropdown__placeholder')?.textContent).toBe('Seleccionar...');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('tabindex')).toBe('0');
    expect(el.querySelector('[role="listbox"]')).toBeNull();
  });

  it('opens the panel and selects an option', () => {
    const { fixture, cmp, el, trigger, open, options } = setup();
    open();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.classList).toContain('ngx-dropdown__trigger--open');
    expect(options().map((o) => o.textContent?.trim())).toEqual(['España', 'Francia', 'Portugal']);
    expect(options()[1].getAttribute('aria-disabled')).toBe('true');

    options()[2].click();
    fixture.detectChanges();
    expect(cmp.value()).toBe('pt');
    expect(el.querySelector('.ngx-dropdown__value')?.textContent).toBe('Portugal');
    expect(el.querySelector('[role="listbox"]')).toBeNull();
  });

  it('ignores disabled options', () => {
    const { fixture, cmp, open, options } = setup();
    open();
    options()[1].click();
    fixture.detectChanges();
    expect(cmp.value()).toBeNull();
    expect(options().length).toBe(3);
  });

  it('marks the selected option and clears the value', () => {
    const { fixture, cmp, el, open, options } = setup({ value: 'es' });
    open();
    expect(options()[0].getAttribute('aria-selected')).toBe('true');
    expect(options()[0].classList).toContain('ngx-dropdown__option--selected');

    const clear = el.querySelector<HTMLButtonElement>('.ngx-dropdown__clear')!;
    expect(clear.getAttribute('aria-label')).toBe('Limpiar selección');
    clear.click();
    fixture.detectChanges();
    expect(cmp.value()).toBeNull();
    expect(el.querySelector('.ngx-dropdown__clear')).toBeNull();
  });

  it('shows the empty message without options', () => {
    const { open, el } = setup({ options: [] });
    open();
    expect(el.querySelector('.ngx-dropdown__empty')?.textContent).toBe('Sin opciones');
  });

  it('opens with the keyboard and closes on Escape', () => {
    const { fixture, trigger } = setup();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders the error message instead of the hint', () => {
    const { el, trigger } = setup({ hint: 'Ayuda', errorMessage: 'Obligatorio' });
    expect(el.querySelector('[role="alert"]')?.textContent?.trim()).toBe('Obligatorio');
    expect(el.querySelector('.ngx-dropdown__message--hint')).toBeNull();
    expect(trigger.classList).toContain('ngx-dropdown__trigger--error');
  });

  it('uses English labels when provided', () => {
    TestBed.configureTestingModule({ providers: [provideNgxDsLabels(NGX_DS_LABELS_EN)] });
    const { el } = setup();
    expect(el.querySelector('.ngx-dropdown__placeholder')?.textContent).toBe('Select...');
  });

  describe('with reactive forms', () => {
    @Component({
      standalone: true,
      imports: [DropdownComponent, ReactiveFormsModule],
      template: `<ngx-ds-dropdown [options]="options" [formControl]="ctrl" />`,
    })
    class Host {
      options = OPTIONS;
      ctrl = new FormControl<string | null>('pt');
    }

    it('writes, propagates and disables through the form control', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      const ctrl = fixture.componentInstance.ctrl;
      expect(el.querySelector('.ngx-dropdown__value')?.textContent).toBe('Portugal');

      el.querySelector<HTMLElement>('[role="combobox"]')!.click();
      fixture.detectChanges();
      el.querySelectorAll<HTMLElement>('[role="option"]')[0].click();
      expect(ctrl.value).toBe('es');

      ctrl.disable();
      fixture.detectChanges();
      const trigger = el.querySelector<HTMLElement>('[role="combobox"]')!;
      expect(trigger.getAttribute('aria-disabled')).toBe('true');
      expect(trigger.getAttribute('tabindex')).toBe('-1');
      expect(el.querySelector('.ngx-dropdown__clear')).toBeNull();
      trigger.click();
      fixture.detectChanges();
      expect(el.querySelector('[role="listbox"]')).toBeNull();
    });
  });
});
