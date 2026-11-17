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
