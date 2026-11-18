import { TestBed } from '@angular/core/testing';
import { LightboxComponent } from './lightbox.component';
import { CarouselItem } from '../carousel/carousel.types';

const ITEMS: CarouselItem[] = [
  { src: 'a.jpg', alt: 'A', caption: 'First' },
  { src: 'b.jpg', alt: 'B' },
  { src: 'c.jpg', alt: 'C' },
];

describe('LightboxComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(LightboxComponent);
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('open', true);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const cmp = fixture.componentInstance;
    let closed = 0;
    cmp.closed.subscribe(() => closed++);
    return { fixture, cmp, el, closedCount: () => closed };
  }

  it('renders nothing while closed', () => {
    const { el } = setup({ open: false });
    expect(el.querySelector('[role="dialog"]')).toBeNull();
  });

  it('shows the image, caption and counter in a modal dialog and locks scroll', () => {
    const { fixture, el, cmp } = setup();
    const dialog = el.querySelector('[role="dialog"]')!;
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toBe(cmp.i18n.lightbox);
    expect(el.querySelector('img')?.getAttribute('alt')).toBe('A');
    expect(el.querySelector('figcaption')?.textContent).toContain('First');
    expect(el.querySelector('.lightbox__counter')?.textContent).toContain(cmp.i18n.slideOf(1, 3));
    expect(document.body.style.overflow).toBe('hidden');
    fixture.destroy();
    expect(document.body.style.overflow).toBe('');
  });

  it('navigates with the buttons and the arrow keys', () => {
    const { fixture, cmp, el } = setup();
    (el.querySelector('.lightbox__nav--next') as HTMLButtonElement).click();
    expect(cmp.index()).toBe(1);
    const dialog = el.querySelector('[role="dialog"]')!;
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(cmp.index()).toBe(2);
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(cmp.index()).toBe(0);
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();
    expect(cmp.index()).toBe(2);
    expect(el.querySelector('img')?.getAttribute('src')).toBe('c.jpg');
  });

  it('stops at the ends without loop', () => {
    const { el, cmp } = setup({ loop: false });
    expect((el.querySelector('.lightbox__nav--prev') as HTMLButtonElement).disabled).toBe(true);
    cmp.prev();
    expect(cmp.index()).toBe(0);
  });

  it('closes with the close button, Escape and a backdrop click', () => {
    const a = setup();
    (a.el.querySelector('.lightbox__close') as HTMLButtonElement).click();
    expect(a.cmp.open()).toBe(false);
    expect(a.closedCount()).toBe(1);

    const b = setup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(b.cmp.open()).toBe(false);

    const c = setup();
    (c.el.querySelector('img') as HTMLElement).click();
    expect(c.cmp.open()).toBe(true);
    (c.el.querySelector('.lightbox') as HTMLElement).click();
    expect(c.cmp.open()).toBe(false);
  });

  it('hides the navigation for a single image', () => {
    const { fixture, el } = setup();
    fixture.componentRef.setInput('items', [ITEMS[0]]);
    fixture.detectChanges();
    expect(el.querySelector('.lightbox__nav')).toBeNull();
    expect(el.querySelector('.lightbox__counter')).toBeNull();
  });
});
