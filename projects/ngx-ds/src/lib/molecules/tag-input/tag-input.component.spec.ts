import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, form, minLength } from '@angular/forms/signals';
import { TagInputComponent } from './tag-input.component';

async function setup(inputs: Record<string, unknown> = {}, value: string[] = []) {
  const fixture = TestBed.createComponent(TagInputComponent);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  const cmp = fixture.componentInstance;
  cmp.writeValue(value);
  fixture.detectChanges();
  document.body.appendChild(fixture.nativeElement);
  const el = fixture.nativeElement as HTMLElement;
  const native = el.querySelector('input') as HTMLInputElement;

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const type = async (text: string) => {
    native.value = text;
    native.dispatchEvent(new Event('input'));
    await render();
  };
  const press = async (key: string) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    native.dispatchEvent(event);
    await render();
    return event;
  };
  const paste = async (text: string) => {
    const event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent;
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => text } });
    native.dispatchEvent(event);
    await render();
  };
  const tags = () =>
    Array.from(el.querySelectorAll('li ngx-ds-tag')).map((t) => t.textContent!.trim());
  return { fixture, cmp, el, native, render, type, press, paste, tags };
}

describe('TagInputComponent', () => {
  afterEach(() => document.body.replaceChildren());

  it('renders the initial tags and hides the placeholder', async () => {
    const { tags, native } = await setup({ placeholder: 'Etiquetas' }, ['a', 'b']);
    expect(tags()).toEqual(['a', 'b']);
    expect(native.placeholder).toBe('');
  });

  it('Enter adds the trimmed text as a tag and clears the input', async () => {
    const { cmp, native, type, press } = await setup();
    const changes: string[][] = [];
    const added: string[] = [];
    cmp.registerOnChange((v) => changes.push(v));
    cmp.added.subscribe((t) => added.push(t));
    await type('  angular ');
    const event = await press('Enter');
    expect(event.defaultPrevented).toBe(true);
    expect(cmp.value()).toEqual(['angular']);
    expect(changes).toEqual([['angular']]);
    expect(added).toEqual(['angular']);
    expect(native.value).toBe('');
  });

  it('Enter on an empty input does nothing, so a form can still submit', async () => {
    const { cmp, press } = await setup();
    const event = await press('Enter');
    expect(event.defaultPrevented).toBe(false);
    expect(cmp.value()).toEqual([]);
  });

  it('typing a comma splits the text into tags', async () => {
    const { cmp, native, type } = await setup();
    await type('uno,dos,tr');
    expect(cmp.value()).toEqual(['uno', 'dos']);
    expect(native.value).toBe('tr');
  });

  it('pasting a list adds every item', async () => {
    const { cmp, paste } = await setup();
    await paste('rojo, verde\nazul,');
    expect(cmp.value()).toEqual(['rojo', 'verde', 'azul']);
  });

  it('skips duplicates (case-insensitive) unless allowDuplicates is set', async () => {
    const a = await setup({}, ['Angular']);
    await a.type('angular');
    await a.press('Enter');
    expect(a.cmp.value()).toEqual(['Angular']);
    expect(a.native.value).toBe('');
    document.body.replaceChildren();

    const b = await setup({ allowDuplicates: true }, ['Angular']);
    await b.type('angular');
    await b.press('Enter');
    expect(b.cmp.value()).toEqual(['Angular', 'angular']);
  });

  it('stops at maxTags and makes the input read-only', async () => {
    const { cmp, native, paste } = await setup({ maxTags: 2 }, ['a']);
    await paste('b,c,d');
    expect(cmp.value()).toEqual(['a', 'b']);
    expect(native.readOnly).toBe(true);
  });

  it('Backspace on an empty input removes the last tag', async () => {
    const { cmp, press, type } = await setup({}, ['a', 'b']);
    const removed: string[] = [];
    cmp.removed.subscribe((t) => removed.push(t));
    await type('x');
    await press('Backspace');
    expect(cmp.value()).toEqual(['a', 'b']);
    await type('');
    await press('Backspace');
    expect(cmp.value()).toEqual(['a']);
    expect(removed).toEqual(['b']);
  });

  it('the tag dismiss button removes that tag', async () => {
    const { cmp, el, render } = await setup({}, ['a', 'b', 'c']);
    el.querySelectorAll<HTMLButtonElement>('li button')[1].click();
    await render();
    expect(cmp.value()).toEqual(['a', 'c']);
  });

  it('dismissing a tag keeps focus in the field', async () => {
    const { el, native, render } = await setup({}, ['a', 'b']);
    const dismiss = el.querySelectorAll<HTMLButtonElement>('li button')[0];
    dismiss.focus();
    dismiss.click();
    await render();
    expect(document.activeElement).toBe(native);
  });

  it('blur adds the pending text and marks the control touched', async () => {
    const { cmp, native, type, render } = await setup();
    let touched = false;
    cmp.registerOnTouched(() => (touched = true));
    await type('pendiente');
    native.dispatchEvent(new Event('blur'));
    await render();
    expect(cmp.value()).toEqual(['pendiente']);
    expect(touched).toBe(true);
  });

  it('when disabled, tags have no dismiss button and the input is disabled', async () => {
    const { cmp, el, native, render } = await setup({}, ['a']);
    cmp.setDisabledState(true);
    await render();
    expect(native.disabled).toBe(true);
    expect(el.querySelector('li button')).toBeNull();
  });

  it('links the hint with aria-describedby', async () => {
    const { el, native } = await setup({ hint: 'Ayuda' });
    const hint = el.querySelector('.ngx-tag-input__message--hint')!;
    expect(native.getAttribute('aria-describedby')).toBe(hint.id);
    expect(native.getAttribute('aria-invalid')).toBeNull();
  });
});

@Component({
  standalone: true,
  imports: [TagInputComponent, FormField],
  template: `<ngx-ds-tag-input [formField]="f.tags" />`,
})
class SignalHost {
  model = signal({ tags: [] as string[] });
  f = form(this.model, (p) => minLength(p.tags, 2, { message: 'Mínimo 2 etiquetas' }));
}

describe('TagInputComponent with Signal Forms', () => {
  it('syncs the model both ways and shows the error once touched', async () => {
    const fixture = TestBed.createComponent(SignalHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const el = fixture.nativeElement as HTMLElement;
    const native = el.querySelector('input')!;

    host.model.set({ tags: ['x'] });
    fixture.detectChanges();
    expect(el.querySelectorAll('li').length).toBe(1);

    native.value = 'y';
    native.dispatchEvent(new Event('input'));
    native.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
    fixture.detectChanges();
    expect(host.model().tags).toEqual(['x', 'y']);

    host.model.set({ tags: ['x'] });
    fixture.detectChanges();
    expect(el.querySelector('[role="alert"]')).toBeNull();

    host.f.tags().markAsTouched();
    fixture.detectChanges();
    const alert = el.querySelector('[role="alert"]')!;
    expect(alert.textContent!.trim()).toBe('Mínimo 2 etiquetas');
    expect(native.getAttribute('aria-describedby')).toBe(alert.id);
    expect(native.getAttribute('aria-invalid')).toBe('true');
  });
});
