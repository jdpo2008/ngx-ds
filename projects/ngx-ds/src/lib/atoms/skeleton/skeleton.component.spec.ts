import { TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

const classesOf = (x: Element | string) =>
  (typeof x === 'string' ? x.split(' ') : [...x.classList]).sort();

describe('SkeletonComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SkeletonComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('div'));
  }

  it('renders one animated rect with the given size', () => {
    const lines = setup({ width: '4rem', height: '2rem' });
    expect(lines.length).toBe(1);
    expect(classesOf(lines[0])).toEqual(classesOf('skeleton skeleton--rect skeleton--animated'));
    expect(lines[0].style.width).toBe('4rem');
    expect(lines[0].style.height).toBe('2rem');
  });

  it('renders text lines with a shorter last line', () => {
    const lines = setup({ variant: 'text', lines: 3, animated: false });
    expect(lines.length).toBe(3);
    expect(classesOf(lines[0])).toEqual(classesOf('skeleton skeleton--text'));
    expect(lines.map((l) => l.style.width)).toEqual(['100%', '100%', '65%']);
    expect(lines[0].style.height).toBe('0.875rem');
  });

  it('renders at least one line', () => {
    expect(setup({ lines: 0 }).length).toBe(1);
  });
});
