import { TestBed } from '@angular/core/testing';
import { NGX_DS_LABELS_EN, provideNgxDsLabels } from '../../shared/labels';
import { SpinnerComponent } from './spinner.component';

const classesOf = (x: Element | string) =>
  (typeof x === 'string' ? x.split(' ') : [...x.classList]).sort();

describe('SpinnerComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SpinnerComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')!;
  }

  it('announces loading with the default classes', () => {
    const el = setup();
    expect(el.textContent?.trim()).toBe('Cargando...');
    expect(classesOf(el)).toEqual(classesOf('spinner spinner--md spinner--current'));
  });

  it('reflects size and color', () => {
    expect(classesOf(setup({ size: 'xs', color: 'danger' }))).toEqual(
      classesOf('spinner spinner--xs spinner--danger'),
    );
  });

  it('uses the English label when provided', () => {
    TestBed.configureTestingModule({ providers: [provideNgxDsLabels(NGX_DS_LABELS_EN)] });
    expect(setup().textContent?.trim()).toBe('Loading...');
  });
});

describe('SpinnerComponent behaviour', () => {
  it('puts the loading text inside the live region so screen readers announce it', () => {
    const fixture = TestBed.createComponent(SpinnerComponent);
    fixture.detectChanges();
    const status = (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')!;
    expect(status.textContent?.trim()).toBe('Cargando...');
  });
});
