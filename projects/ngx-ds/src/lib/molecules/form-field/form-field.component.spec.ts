import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';

@Component({
  standalone: true,
  imports: [FormFieldComponent],
  template: `
    <ngx-ds-form-field label="Email" [hint]="hint()" [errorMessage]="error()" [required]="true">
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

describe('FormFieldComponent behaviour', () => {
  it('links the label to a control that already has its own id', () => {
    @Component({
      standalone: true,
      imports: [FormFieldComponent],
      template: `<ngx-ds-form-field label="Ciudad" hint="Donde vives"
        ><input id="ciudad"
      /></ngx-ds-form-field>`,
    })
    class OwnIdNoForHost {}

    const fixture = TestBed.createComponent(OwnIdNoForHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const control = el.querySelector('input')!;
    expect(control.id).toBe('ciudad');
    expect(el.querySelector('label')!.getAttribute('for')).toBe('ciudad');
    const hint = el.querySelector('.ngx-ff__message--hint')!;
    expect(control.getAttribute('aria-describedby')).toBe(hint.id);
  });

  it('marks the control as required for assistive tech', () => {
    @Component({
      standalone: true,
      imports: [FormFieldComponent],
      template: `<ngx-ds-form-field label="Nombre" [required]="required()">
        <textarea></textarea>
      </ngx-ds-form-field>`,
    })
    class RequiredHost {
      required = signal(true);
    }

    const fixture = TestBed.createComponent(RequiredHost);
    fixture.detectChanges();
    const control = (fixture.nativeElement as HTMLElement).querySelector('textarea')!;
    expect(control.getAttribute('aria-required')).toBe('true');
    fixture.componentInstance.required.set(false);
    fixture.detectChanges();
    expect(control.hasAttribute('aria-required')).toBe(false);
  });

  it('without a label renders no label element and still sets the control id', () => {
    @Component({
      standalone: true,
      imports: [FormFieldComponent],
      template: `<ngx-ds-form-field><select></select></ngx-ds-form-field>`,
    })
    class NoLabelHost {}

    const fixture = TestBed.createComponent(NoLabelHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('label')).toBeNull();
    expect(el.querySelector('select')!.id).toMatch(/^ngx-ff-/);
  });

  it('disabled dims the control wrapper', () => {
    @Component({
      standalone: true,
      imports: [FormFieldComponent],
      template: `<ngx-ds-form-field label="X" [disabled]="true"><input /></ngx-ds-form-field>`,
    })
    class DisabledHost {}

    const fixture = TestBed.createComponent(DisabledHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.ngx-ff__control--disabled')).not.toBeNull();
  });
});
