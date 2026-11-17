import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(InputComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const native = () => el.querySelector<HTMLInputElement>('input')!;
    return { fixture, cmp: fixture.componentInstance, el, native };
  }

  it('links the static label to the native input', () => {
    const { el, native } = setup({ label: 'Nombre' });
    const label = el.querySelector('label')!;
    expect(label.textContent).toContain('Nombre');
    expect(label.getAttribute('for')).toBe(native().id);
  });

  it('updates the value on typing', () => {
    const { cmp, native } = setup();
    native().value = 'hola';
    native().dispatchEvent(new Event('input'));
    expect(cmp.value()).toBe('hola');
  });

  it('shows the error instead of the hint and marks the field', () => {
    const { el, fixture } = setup({ hint: 'Ayuda' });
    expect(el.querySelector('.ngx-input__message--hint')?.textContent).toContain('Ayuda');
    fixture.componentRef.setInput('errorMessage', 'Obligatorio');
    fixture.detectChanges();
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Obligatorio');
    expect(el.querySelector('.ngx-input__message--hint')).toBeNull();
    expect(el.querySelector('.ngx-input__field--error')).not.toBeNull();
  });

  it('toggles password visibility', () => {
    const { el, fixture, native } = setup({ type: 'password' });
    const toggle = el.querySelector<HTMLButtonElement>('.ngx-input__password-toggle')!;
    expect(native().type).toBe('password');
    expect(toggle.getAttribute('aria-label')).toBe('Mostrar contraseña');
    toggle.click();
    fixture.detectChanges();
    expect(native().type).toBe('text');
    expect(toggle.getAttribute('aria-label')).toBe('Ocultar contraseña');
  });

  it('hides the placeholder until a floating label floats', () => {
    const { fixture, native } = setup({
      label: 'Email',
      floatingLabel: true,
      placeholder: 'tu@mail',
    });
    expect(native().placeholder).toBe('');
    native().dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(native().placeholder).toBe('tu@mail');
  });

  describe('with reactive forms', () => {
    @Component({
      standalone: true,
      imports: [InputComponent, ReactiveFormsModule],
      template: `<ngx-ds-input [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl('inicial');
    }

    it('syncs value, touched and disabled state', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const ctrl = fixture.componentInstance.ctrl;
      const native = (fixture.nativeElement as HTMLElement).querySelector('input')!;
      expect(native.value).toBe('inicial');

      native.value = 'nuevo';
      native.dispatchEvent(new Event('input'));
      native.dispatchEvent(new Event('blur'));
      expect(ctrl.value).toBe('nuevo');
      expect(ctrl.touched).toBe(true);

      ctrl.setValue('desde fuera');
      ctrl.disable();
      fixture.detectChanges();
      expect(native.value).toBe('desde fuera');
      expect(native.disabled).toBe(true);
    });
  });
});
