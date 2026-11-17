import { TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';

const classesOf = (x: Element | string) =>
  (typeof x === 'string' ? x.split(' ') : [...x.classList]).sort();

describe('AvatarComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(AvatarComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { el, root: el.querySelector('.avatar')! };
  }

  it('shows up to two uppercase initials with the color class', () => {
    const { el, root } = setup({ initials: 'jdp', color: 'success' });
    expect(el.querySelector('.avatar__initials')?.textContent).toBe('JD');
    expect(el.querySelector('img')).toBeNull();
    expect(classesOf(root)).toEqual(classesOf('avatar avatar--md avatar--circle avatar--success'));
  });

  it('renders the image and drops the color class', () => {
    const { el, root } = setup({ src: 'a.png', alt: 'Ana', size: 'lg', shape: 'square' });
    const img = el.querySelector('img')!;
    expect(img.getAttribute('src')).toBe('a.png');
    expect(img.alt).toBe('Ana');
    expect(el.querySelector('.avatar__initials')).toBeNull();
    expect(classesOf(root)).toEqual(classesOf('avatar avatar--lg avatar--square'));
  });

  it('renders the status dot and the bordered modifier', () => {
    const { el, root } = setup({ status: 'busy', bordered: true });
    const dot = el.querySelector('.avatar__status')!;
    expect(dot.classList).toContain('avatar__status--busy');
    expect(dot.getAttribute('aria-hidden')).toBe('true');
    expect(root.classList).toContain('avatar--bordered');
  });

  it('has no status dot by default', () => {
    expect(setup().el.querySelector('.avatar__status')).toBeNull();
  });
});
