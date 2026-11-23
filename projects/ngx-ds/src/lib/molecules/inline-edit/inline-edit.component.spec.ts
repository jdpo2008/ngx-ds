import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InlineEditComponent } from './inline-edit.component';

describe('InlineEditComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(InlineEditComponent);
    fixture.componentRef.setInput('label', 'Título');
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const cmp = fixture.componentInstance;
    const saved = vi.fn();
    const cancelled = vi.fn();
    cmp.saved.subscribe(saved);
    cmp.cancelled.subscribe(cancelled);
    const trigger = () => el.querySelector<HTMLButtonElement>('.ie__trigger');
    const field = () => el.querySelector<HTMLInputElement | HTMLTextAreaElement>('.ie__field');
    const startEditing = async () => {
      trigger()!.click();
      fixture.detectChanges();
      await fixture.whenStable();
    };
    const type = (text: string) => {
      field()!.value = text;
      field()!.dispatchEvent(new Event('input'));
    };
    const key = (k: string, init: KeyboardEventInit = {}) => {
      field()!.dispatchEvent(new KeyboardEvent('keydown', { key: k, ...init }));
      fixture.detectChanges();
    };
    return { fixture, el, cmp, saved, cancelled, trigger, field, startEditing, type, key };
  }

  it('shows the value, or the placeholder when empty', () => {
    const { fixture, trigger } = setup({ value: '', placeholder: 'Sin título' });
    expect(trigger()!.textContent).toContain('Sin título');
    expect(trigger()!.querySelector('.ie__text--placeholder')).not.toBeNull();
    fixture.componentRef.setInput('value', 'Informe');
    fixture.detectChanges();
    expect(trigger()!.textContent).toContain('Informe');
    expect(trigger()!.getAttribute('aria-label')).toBe('Editar Título: Informe');
  });

  it('opens a focused field with the current value', async () => {
    const { cmp, field, startEditing } = setup({ value: 'Informe' });
    await startEditing();
    expect(cmp.editing()).toBe(true);
    expect(field()!.value).toBe('Informe');
    expect(document.activeElement).toBe(field());
  });

  it('saves on Enter, trimmed, and emits saved', async () => {
    const { cmp, saved, trigger, startEditing, type, key } = setup({ value: 'Informe' });
    await startEditing();
    type('  Informe final ');
    key('Enter');
    expect(cmp.editing()).toBe(false);
    expect(cmp.value()).toBe('Informe final');
    expect(saved).toHaveBeenCalledWith('Informe final');
    expect(trigger()).not.toBeNull();
  });

  it('does not emit saved when the value did not change', async () => {
    const { saved, startEditing, key } = setup({ value: 'Informe' });
    await startEditing();
    key('Enter');
    expect(saved).not.toHaveBeenCalled();
  });

  it('restores the value on Escape and emits cancelled', async () => {
    const { cmp, saved, cancelled, startEditing, type, key } = setup({ value: 'Informe' });
    await startEditing();
    type('Otro');
    key('Escape');
    expect(cmp.value()).toBe('Informe');
    expect(cmp.editing()).toBe(false);
    expect(cancelled).toHaveBeenCalled();
    expect(saved).not.toHaveBeenCalled();
  });

  it('saves on blur, or cancels with saveOnBlur false', async () => {
    const a = setup({ value: 'A' });
    await a.startEditing();
    a.type('B');
    a.field()!.dispatchEvent(new FocusEvent('blur'));
    expect(a.cmp.value()).toBe('B');

    TestBed.resetTestingModule();
    const b = setup({ value: 'A', saveOnBlur: false });
    await b.startEditing();
    b.type('B');
    b.field()!.dispatchEvent(new FocusEvent('blur'));
    expect(b.cmp.value()).toBe('A');
    expect(b.cancelled).toHaveBeenCalled();
  });

  it('keeps the previous value when required and left empty', async () => {
    const { cmp, saved, startEditing, type, key } = setup({ value: 'Informe', required: true });
    await startEditing();
    type('   ');
    key('Enter');
    expect(cmp.value()).toBe('Informe');
    expect(saved).not.toHaveBeenCalled();
  });

  it('uses a textarea when multiline: Enter adds a line, Ctrl+Enter saves', async () => {
    const { cmp, field, startEditing, type, key } = setup({ value: 'a', multiline: true });
    await startEditing();
    expect(field()!.tagName).toBe('TEXTAREA');
    type('a\nb');
    key('Enter');
    expect(cmp.editing()).toBe(true);
    key('Enter', { ctrlKey: true });
    expect(cmp.value()).toBe('a\nb');
  });

  it('saves and cancels from the action buttons', async () => {
    const { fixture, el, cmp, cancelled, startEditing, type } = setup({
      value: 'A',
      showActions: true,
    });
    await startEditing();
    type('B');
    el.querySelector<HTMLButtonElement>('.ie__action--save')!.click();
    fixture.detectChanges();
    expect(cmp.value()).toBe('B');

    await startEditing();
    type('C');
    el.querySelectorAll<HTMLButtonElement>('.ie__action')[1].click();
    fixture.detectChanges();
    expect(cmp.value()).toBe('B');
    expect(cancelled).toHaveBeenCalled();
  });

  it('starts editing when [editing] is set from outside', async () => {
    const { fixture, field } = setup({ value: 'Informe' });
    fixture.componentRef.setInput('editing', true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(field()!.value).toBe('Informe');
  });

  it('does not open when disabled', () => {
    const { cmp, trigger } = setup({ value: 'A', disabled: true });
    expect(trigger()!.disabled).toBe(true);
    cmp.edit();
    expect(cmp.editing()).toBe(false);
  });

  it('does not save on the Enter that confirms an IME composition', async () => {
    const { cmp, saved, startEditing, type, key } = setup({ value: 'a' });
    await startEditing();
    type('日本');
    key('Enter', { isComposing: true });
    expect(cmp.editing()).toBe(true);
    expect(saved).not.toHaveBeenCalled();
    key('Enter');
    expect(saved).toHaveBeenCalledWith('日本');
  });

  it('stops editing, without saving, when disabled mid-edit', async () => {
    const { fixture, cmp, saved, field, startEditing, type } = setup({ value: 'a' });
    await startEditing();
    type('b');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(cmp.editing()).toBe(false);
    expect(field()).toBeNull();
    expect(cmp.value()).toBe('a');
    expect(saved).not.toHaveBeenCalled();
  });

  it('ignores [editing] set from outside while disabled', () => {
    const { fixture, cmp, field } = setup({ value: 'a', disabled: true });
    fixture.componentRef.setInput('editing', true);
    fixture.detectChanges();
    expect(cmp.editing()).toBe(false);
    expect(field()).toBeNull();
  });

  describe('with reactive forms', () => {
    @Component({
      standalone: true,
      imports: [InlineEditComponent, ReactiveFormsModule],
      template: `<ngx-ds-inline-edit label="Nombre" [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl('Ana');
    }

    it('syncs the value, marks touched and honours disable()', async () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      const ctrl = fixture.componentInstance.ctrl;
      const trigger = () => el.querySelector<HTMLButtonElement>('.ie__trigger')!;
      expect(trigger().textContent).toContain('Ana');

      trigger().click();
      fixture.detectChanges();
      await fixture.whenStable();
      const field = el.querySelector<HTMLInputElement>('.ie__field')!;
      field.value = 'Eva';
      field.dispatchEvent(new Event('input'));
      field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();
      expect(ctrl.value).toBe('Eva');
      expect(ctrl.touched).toBe(true);

      ctrl.disable();
      fixture.detectChanges();
      expect(trigger().disabled).toBe(true);
    });
  });
});
