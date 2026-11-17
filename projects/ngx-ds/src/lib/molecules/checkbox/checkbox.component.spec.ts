import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(CheckboxComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, cmp: fixture.componentInstance, el, native: el.querySelector('input')! };
  }

  it('toggles checked from the native input', () => {
    const { fixture, cmp, el, native } = setup({ label: 'Acepto' });
    native.click();
    fixture.detectChanges();
    expect(cmp.checked()).toBe(true);
    expect(el.querySelector('.checkbox--checked')).not.toBeNull();
  });

  it('renders the label on the requested side', () => {
    const { el } = setup({ label: 'Izq', labelPosition: 'left' });
    const label = el.querySelector('label')!;
    expect(label.children[1].classList).toContain('checkbox__label');
    expect(label.children[2].classList).toContain('checkbox__box');
  });

  it('sets the native indeterminate state only while unchecked', () => {
    const { fixture, el, native } = setup({ indeterminate: true });
    expect(native.indeterminate).toBe(true);
    expect(el.querySelector('.checkbox--indeterminate')).not.toBeNull();
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    expect(native.indeterminate).toBe(false);
    expect(el.querySelector('.checkbox--indeterminate')).toBeNull();
  });

  describe('with reactive forms', () => {
    @Component({
      standalone: true,
      imports: [CheckboxComponent, ReactiveFormsModule],
      template: `<ngx-ds-checkbox [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl(true);
    }

    it('syncs value, touched and disabled state', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const ctrl = fixture.componentInstance.ctrl;
      const native = (fixture.nativeElement as HTMLElement).querySelector('input')!;
      expect(native.checked).toBe(true);

      native.click();
      expect(ctrl.value).toBe(false);
      expect(ctrl.touched).toBe(true);

      ctrl.disable();
      fixture.detectChanges();
      expect(native.disabled).toBe(true);
    });
  });
});
