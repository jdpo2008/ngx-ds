import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MaskedInputComponent } from './masked-input.component';
import { applyMask, caretAfter, extractRaw, maskGuide } from './mask';

const PHONE = '(999) 999-9999';

describe('mask helpers', () => {
  it('formats raw input and only writes literals before a character', () => {
    expect(applyMask('5', PHONE).masked).toBe('(5');
    expect(applyMask('555', PHONE).masked).toBe('(555');
    expect(applyMask('5551', PHONE).masked).toBe('(555) 1');
    expect(applyMask('555123456799', PHONE)).toEqual({
      masked: '(555) 123-4567',
      raw: '5551234567',
    });
  });

  it('drops characters that do not fit their slot and upper-cases A', () => {
    expect(applyMask('5x5', '99').raw).toBe('55');
    expect(applyMask('es12', 'AA99').masked).toBe('ES12');
    expect(applyMask('1a', 'a9').raw).toBe('a');
  });

  it('reads pasted text and ignores a literal prefix with digits', () => {
    expect(extractRaw('(555) 123-4567', PHONE)).toBe('5551234567');
    expect(extractRaw('+34 612', '+34 999 999 999')).toBe('612');
  });

  it('does not read literal letters or digits in the text as input', () => {
    const DATE = '99/99/2099';
    expect(extractRaw('01/01/2025', DATE)).toBe('010125');
    expect(applyMask(extractRaw('01/01/2025', DATE), DATE).masked).toBe('01/01/2025');
    expect(extractRaw('12 XY ab', '99 XY **')).toBe('12ab');
    // A literal the text left out is not required: raw values and deleted literals.
    expect(extractRaw('010125', DATE)).toBe('010125');
    expect(extractRaw('(555)1', PHONE)).toBe('5551');
    expect(extractRaw('555-123-4567', PHONE)).toBe('5551234567');
  });

  it('places the caret after the n-th accepted character', () => {
    expect(caretAfter('(555) 1', PHONE, 4)).toBe(7);
    expect(caretAfter('(555) 1', PHONE, 3)).toBe(4);
    expect(caretAfter('(555) 1', PHONE, 0)).toBe(0);
  });

  it('builds a guide placeholder', () => {
    expect(maskGuide('99/99/9999')).toBe('__/__/____');
  });
});

describe('MaskedInputComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(MaskedInputComponent);
    fixture.componentRef.setInput('mask', PHONE);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const native = () => el.querySelector<HTMLInputElement>('input')!;
    const type = (text: string) => {
      native().value = text;
      native().setSelectionRange(text.length, text.length);
      native().dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    return { fixture, cmp: fixture.componentInstance, el, native, type };
  }

  it('formats typing and stores the raw value', () => {
    const { cmp, native, type } = setup();
    type('5551234');
    expect(native().value).toBe('(555) 123-4');
    expect(cmp.value()).toBe('5551234');
    expect(cmp.isComplete()).toBe(false);
    type('(555) 123-45678');
    expect(cmp.value()).toBe('5551234567');
    expect(cmp.isComplete()).toBe(true);
  });

  it('types through a literal with digits, such as a year prefix', () => {
    for (const keepLiterals of [false, true]) {
      const { cmp, native, type } = setup({ mask: '99/99/2099', keepLiterals });
      type('0101');
      type('01/012');
      expect(native().value).toBe('01/01/202');
      type('01/01/2025');
      expect(native().value).toBe('01/01/2025');
      expect(cmp.value()).toBe(keepLiterals ? '01/01/2025' : '010125');
      expect(cmp.isComplete()).toBe(true);
    }
  });

  it('keeps the literals in the value with keepLiterals', () => {
    const { cmp, type } = setup({ keepLiterals: true });
    type('5551234567');
    expect(cmp.value()).toBe('(555) 123-4567');
  });

  it('rejects a key that does not fit and keeps the caret in place', () => {
    const { cmp, native, type } = setup();
    type('555');
    type('(555x');
    expect(native().value).toBe('(555');
    expect(native().selectionStart).toBe(4);
    expect(cmp.value()).toBe('555');
  });

  it('uses the mask guide as placeholder and a numeric keyboard', () => {
    const { native } = setup();
    expect(native().placeholder).toBe('(___) ___-____');
    expect(native().getAttribute('inputmode')).toBe('numeric');
  });

  it('works with reactive forms and reports incomplete values', () => {
    @Component({
      standalone: true,
      imports: [MaskedInputComponent, ReactiveFormsModule],
      template: `<ngx-ds-masked-input mask="99/99/9999" [formControl]="ctrl" />`,
    })
    class Host {
      readonly ctrl = new FormControl('01052026');
    }
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const native = (fixture.nativeElement as HTMLElement).querySelector('input')!;
    expect(native.value).toBe('01/05/2026');
    expect(fixture.componentInstance.ctrl.valid).toBe(true);

    native.value = '01/05';
    native.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.ctrl.value).toBe('0105');
    expect(fixture.componentInstance.ctrl.errors).toEqual({
      mask: { requiredLength: 8, actualLength: 4 },
    });
  });
});

describe('MaskedInputComponent with a number written by a form', () => {
  it('shows it as text', () => {
    const fixture = TestBed.createComponent(MaskedInputComponent);
    fixture.componentRef.setInput('mask', PHONE);
    fixture.detectChanges();
    fixture.componentInstance.writeValue(5551234 as unknown as string);
    fixture.detectChanges();
    const native = (fixture.nativeElement as HTMLElement).querySelector('input')!;
    expect(native.value).toBe('(555) 123-4');
  });
});

describe('MaskedInputComponent editing and states', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(MaskedInputComponent);
    fixture.componentRef.setInput('mask', PHONE);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const native = () => el.querySelector<HTMLInputElement>('input')!;
    /** Simulates the browser removing one character next to `caret`. */
    const del = (caret: number, inputType: 'deleteContentBackward' | 'deleteContentForward') => {
      const text = native().value;
      const at = inputType === 'deleteContentBackward' ? caret - 1 : caret;
      native().value = text.slice(0, at) + text.slice(at + 1);
      native().setSelectionRange(at, at);
      native().dispatchEvent(new InputEvent('input', { inputType }));
      fixture.detectChanges();
    };
    return { fixture, cmp: fixture.componentInstance, el, native, del };
  }

  it('Delete in front of a literal removes the next digit', () => {
    const { cmp, native, del, fixture } = setup();
    cmp.writeValue('555123');
    fixture.detectChanges();
    expect(native().value).toBe('(555) 123');
    del(4, 'deleteContentForward');
    expect(cmp.value()).toBe('55523');
    expect(native().value).toBe('(555) 23');
    expect(native().selectionStart).toBe(4);
  });

  it('Backspace after a literal removes the previous digit', () => {
    const { cmp, native, del, fixture } = setup();
    cmp.writeValue('555123');
    fixture.detectChanges();
    del(6, 'deleteContentBackward');
    expect(cmp.value()).toBe('55123');
    expect(native().value).toBe('(551) 23');
    expect(native().selectionStart).toBe(3);
  });

  it('Backspace on a digit still removes just that digit', () => {
    const { cmp, native, del, fixture } = setup();
    cmp.writeValue('555123');
    fixture.detectChanges();
    del(9, 'deleteContentBackward');
    expect(cmp.value()).toBe('55512');
    expect(native().value).toBe('(555) 12');
  });

  it('floating label moves up on focus and with a value', () => {
    const { el, native, fixture } = setup({ label: 'Teléfono', floatingLabel: true });
    const label = () => el.querySelector('label')!;
    expect(label().className).toContain('ngx-input__float-label');
    expect(label().className).not.toContain('--active');
    expect(native().placeholder).toBe('');
    native().dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(label().className).toContain('--active');
    expect(native().placeholder).toBe('(___) ___-____');
  });

  it('links the hint or the error to the field', () => {
    const { el, native, fixture } = setup({ hint: 'Con prefijo' });
    const id = native().getAttribute('aria-describedby')!;
    expect(el.querySelector(`#${id}`)!.textContent).toContain('Con prefijo');
    fixture.componentRef.setInput('errorMessage', 'Número incompleto');
    fixture.detectChanges();
    expect(native().getAttribute('aria-invalid')).toBe('true');
    expect(el.querySelector('[role="alert"]')!.textContent).toContain('Número incompleto');
  });

  it('marks touched on blur and disables with the form', () => {
    const { cmp, native, fixture } = setup();
    const touched = vi.fn();
    cmp.registerOnTouched(touched);
    native().dispatchEvent(new Event('focus'));
    native().dispatchEvent(new Event('blur'));
    expect(touched).toHaveBeenCalledTimes(1);
    cmp.setDisabledState(true);
    fixture.detectChanges();
    expect(native().disabled).toBe(true);
  });

  it('uses a text keyboard when the mask has letters', () => {
    const { native, fixture } = setup();
    fixture.componentRef.setInput('mask', 'AAA-999');
    fixture.detectChanges();
    expect(native().getAttribute('inputmode')).toBe('text');
  });
});
