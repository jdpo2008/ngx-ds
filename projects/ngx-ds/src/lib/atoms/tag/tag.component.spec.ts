import { TestBed } from '@angular/core/testing';
import { Star } from 'lucide-angular';
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
