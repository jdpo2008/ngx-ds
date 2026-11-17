import { TestBed } from '@angular/core/testing';
import { NGX_DS_LABELS_EN, provideNgxDsLabels } from '../../shared/labels';
import { ProgressBarComponent } from './progress-bar.component';

const classesOf = (x: Element | string) =>
  (typeof x === 'string' ? x.split(' ') : [...x.classList]).sort();

describe('ProgressBarComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ProgressBarComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return {
      el,
      track: el.querySelector<HTMLElement>('[role="progressbar"]')!,
      bar: el.querySelector<HTMLElement>('.progress__bar')!,
    };
  }

  it('exposes progressbar semantics with a translated default label', () => {
    const { track, el } = setup({ value: 30 });
    expect(track.getAttribute('aria-valuenow')).toBe('30');
    expect(track.getAttribute('aria-valuemin')).toBe('0');
    expect(track.getAttribute('aria-valuemax')).toBe('100');
    expect(track.getAttribute('aria-label')).toBe('Progreso');
    expect(el.querySelector('.progress__header')).toBeNull();
  });

  it('uses the English default label when provided', () => {
    TestBed.configureTestingModule({ providers: [provideNgxDsLabels(NGX_DS_LABELS_EN)] });
    expect(setup().track.getAttribute('aria-label')).toBe('Progress');
  });

  it('computes the width relative to max and clamps it', () => {
    const { bar, el } = setup({ value: 25, max: 50, showValue: true, label: 'Subida' });
    expect(bar.style.width).toBe('50%');
    expect(el.querySelector('.progress__value')?.textContent).toBe('50%');
    expect(el.querySelector('.progress__label')?.textContent).toBe('Subida');

    expect(setup({ value: 150 }).bar.style.width).toBe('100%');
    expect(setup({ value: -10 }).bar.style.width).toBe('0%');
  });

  it('drops value and width when indeterminate', () => {
    const { track, bar, el } = setup({ value: 40, showValue: true, indeterminate: true });
    expect(track.hasAttribute('aria-valuenow')).toBe(false);
    expect(bar.style.width).toBe('');
    expect(el.querySelector('.progress__value')).toBeNull();
    expect(track.classList).toContain('progress--indeterminate');
    expect(bar.classList).toContain('progress__bar--indeterminate');
  });

  it('marks animated bars as striped too', () => {
    const { bar, track } = setup({ animated: true, rounded: false, color: 'success' });
    expect(classesOf(bar)).toEqual(
      classesOf('progress__bar progress__bar--striped progress__bar--animated'),
    );
    expect(classesOf(track)).toEqual(classesOf('progress progress--md progress--success'));
  });
});
