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

describe('AvatarComponent accessibility', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(AvatarComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('names the initials with alt', () => {
    const { el } = setup({ initials: 'ab', alt: 'Ana Bel' });
    const initials = el.querySelector('.avatar__initials')!;
    expect(initials.getAttribute('role')).toBe('img');
    expect(initials.getAttribute('aria-label')).toBe('Ana Bel');
  });

  it('leaves the initials unnamed when there is no alt', () => {
    const { el } = setup({ initials: 'ab' });
    expect(el.querySelector('.avatar__initials')!.hasAttribute('role')).toBe(false);
  });

  it('falls back to the initials when the image fails, and retries with a new src', () => {
    const { fixture, el } = setup({ src: 'broken.png', initials: 'ab', alt: 'Ana Bel' });
    el.querySelector('img')!.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('.avatar__initials')!.textContent!.trim()).toBe('AB');
    expect(el.querySelector('.avatar')!.classList).toContain('avatar--neutral');

    fixture.componentRef.setInput('src', 'other.png');
    fixture.detectChanges();
    expect(el.querySelector('img')!.getAttribute('src')).toBe('other.png');
  });

  it('announces the status in text, not only by colour', () => {
    const { el } = setup({ initials: 'ab', status: 'busy' });
    expect(el.querySelector('.avatar__status-text')!.textContent!.trim()).toBe('Ocupado');
  });
});
