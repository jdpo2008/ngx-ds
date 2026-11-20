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

describe('CheckboxComponent behaviour', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(CheckboxComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    const cmp = fixture.componentInstance;
    const changes: boolean[] = [];
    const touched = vi.fn();
    cmp.registerOnChange((v) => changes.push(v));
    cmp.registerOnTouched(touched);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const native = el.querySelector('input')!;
    const label = el.querySelector('label')!;
    const render = () => fixture.detectChanges();
    return { fixture, cmp, el, native, label, render, changes, touched };
  }

  it('a click reports the new value, marks touched and emits checkedChange', () => {
    const { cmp, native, changes, touched } = setup();
    const emitted: boolean[] = [];
    cmp.checked.subscribe((v) => emitted.push(v));
    native.click();
    native.click();
    expect(changes).toEqual([true, false]);
    expect(emitted).toEqual([true, false]);
    expect(touched).toHaveBeenCalledTimes(2);
  });

  it('marks touched on blur', () => {
    const { native, touched } = setup();
    native.dispatchEvent(new Event('blur'));
    expect(touched).toHaveBeenCalledOnce();
  });

  it('the label is the accessible name; aria-label only applies without one', () => {
    const { fixture, native, label, render } = setup({ ariaLabel: 'Aceptar' });
    expect(native.getAttribute('aria-label')).toBe('Aceptar');
    fixture.componentRef.setInput('label', 'Acepto');
    render();
    expect(native.getAttribute('aria-label')).toBeNull();
    expect(label.getAttribute('for')).toBe(native.id);
  });

  it('size, color, checked and indeterminate set the classes', () => {
    const { fixture, label, render } = setup({ size: 'lg', color: 'danger', indeterminate: true });
    expect(label.className).toContain('checkbox--lg');
    expect(label.className).toContain('checkbox--danger');
    expect(label.className).toContain('checkbox--indeterminate');
    fixture.componentRef.setInput('checked', true);
    render();
    expect(label.className).toContain('checkbox--checked');
    expect(label.className).not.toContain('checkbox--indeterminate');
  });

  it('a form-disabled control disables the native input', () => {
    const { cmp, native, label, render } = setup();
    cmp.setDisabledState(true);
    render();
    expect(native.disabled).toBe(true);
    expect(label.className).toContain('checkbox--disabled');
  });

  it('writeValue(null) unchecks', () => {
    const { cmp, native, render } = setup({ checked: true });
    cmp.writeValue(null as unknown as boolean);
    render();
    expect(cmp.checked()).toBe(false);
    expect(native.checked).toBe(false);
  });
});
