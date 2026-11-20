import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NumberInputComponent } from './number-input.component';

describe('NumberInputComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(NumberInputComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const [dec, inc] = Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
    const field = el.querySelector('input')!;
    const click = (b: HTMLButtonElement) => {
      b.click();
      fixture.detectChanges();
    };
    const type = (text: string) => {
      field.value = text;
      field.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    };
    return { cmp: fixture.componentInstance, dec, inc, field, click, type };
  }

  it('labels the stepper buttons', () => {
    const { dec, inc } = setup();
    expect(dec.getAttribute('aria-label')).toBe('Decrementar');
    expect(inc.getAttribute('aria-label')).toBe('Incrementar');
  });

  it('steps by the given step and clamps to min/max', () => {
    const { cmp, dec, inc, click } = setup({ value: 8, step: 5, min: 0, max: 10 });
    click(inc);
    expect(cmp.value()).toBe(10);
    expect(inc.disabled).toBe(true);
    click(dec);
    click(dec);
    click(dec);
    expect(cmp.value()).toBe(0);
    expect(dec.disabled).toBe(true);
  });

  it('clamps typed values and ignores non-numbers', () => {
    const { cmp, type } = setup({ value: 3, min: 1, max: 5 });
    type('99');
    expect(cmp.value()).toBe(5);
    type('-4');
    expect(cmp.value()).toBe(1);
    type('abc');
    expect(cmp.value()).toBe(1);
  });

  describe('with reactive forms', () => {
    @Component({
      standalone: true,
      imports: [NumberInputComponent, ReactiveFormsModule],
      template: `<ngx-ds-number-input [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl(2);
    }

    it('syncs value and touched state', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const ctrl = fixture.componentInstance.ctrl;
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('input')!.value).toBe('2');
      el.querySelectorAll<HTMLButtonElement>('button')[1].click();
      expect(ctrl.value).toBe(3);
      expect(ctrl.touched).toBe(true);
    });
  });
});

describe('NumberInputComponent behaviour', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(NumberInputComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    const cmp = fixture.componentInstance;
    const changes: number[] = [];
    const touched = vi.fn();
    cmp.registerOnChange((v) => changes.push(v));
    cmp.registerOnTouched(touched);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const [dec, inc] = Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
    const field = el.querySelector('input')!;
    const render = () => fixture.detectChanges();
    const type = (text: string) => {
      field.value = text;
      field.dispatchEvent(new Event('change'));
      render();
    };
    const q = (s: string) => el.querySelector<HTMLElement>(s);
    return { fixture, cmp, el, dec, inc, field, render, type, q, changes, touched };
  }

  it('shows the clamped value even when it equals the current one', () => {
    const { cmp, field, type, changes } = setup({ value: 5, max: 5 });
    type('99');
    expect(cmp.value()).toBe(5);
    expect(field.value).toBe('5');
    expect(changes).toEqual([5]);
  });

  it('puts the current value back when the text is not a number', () => {
    const { cmp, field, type, changes } = setup({ value: 3 });
    type('');
    expect(cmp.value()).toBe(3);
    expect(field.value).toBe('3');
    expect(changes).toEqual([]);
  });

  it('decimal steps do not add floating point noise', () => {
    const { cmp, inc, dec, render } = setup({ value: 0, step: 0.1 });
    inc.click();
    inc.click();
    inc.click();
    render();
    expect(cmp.value()).toBe(0.3);
    dec.click();
    expect(cmp.value()).toBe(0.2);
  });

  it('keeps the decimals of a typed value when stepping', () => {
    const { cmp, inc, type } = setup({ step: 1 });
    type('1.25');
    inc.click();
    expect(cmp.value()).toBe(2.25);
  });

  it('marks touched on blur', () => {
    const { field, touched } = setup();
    field.dispatchEvent(new Event('blur'));
    expect(touched).toHaveBeenCalledOnce();
  });

  it('a form-disabled control disables the field and both buttons', () => {
    const { cmp, dec, inc, field, render, changes } = setup({ value: 2 });
    cmp.setDisabledState(true);
    render();
    expect(field.disabled).toBe(true);
    expect(dec.disabled).toBe(true);
    expect(inc.disabled).toBe(true);
    cmp.increment();
    cmp.decrement();
    expect(cmp.value()).toBe(2);
    expect(changes).toEqual([]);
  });

  it('writeValue(null) shows 0', () => {
    const { cmp, field, render } = setup({ value: 7 });
    cmp.writeValue(null as unknown as number);
    render();
    expect(cmp.value()).toBe(0);
    expect(field.value).toBe('0');
  });

  it('label, aria-label, hint and error', () => {
    const { fixture, field, render, q } = setup({ ariaLabel: 'Cantidad', hint: 'Máx. 10' });
    expect(field.getAttribute('aria-label')).toBe('Cantidad');
    expect(field.getAttribute('aria-describedby')).toBe(q('.number-input__hint')!.id);
    fixture.componentRef.setInput('label', 'Unidades');
    fixture.componentRef.setInput('errorMessage', 'Obligatorio');
    render();
    expect(q('label')!.getAttribute('for')).toBe(field.id);
    expect(field.getAttribute('aria-label')).toBeNull();
    expect(field.getAttribute('aria-invalid')).toBe('true');
    expect(q('.number-input__hint')).toBeNull();
    expect(q('.number-input__error')!.textContent!.trim()).toBe('Obligatorio');
    expect(q('.number-input')!.className).toContain('number-input--error');
  });

  it('size sets the class and the icon size', () => {
    const { q, cmp } = setup({ size: 'lg' });
    expect(q('.number-input')!.className).toContain('number-input--lg');
    expect(cmp.iconSize()).toBe(18);
  });

  it('min and max reach the native input', () => {
    const { field } = setup({ min: 1, max: 9, step: 2 });
    expect(field.min).toBe('1');
    expect(field.max).toBe('9');
    expect(field.step).toBe('2');
  });
});
