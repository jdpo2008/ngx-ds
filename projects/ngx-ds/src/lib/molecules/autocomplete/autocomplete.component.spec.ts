import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  AutocompleteComponent,
  AutocompleteOption,
  AutocompleteValue,
} from './autocomplete.component';

const OPTIONS: AutocompleteOption[] = [
  { label: 'Madrid', value: 'mad' },
  { label: 'Málaga', value: 'agp' },
  { label: 'Barcelona', value: 'bcn' },
];

describe('AutocompleteComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(AutocompleteComponent);
    fixture.componentRef.setInput('options', OPTIONS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const native = el.querySelector<HTMLInputElement>('input')!;
    const type = (text: string) => {
      native.value = text;
      native.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    const options = () => Array.from(el.querySelectorAll<HTMLElement>('.ngx-autocomplete__option'));
    return { fixture, cmp: fixture.componentInstance, el, native, type, options };
  }

  afterEach(() => vi.useRealTimers());

  it('filters options and highlights the match', () => {
    const { el, native, type, options } = setup();
    type('ma');
    expect(native.getAttribute('aria-expanded')).toBe('true');
    // Accent-sensitive: "Málaga" does not contain "ma".
    expect(options().map((o) => o.textContent?.trim())).toEqual(['Madrid']);
    expect(el.querySelector('mark.ngx-autocomplete__highlight')?.textContent).toBe('Ma');
  });

  it('keeps the panel closed below minChars', () => {
    const { el, type } = setup({ minChars: 3 });
    type('ma');
    expect(el.querySelector('.ngx-autocomplete__panel')).toBeNull();
  });

  it('shows the empty state', () => {
    const { el, type } = setup();
    type('zzz');
    expect(el.querySelector('.ngx-autocomplete__empty')?.textContent).toContain('Sin resultados');
  });

  it('selects an option on mousedown and clears it', () => {
    const { fixture, cmp, el, native, type, options } = setup();
    type('bar');
    options()[0].dispatchEvent(new Event('mousedown'));
    fixture.detectChanges();
    expect(cmp.value()).toBe('bcn');
    expect(native.value).toBe('Barcelona');
    expect(el.querySelector('.ngx-autocomplete__panel')).toBeNull();

    el.querySelector('.ngx-autocomplete__clear')!.dispatchEvent(new Event('mousedown'));
    fixture.detectChanges();
    expect(cmp.value()).toBeNull();
    expect(native.value).toBe('');
  });

  it('drops the value when the text is edited after selecting', () => {
    const { fixture, cmp, type, options } = setup();
    type('mad');
    options()[0].dispatchEvent(new Event('mousedown'));
    fixture.detectChanges();
    type('Madri');
    expect(cmp.value()).toBeNull();
  });

  it('debounces searchChange', () => {
    vi.useFakeTimers();
    const { cmp, type } = setup({ debounceMs: 200 });
    const searches: string[] = [];
    cmp.searchChange.subscribe((s) => searches.push(s));
    type('m');
    type('ma');
    expect(searches).toEqual([]);
    vi.advanceTimersByTime(200);
    expect(searches).toEqual(['ma']);
  });

  describe('with reactive forms', () => {
    @Component({
      standalone: true,
      imports: [AutocompleteComponent, ReactiveFormsModule],
      template: `<ngx-ds-autocomplete [options]="options" [formControl]="ctrl" />`,
    })
    class Host {
      options = OPTIONS;
      ctrl = new FormControl<AutocompleteValue | null>('agp');
    }

    it('syncs value, touched and disabled state', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const ctrl = fixture.componentInstance.ctrl;
      const el = fixture.nativeElement as HTMLElement;
      const native = el.querySelector('input')!;
      expect(native.value).toBe('Málaga');

      native.value = 'mad';
      native.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(ctrl.value).toBeNull();
      el.querySelector('.ngx-autocomplete__option')!.dispatchEvent(new Event('mousedown'));
      native.dispatchEvent(new Event('blur'));
      expect(ctrl.value).toBe('mad');
      expect(ctrl.touched).toBe(true);

      ctrl.disable();
      fixture.detectChanges();
      expect(native.disabled).toBe(true);
    });
  });
});

describe('AutocompleteComponent behaviour', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(AutocompleteComponent);
    if (!('options' in inputs)) fixture.componentRef.setInput('options', OPTIONS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    const cmp = fixture.componentInstance;
    const changes: (AutocompleteValue | null)[] = [];
    const touched = vi.fn();
    cmp.registerOnChange((v) => changes.push(v));
    cmp.registerOnTouched(touched);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    const el = fixture.nativeElement as HTMLElement;
    const native = el.querySelector<HTMLInputElement>('input')!;
    const render = () => fixture.detectChanges();
    const type = (text: string) => {
      native.value = text;
      native.dispatchEvent(new Event('input'));
      render();
    };
    const focus = () => {
      native.dispatchEvent(new Event('focus'));
      render();
    };
    const options = () => Array.from(el.querySelectorAll<HTMLElement>('.ngx-autocomplete__option'));
    const q = (s: string) => el.querySelector<HTMLElement>(s);
    return { fixture, cmp, el, native, render, type, focus, options, q, changes, touched };
  }

  afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  it('escapes option labels instead of rendering them as HTML', () => {
    const { el, type, options, fixture } = setup({
      options: [{ label: '<img src=x onerror="alert(1)">Madrid', value: 'x' }],
      showAllOnFocus: true,
    });
    type('mad');
    expect(el.querySelector('.ngx-autocomplete__panel img')).toBeNull();
    expect(options()[0].textContent!.trim()).toBe('<img src=x onerror="alert(1)">Madrid');
    expect(el.querySelector('mark')!.textContent).toBe('Mad');
    type('');
    fixture.detectChanges();
    expect(el.querySelector('.ngx-autocomplete__panel img')).toBeNull();
    expect(options()[0].textContent!.trim()).toContain('<img');
  });

  it('a click elsewhere does nothing while the field is not in use', () => {
    const { cmp, native, render, touched } = setup({ allowCustom: false });
    cmp.writeValue('mad');
    document.body.click();
    render();
    expect(touched).not.toHaveBeenCalled();
    expect(native.value).toBe('Madrid');
  });

  it('an outside click closes, restores the selected label and marks touched', () => {
    const { cmp, native, type, render, touched } = setup();
    cmp.writeValue('bcn');
    render();
    type('Barc');
    expect(cmp.isOpen()).toBe(true);
    document.body.click();
    render();
    expect(cmp.isOpen()).toBe(false);
    expect(touched).toHaveBeenCalledOnce();
    expect(native.value).toBe('');
  });

  it('an outside click clears unmatched text unless allowCustom', () => {
    const { fixture, native, type, render } = setup();
    type('zzz');
    document.body.click();
    render();
    expect(native.value).toBe('');
    fixture.componentRef.setInput('allowCustom', true);
    type('zzz');
    document.body.click();
    render();
    expect(native.value).toBe('zzz');
  });

  it('disabled options are marked and cannot be picked', () => {
    const { cmp, type, options, render } = setup({
      options: [...OPTIONS, { label: 'Mallorca', value: 'pmi', disabled: true }],
    });
    type('mallorca');
    expect(options()[0].getAttribute('aria-disabled')).toBe('true');
    options()[0].dispatchEvent(new Event('mousedown'));
    render();
    expect(cmp.value()).toBeNull();
  });

  it('showAllOnFocus lists every option on focus', () => {
    const { focus, options, cmp } = setup({ showAllOnFocus: true });
    focus();
    expect(cmp.isFocused()).toBe(true);
    expect(options().length).toBe(3);
  });

  it('a disabled control ignores focus, option picks and clear', () => {
    const { cmp, render, native, q } = setup();
    cmp.writeValue('mad');
    cmp.setDisabledState(true);
    render();
    expect(native.disabled).toBe(true);
    expect(q('.ngx-autocomplete__clear')).toBeNull();
    cmp.onFocus();
    expect(cmp.isOpen()).toBe(false);
    cmp.onOptionSelect(OPTIONS[2]);
    cmp.onClear(new Event('mousedown'));
    expect(cmp.value()).toBe('mad');
  });

  it('loading shows the spinner and the searching text, and hides clear', () => {
    const { fixture, cmp, q, type, render } = setup({ options: [] });
    cmp.writeValue('zzz');
    fixture.componentRef.setInput('loading', true);
    type('abc');
    expect(q('.ngx-autocomplete__spinner')).not.toBeNull();
    expect(q('.ngx-autocomplete__clear')).toBeNull();
    expect(q('.ngx-autocomplete__loading-text')!.textContent).toContain('Buscando...');
    expect(q('.ngx-autocomplete__empty')).toBeNull();
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('noResultsText', 'Nada');
    render();
    expect(q('.ngx-autocomplete__empty')!.textContent).toContain('Nada');
  });

  it('emits searchChange at once with debounceMs 0, and "" on clear', () => {
    const { cmp, type, q, render } = setup({ debounceMs: 0 });
    const searches: string[] = [];
    cmp.searchChange.subscribe((s) => searches.push(s));
    type('mad');
    expect(searches).toEqual(['mad']);
    cmp.onOptionSelect(OPTIONS[0]);
    render();
    q('.ngx-autocomplete__clear')!.dispatchEvent(new Event('mousedown'));
    expect(searches).toEqual(['mad', '']);
  });

  it('a pending search is cancelled on destroy', () => {
    vi.useFakeTimers();
    const { fixture, cmp, type } = setup({ debounceMs: 100 });
    const searches: string[] = [];
    cmp.searchChange.subscribe((s) => searches.push(s));
    type('m');
    fixture.destroy();
    vi.advanceTimersByTime(200);
    expect(searches).toEqual([]);
  });

  it('options that arrive after the value fill in its label', () => {
    const { fixture, cmp, native, render } = setup({ options: [] });
    cmp.writeValue('agp');
    render();
    expect(native.value).toBe('');
    fixture.componentRef.setInput('options', OPTIONS);
    render();
    expect(native.value).toBe('Málaga');
    cmp.writeValue(null);
    render();
    expect(native.value).toBe('');
  });

  it('floating label, hint and error', () => {
    const { fixture, q, native, focus, render } = setup({
      label: 'Ciudad',
      floatingLabel: true,
      hint: 'Escribe una ciudad',
      size: 'lg',
    });
    const float = () => q('.ngx-autocomplete__float-label')!;
    expect(float().className).not.toContain('--active');
    expect(native.placeholder).toBe('');
    expect(native.getAttribute('aria-describedby')).toBe(q('.ngx-autocomplete__message--hint')!.id);
    focus();
    expect(float().className).toContain('ngx-autocomplete__float-label--active');
    expect(float().className).toContain('ngx-autocomplete__float-label--focused');
    expect(q('.ngx-autocomplete__field')!.className).toContain('ngx-autocomplete__field--lg');
    fixture.componentRef.setInput('errorMessage', 'Obligatoria');
    render();
    expect(float().className).toContain('ngx-autocomplete__float-label--error');
    expect(native.getAttribute('aria-invalid')).toBe('true');
    expect(q('.ngx-autocomplete__message--hint')).toBeNull();
    expect(q('.ngx-autocomplete__message--error')!.textContent!.trim()).toBe('Obligatoria');
  });
});
