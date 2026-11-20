import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SwitchComponent } from './switch.component';

describe('SwitchComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SwitchComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, cmp: fixture.componentInstance, el, native: el.querySelector('input')! };
  }

  it('exposes switch semantics and its label', () => {
    const { native } = setup({ label: 'Notificaciones' });
    expect(native.getAttribute('role')).toBe('switch');
    expect(native.getAttribute('aria-checked')).toBe('false');
    expect(native.getAttribute('aria-label')).toBe('Notificaciones');
  });

  it('toggles and shows the on/off state labels', () => {
    const { fixture, cmp, el, native } = setup({ labelOn: 'Sí', labelOff: 'No' });
    const state = () => el.querySelector('.switch__state-label')?.textContent?.trim();
    expect(state()).toBe('No');
    native.click();
    fixture.detectChanges();
    expect(cmp.checked()).toBe(true);
    expect(native.getAttribute('aria-checked')).toBe('true');
    expect(el.querySelector('.switch--checked')).not.toBeNull();
    expect(state()).toBe('Sí');
  });

  describe('with reactive forms', () => {
    @Component({
      standalone: true,
      imports: [SwitchComponent, ReactiveFormsModule],
      template: `<ngx-ds-switch [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl(false);
    }

    it('syncs value, touched and disabled state', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const ctrl = fixture.componentInstance.ctrl;
      const native = (fixture.nativeElement as HTMLElement).querySelector('input')!;

      native.click();
      fixture.detectChanges();
      expect(ctrl.value).toBe(true);
      expect(ctrl.touched).toBe(true);

      ctrl.setValue(false);
      ctrl.disable();
      fixture.detectChanges();
      expect(native.checked).toBe(false);
      expect(native.disabled).toBe(true);
      expect(
        (fixture.nativeElement as HTMLElement).querySelector('.switch--disabled'),
      ).not.toBeNull();
    });
  });
});

describe('SwitchComponent behaviour', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SwitchComponent);
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
    const q = (s: string) => el.querySelector<HTMLElement>(s);
    return { fixture, cmp, el, native, label, render, q, changes, touched };
  }

  it('a click reports the value, marks touched and updates aria-checked', () => {
    const { native, render, changes, touched } = setup();
    native.click();
    render();
    expect(changes).toEqual([true]);
    expect(touched).toHaveBeenCalledOnce();
    expect(native.getAttribute('aria-checked')).toBe('true');
  });

  it('marks touched on blur', () => {
    const { native, touched } = setup();
    native.dispatchEvent(new Event('blur'));
    expect(touched).toHaveBeenCalledOnce();
  });

  it('aria-label falls back to ariaLabel when there is no label', () => {
    const { native } = setup({ ariaLabel: 'Notificaciones' });
    expect(native.getAttribute('aria-label')).toBe('Notificaciones');
  });

  it('the state labels follow the value', () => {
    const { native, render, q } = setup({ labelOn: 'Sí', labelOff: 'No' });
    expect(q('.switch__state-label')!.textContent!.trim()).toBe('No');
    native.click();
    render();
    expect(q('.switch__state-label')!.textContent!.trim()).toBe('Sí');
  });

  it('only labelOn shows nothing while off', () => {
    const { q } = setup({ labelOn: 'Sí' });
    expect(q('.switch__state-label')).toBeNull();
  });

  it('the label goes on the requested side', () => {
    const { label } = setup({ label: 'Wifi', labelPosition: 'left' });
    const children = Array.from(label.children).map((c) => c.className);
    expect(children.indexOf('switch__label')).toBeLessThan(children.indexOf('switch__track'));
  });

  it('size, color and disabled set the classes; a form-disabled control disables the input', () => {
    const { cmp, native, label, render } = setup({ size: 'sm', color: 'success' });
    expect(label.className).toContain('switch--sm');
    expect(label.className).toContain('switch--success');
    cmp.setDisabledState(true);
    render();
    expect(native.disabled).toBe(true);
    expect(label.className).toContain('switch--disabled');
  });
});
