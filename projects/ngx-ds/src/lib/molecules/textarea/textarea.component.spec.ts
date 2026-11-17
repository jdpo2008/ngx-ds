import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextareaComponent } from './textarea.component';

describe('TextareaComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TextareaComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const native = el.querySelector('textarea')!;
    const type = (text: string) => {
      native.value = text;
      native.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    return { fixture, cmp: fixture.componentInstance, el, native, type };
  }

  it('applies rows, resize class and maxlength', () => {
    const { el, native } = setup({ rows: 5, resize: 'none', maxLength: 10 });
    expect(native.rows).toBe(5);
    expect(native.getAttribute('maxlength')).toBe('10');
    expect(el.querySelector('.ngx-textarea__field--resize-none')).not.toBeNull();
  });

  it('counts characters and flags the limit', () => {
    const { el, cmp, type } = setup({ showCount: true, maxLength: 4 });
    type('abc');
    expect(cmp.value()).toBe('abc');
    const count = () => el.querySelector('.ngx-textarea__count')!;
    expect(count().textContent?.trim()).toBe('3/4');
    expect(count().classList).not.toContain('ngx-textarea__count--limit');
    type('abcd');
    expect(count().classList).toContain('ngx-textarea__count--limit');
  });

  it('hides the counter without maxLength', () => {
    const { el } = setup({ showCount: true });
    expect(el.querySelector('.ngx-textarea__count')).toBeNull();
  });

  it('shows the error with role alert', () => {
    const { el } = setup({ errorMessage: 'Demasiado corto', hint: 'Ayuda' });
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Demasiado corto');
    expect(el.querySelector('.ngx-textarea__message--hint')).toBeNull();
  });

  describe('with reactive forms', () => {
    @Component({
      standalone: true,
      imports: [TextareaComponent, ReactiveFormsModule],
      template: `<ngx-ds-textarea [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl<string | null>(null);
    }

    it('syncs value, touched and disabled state', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const ctrl = fixture.componentInstance.ctrl;
      const native = (fixture.nativeElement as HTMLElement).querySelector('textarea')!;
      expect(native.value).toBe('');

      native.value = 'texto';
      native.dispatchEvent(new Event('input'));
      native.dispatchEvent(new Event('blur'));
      expect(ctrl.value).toBe('texto');
      expect(ctrl.touched).toBe(true);

      ctrl.disable();
      fixture.detectChanges();
      expect(native.disabled).toBe(true);
    });
  });
});
