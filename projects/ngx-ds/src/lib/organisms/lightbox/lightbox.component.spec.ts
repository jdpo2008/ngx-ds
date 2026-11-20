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

  it('closes on a click around the image', () => {
    const { el, cmp, closedCount } = setup();
    (el.querySelector('figure') as HTMLElement).click();
    expect(cmp.open()).toBe(false);
    expect(closedCount()).toBe(1);
  });

  it('does not emit closed on Escape while already closed', () => {
    const { closedCount } = setup({ open: false });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(closedCount()).toBe(0);
  });

  it('unlocks the page scroll when closed', () => {
    const { fixture, el } = setup();
    expect(document.body.style.overflow).toBe('hidden');
    (el.querySelector('.lightbox__close') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(document.body.style.overflow).toBe('');
  });

  it('disables next at the last image without loop', () => {
    const { el, cmp } = setup({ loop: false, index: 2 });
    expect((el.querySelector('.lightbox__nav--next') as HTMLButtonElement).disabled).toBe(true);
    cmp.next();
    expect(cmp.index()).toBe(2);
  });

  it('clamps an out-of-range index', () => {
    const { el, cmp } = setup({ index: 9 });
    expect(cmp.current()).toBe(2);
    expect(el.querySelector('img')?.getAttribute('src')).toBe('c.jpg');
  });

  it('renders no caption when the item has none', () => {
    const { el } = setup({ index: 1 });
    expect(el.querySelector('figcaption')).toBeNull();
  });

  it('ignores other keys without preventing their default', () => {
    const { el, cmp } = setup();
    const ev = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    el.querySelector('[role="dialog"]')!.dispatchEvent(ev);
    expect(cmp.index()).toBe(0);
    expect(ev.defaultPrevented).toBe(false);
  });

  describe('swipe', () => {
    function pointer(target: Element, type: string, clientX: number, init: MouseEventInit = {}) {
      const ev = new MouseEvent(type, { clientX, bubbles: true, ...init });
      Object.defineProperty(ev, 'pointerType', { value: init.button ? 'mouse' : 'touch' });
      target.dispatchEvent(ev);
    }
    const swipe = (el: HTMLElement, from: number, to: number) => {
      const img = el.querySelector('img')!;
      pointer(img, 'pointerdown', from);
      pointer(el.querySelector('.lightbox')!, 'pointerup', to);
    };

    it('goes to the next image on a left swipe and back on a right swipe', () => {
      const { el, cmp } = setup();
      swipe(el, 300, 200);
      expect(cmp.index()).toBe(1);
      swipe(el, 200, 300);
      expect(cmp.index()).toBe(0);
    });

    it('ignores short drags', () => {
      const { el, cmp } = setup();
      swipe(el, 300, 280);
      expect(cmp.index()).toBe(0);
    });

    it('ignores pointerup without a pointerdown and after a cancel', () => {
      const { el, cmp } = setup();
      const box = el.querySelector('.lightbox')!;
      pointer(box, 'pointerup', 0);
      pointer(box, 'pointerdown', 300);
      box.dispatchEvent(new MouseEvent('pointercancel', { bubbles: true }));
      pointer(box, 'pointerup', 100);
      expect(cmp.index()).toBe(0);
    });

    it('ignores secondary mouse buttons', () => {
      const { el, cmp } = setup();
      const box = el.querySelector('.lightbox')!;
      pointer(box, 'pointerdown', 300, { button: 2 });
      pointer(box, 'pointerup', 100);
      expect(cmp.index()).toBe(0);
    });

    it('does not close when a swipe ends on the backdrop', () => {
      const { el, cmp } = setup();
      const box = el.querySelector('.lightbox') as HTMLElement;
      swipe(el, 300, 200);
      // Browsers fire click on the common ancestor of pointerdown and pointerup.
      box.click();
      expect(cmp.open()).toBe(true);
    });

    it('closes on the next real backdrop click after a swipe', () => {
      const { el, cmp } = setup();
      const box = el.querySelector('.lightbox') as HTMLElement;
      swipe(el, 300, 200); // touch swipe: no click follows
      pointer(box, 'pointerdown', 10);
      pointer(box, 'pointerup', 10);
      box.click();
      expect(cmp.open()).toBe(false);
    });
  });

  it('hides the navigation for a single image', () => {
    const { fixture, el } = setup();
    fixture.componentRef.setInput('items', [ITEMS[0]]);
    fixture.detectChanges();
    expect(el.querySelector('.lightbox__nav')).toBeNull();
    expect(el.querySelector('.lightbox__counter')).toBeNull();
  });
});
