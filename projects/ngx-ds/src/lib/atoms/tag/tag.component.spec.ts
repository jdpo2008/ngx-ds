import { TestBed } from '@angular/core/testing';
import { LucideStar as Star } from '@lucide/angular';
import { TagComponent } from './tag.component';

const classesOf = (x: Element | string) =>
  (typeof x === 'string' ? x.split(' ') : [...x.classList]).sort();

describe('TagComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TagComponent);
    fixture.componentRef.setInput('label', 'Angular');
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { cmp: fixture.componentInstance, el, root: el.querySelector('.tag')! };
  }

  it('renders the label with the default classes', () => {
    const { el, root } = setup();
    expect(el.querySelector('.tag__label')?.textContent).toBe('Angular');
    expect(classesOf(root)).toEqual(classesOf('tag tag--soft tag--md tag--primary tag--rounded'));
    expect(el.querySelector('.tag__dismiss')).toBeNull();
  });

  it('renders icons sized by the tag size', () => {
    const { el, root } = setup({ iconLeft: Star, size: 'sm', rounded: false, variant: 'solid' });
    const icon = el.querySelector('ngx-ds-icon.tag__icon')!;
    expect(icon.querySelector('svg')?.getAttribute('width')).toBe('12');
    expect(classesOf(root)).toEqual(classesOf('tag tag--solid tag--sm tag--primary'));
  });

  it('emits dismissed from a labelled remove button', () => {
    const { cmp, el } = setup({ dismissible: true });
    const spy = vi.fn();
    cmp.dismissed.subscribe(spy);
    const btn = el.querySelector<HTMLButtonElement>('.tag__dismiss')!;
    expect(btn.getAttribute('aria-label')).toBe('Eliminar Angular');
    btn.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('TagComponent behaviour', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TagComponent);
    fixture.componentRef.setInput('label', 'Angular');
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('places the left icon before the label and the right icon after it, hidden from AT', () => {
    const { el } = setup({ iconLeft: Star, iconRight: Star });
    const parts = Array.from(el.querySelector('.tag')!.children).map((c) => c.className);
    expect(parts).toEqual(['tag__icon', 'tag__label', 'tag__icon']);
    el.querySelectorAll('ngx-ds-icon').forEach((i) =>
      expect(i.getAttribute('aria-hidden')).toBe('true'),
    );
  });

  it('keeps the remove button name in sync with the label', () => {
    const { fixture, el } = setup({ dismissible: true });
    fixture.componentRef.setInput('label', 'React');
    fixture.detectChanges();
    expect(el.querySelector('.tag__label')?.textContent).toBe('React');
    expect(el.querySelector('.tag__dismiss')?.getAttribute('aria-label')).toBe('Eliminar React');
    expect(el.querySelector('.tag__dismiss')?.getAttribute('type')).toBe('button');
  });

  it('applies each color and variant class', () => {
    const { el } = setup({ color: 'warning', variant: 'outline', size: 'lg' });
    const cls = el.querySelector('.tag')!.classList;
    expect(cls).toContain('tag--warning');
    expect(cls).toContain('tag--outline');
    expect(cls).toContain('tag--lg');
  });
});
