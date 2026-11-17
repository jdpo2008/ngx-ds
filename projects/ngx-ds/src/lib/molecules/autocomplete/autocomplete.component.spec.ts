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
