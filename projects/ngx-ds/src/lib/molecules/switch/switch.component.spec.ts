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
