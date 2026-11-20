import { TestBed } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';
import { NGX_DS_LABELS } from '../../shared/labels';

describe('SearchInputComponent outputs', () => {
  function setup() {
    const fixture = TestBed.createComponent(SearchInputComponent);
    fixture.componentRef.setInput('value', 'angular');
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    const submitted: string[] = [];
    cmp.searchSubmit.subscribe((q) => submitted.push(q));
    const press = (key: string) =>
      input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    return { press, submitted };
  }

  it('Enter emits the query on searchSubmit', () => {
    const { press, submitted } = setup();
    press('Enter');
    expect(submitted).toEqual(['angular']);
  });

  it('other keys emit nothing', () => {
    const { press, submitted } = setup();
    press('a');
    expect(submitted).toEqual([]);
  });
});

describe('SearchInputComponent behaviour', () => {
  afterEach(() => document.body.replaceChildren());

  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SearchInputComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    const cmp = fixture.componentInstance;
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input')!;
    const wrapper = el.querySelector<HTMLElement>('.search-input')!;
    const clearBtn = () => el.querySelector<HTMLButtonElement>('.search-input__clear');
    const render = () => fixture.detectChanges();
    const type = (v: string) => {
      input.value = v;
      input.dispatchEvent(new Event('input'));
      render();
    };
    return { fixture, cmp, el, input, wrapper, clearBtn, render, type };
  }

  it('typing updates the value', () => {
    const { cmp, type } = setup();
    const changes: string[] = [];
    cmp.value.subscribe((v) => changes.push(v));
    type('ng');
    expect(cmp.value()).toBe('ng');
    expect(changes).toEqual(['ng']);
  });

  it('the clear button shows only with text, clearable, enabled and not loading', () => {
    const { fixture, clearBtn, type, render } = setup();
    expect(clearBtn()).toBeNull();
    type('ng');
    expect(clearBtn()).not.toBeNull();
    fixture.componentRef.setInput('loading', true);
    render();
    expect(clearBtn()).toBeNull();
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('clearable', false);
    render();
    expect(clearBtn()).toBeNull();
    fixture.componentRef.setInput('clearable', true);
    fixture.componentRef.setInput('disabled', true);
    render();
    expect(clearBtn()).toBeNull();
  });

  it('clearing empties the field, emits cleared and keeps focus in the field', () => {
    const { cmp, input, clearBtn, type, render } = setup();
    let cleared = 0;
    cmp.cleared.subscribe(() => cleared++);
    type('ng');
    clearBtn()!.focus();
    clearBtn()!.click();
    render();
    expect(cmp.value()).toBe('');
    expect(input.value).toBe('');
    expect(cleared).toBe(1);
    expect(document.activeElement).toBe(input);
  });

  it('Enter while composing text (IME) does not submit', () => {
    const { cmp, input } = setup({ value: 'nihon' });
    const submitted: string[] = [];
    cmp.searchSubmit.subscribe((q) => submitted.push(q));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true }));
    expect(submitted).toEqual([]);
  });

  it('loading swaps the search icon for a spinner', () => {
    const { el, fixture, render } = setup();
    expect(el.querySelector('.search-input__icon ngx-ds-spinner')).toBeNull();
    fixture.componentRef.setInput('loading', true);
    render();
    expect(el.querySelector('.search-input__icon ngx-ds-spinner')).not.toBeNull();
  });

  it('labels default to the i18n strings and can be overridden', () => {
    const labels = TestBed.inject(NGX_DS_LABELS);
    const { input, fixture, render } = setup();
    expect(input.getAttribute('aria-label')).toBe(labels.search);
    expect(input.placeholder).toBe(labels.searchPlaceholder);
    fixture.componentRef.setInput('ariaLabel', 'Buscar usuarios');
    fixture.componentRef.setInput('placeholder', 'Nombre');
    render();
    expect(input.getAttribute('aria-label')).toBe('Buscar usuarios');
    expect(input.placeholder).toBe('Nombre');
  });

  it('size, focus and disabled set the classes', () => {
    const { input, wrapper, fixture, render } = setup({ size: 'lg' });
    expect(wrapper.className).toContain('search-input--lg');
    input.dispatchEvent(new Event('focus'));
    render();
    expect(wrapper.className).toContain('search-input--focused');
    input.dispatchEvent(new Event('blur'));
    render();
    expect(wrapper.className).not.toContain('search-input--focused');
    fixture.componentRef.setInput('disabled', true);
    render();
    expect(wrapper.className).toContain('search-input--disabled');
    expect(input.disabled).toBe(true);
  });
});
