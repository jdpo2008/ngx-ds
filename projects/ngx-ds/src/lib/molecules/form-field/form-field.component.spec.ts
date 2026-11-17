import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';

@Component({
  standalone: true,
  imports: [FormFieldComponent],
  template: `
    <ngx-ds-form-field label="Email" [hint]="hint()" [error]="error()" [required]="true">
      <input type="email" />
    </ngx-ds-form-field>
  `,
})
class Host {
  hint = signal('Usa tu correo de trabajo');
  error = signal('');
}

describe('FormFieldComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, host: fixture.componentInstance, el, control: el.querySelector('input')! };
  }

  it('gives the projected control an id linked to the label', () => {
    const { el, control } = setup();
    const label = el.querySelector('label')!;
    expect(control.id).toBeTruthy();
    expect(label.getAttribute('for')).toBe(control.id);
    expect(el.querySelector('.ngx-ff__required')).not.toBeNull();
  });

  it('describes the control with the hint, then with the error', () => {
    const { fixture, host, el, control } = setup();
    const hint = el.querySelector('.ngx-ff__message--hint')!;
    expect(control.getAttribute('aria-describedby')).toBe(hint.id);
    expect(control.hasAttribute('aria-invalid')).toBe(false);

    host.error.set('Email no válido');
    fixture.detectChanges();
    const error = el.querySelector('[role="alert"]')!;
    expect(error.textContent).toContain('Email no válido');
    expect(control.getAttribute('aria-describedby')).toBe(error.id);
    expect(control.getAttribute('aria-invalid')).toBe('true');

    host.error.set('');
    host.hint.set('');
    fixture.detectChanges();
    expect(control.hasAttribute('aria-describedby')).toBe(false);
    expect(control.hasAttribute('aria-invalid')).toBe(false);
  });

  it('keeps an id the control already has', () => {
    @Component({
      standalone: true,
      imports: [FormFieldComponent],
      template: `<ngx-ds-form-field label="Nombre" for="mi-id"
        ><input id="mi-id"
      /></ngx-ds-form-field>`,
    })
    class OwnIdHost {}

    const fixture = TestBed.createComponent(OwnIdHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('input')!.id).toBe('mi-id');
    expect(el.querySelector('label')!.getAttribute('for')).toBe('mi-id');
  });
});
