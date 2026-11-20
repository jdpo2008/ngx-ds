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

  it('toggles closed when the trigger is clicked again', () => {
    const { trigger, open } = setup();
    open();
    open();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('shows the raw value when no option matches', () => {
    const { el } = setup({ value: 42 });
    expect(el.querySelector('.ngx-dropdown__value')?.textContent).toBe('42');
  });

  it('uses a custom placeholder', () => {
    const { el } = setup({ placeholder: 'Elige' });
    expect(el.querySelector('.ngx-dropdown__placeholder')?.textContent).toBe('Elige');
  });

  it('renders the hint and links it with aria-describedby', () => {
    const { cmp, el, trigger } = setup({ hint: 'Ayuda' });
    const hint = el.querySelector('.ngx-dropdown__message--hint')!;
    expect(hint.textContent).toBe('Ayuda');
    expect(hint.id).toBe(cmp.messageId);
    expect(trigger.getAttribute('aria-describedby')).toBe(cmp.messageId);
  });

  it('has no aria-describedby without hint or error', () => {
    const { trigger } = setup();
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
    expect(trigger.getAttribute('aria-invalid')).toBeNull();
  });

  it('applies the size class and icon size', () => {
    const { cmp, trigger } = setup({ size: 'lg' });
    expect(trigger.classList).toContain('ngx-dropdown__trigger--lg');
    expect(cmp.iconSize()).toBe(18);
  });

  describe('floating label', () => {
    it('renders the label inside the trigger instead of a <label>', () => {
      const { el, trigger } = setup({ label: 'País', floatingLabel: true });
      expect(el.querySelector('label')).toBeNull();
      const float = trigger.querySelector('.ngx-dropdown__float-label')!;
      expect(float.textContent).toBe('País');
      expect(float.classList).not.toContain('ngx-dropdown__float-label--active');
    });

    it('floats while open and when it has a value', () => {
      const { fixture, trigger, open } = setup({ label: 'País', floatingLabel: true });
      const float = () => trigger.querySelector('.ngx-dropdown__float-label')!.classList;
      open();
      expect(float()).toContain('ngx-dropdown__float-label--active');
      expect(float()).toContain('ngx-dropdown__float-label--focused');
      open();
      expect(float()).not.toContain('ngx-dropdown__float-label--active');

      fixture.componentRef.setInput('value', 'es');
      fixture.detectChanges();
      expect(float()).toContain('ngx-dropdown__float-label--active');
    });

    it('turns red with an error', () => {
      const { trigger } = setup({ label: 'País', floatingLabel: true, errorMessage: 'Mal' });
      expect(trigger.querySelector('.ngx-dropdown__float-label')!.classList).toContain(
        'ngx-dropdown__float-label--error',
      );
    });
  });

  describe('Signal Forms errors', () => {
    const errors = [{ kind: 'required', message: 'Campo obligatorio' }];

    it('hides errors until touched', () => {
      const { el, trigger } = setup({ errors });
      expect(el.querySelector('[role="alert"]')).toBeNull();
      expect(trigger.getAttribute('aria-invalid')).toBeNull();
    });

    it('shows the first error once touched', () => {
      const { el, trigger } = setup({ errors, touched: true });
      expect(el.querySelector('[role="alert"]')?.textContent?.trim()).toBe('Campo obligatorio');
      expect(trigger.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('keyboard', () => {
    const key = (target: HTMLElement, k: string) =>
      target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

    it('opens with Space', () => {
      const { fixture, trigger } = setup();
      key(trigger, ' ');
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('opens with ArrowDown and focuses the first enabled option', async () => {
      const { fixture, trigger, options } = setup();
      trigger.focus();
      key(trigger, 'ArrowDown');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(document.activeElement).toBe(options()[0]);
    });

    it('keeps the panel open on ArrowDown when already open', async () => {
      const { fixture, trigger, open } = setup();
      open();
      key(trigger, 'ArrowDown');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('ignores other keys', () => {
      const { fixture, trigger } = setup();
      key(trigger, 'a');
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('ignores keys coming from the clear button', () => {
      const { fixture, el, trigger } = setup({ value: 'es' });
      key(el.querySelector<HTMLElement>('.ngx-dropdown__clear')!, 'Enter');
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('moves between options skipping disabled ones', () => {
      const { fixture, trigger, open, options } = setup();
      document.body.appendChild(fixture.nativeElement);
      open();
      options()[0].focus();
      key(options()[0], 'ArrowDown');
      expect(document.activeElement).toBe(options()[2]);
      expect(trigger).toBeTruthy();
      fixture.nativeElement.remove();
    });

    it('selects with Enter and returns focus to the trigger', () => {
      const { fixture, cmp, trigger, open, options } = setup();
      document.body.appendChild(fixture.nativeElement);
      open();
      options()[2].focus();
      key(options()[2], 'Enter');
      fixture.detectChanges();
      expect(cmp.value()).toBe('pt');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(trigger);
      fixture.nativeElement.remove();
    });

    it('does nothing on Enter over a disabled option', () => {
      const { fixture, cmp, trigger, open, options } = setup();
      open();
      key(options()[1], 'Enter');
      fixture.detectChanges();
      expect(cmp.value()).toBeNull();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('ignores other keys on an option', () => {
      const { fixture, cmp, open, options } = setup();
      open();
      key(options()[0], 'x');
      fixture.detectChanges();
      expect(cmp.value()).toBeNull();
    });

    it('returns focus to the trigger on Escape', () => {
      const { fixture, trigger, open, options } = setup();
      document.body.appendChild(fixture.nativeElement);
      open();
      options()[0].focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();
      expect(document.activeElement).toBe(trigger);
      fixture.nativeElement.remove();
    });

    it('leaves focus alone on Escape when closed', () => {
      const { fixture, trigger } = setup();
      const other = document.createElement('button');
      document.body.appendChild(other);
      other.focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();
      expect(document.activeElement).toBe(other);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      other.remove();
    });
  });

  describe('disabled input', () => {
    it('cannot be opened, selected or cleared', () => {
      const { fixture, cmp, el, trigger } = setup({ disabled: true, value: 'es' });
      expect(trigger.classList).toContain('ngx-dropdown__trigger--disabled');
      expect(el.querySelector('.ngx-dropdown__clear')).toBeNull();
      trigger.click();
      fixture.detectChanges();
      expect(el.querySelector('[role="listbox"]')).toBeNull();

      cmp.selectOption(OPTIONS[2]);
      cmp.clearValue(new Event('click'));
      expect(cmp.value()).toBe('es');
    });
  });

  describe('click outside', () => {
    it('closes the panel', () => {
      const { fixture, trigger, open } = setup();
      open();
      document.body.click();
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('does not close when clicking inside the panel', () => {
      const { fixture, el, trigger, open } = setup();
      open();
      el.querySelector<HTMLElement>('[role="listbox"]')!.click();
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });
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

    it('clearing propagates null to the form control', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      el.querySelector<HTMLElement>('.ngx-dropdown__clear')!.click();
      expect(fixture.componentInstance.ctrl.value).toBeNull();
    });

    it('marks the control as touched when the open panel closes on an outside click', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      const ctrl = fixture.componentInstance.ctrl;
      el.querySelector<HTMLElement>('[role="combobox"]')!.click();
      fixture.detectChanges();
      document.body.click();
      expect(ctrl.touched).toBe(true);
    });

    it('does not mark the control as touched on outside clicks it was never part of', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      document.body.click();
      expect(fixture.componentInstance.ctrl.touched).toBe(false);
    });
  });
});
