import { TestBed } from '@angular/core/testing';
import { CarouselComponent } from './carousel.component';
import { CarouselItem, stepIndex } from './carousel.types';

const ITEMS: CarouselItem[] = [
  { src: 'a.jpg', alt: 'A' },
  { src: 'b.jpg', alt: 'B', caption: 'Bee' },
  { src: 'c.jpg', alt: 'C' },
];

describe('stepIndex', () => {
  it('wraps with loop and clamps without it', () => {
    expect(stepIndex(2, 1, 3, true)).toBe(0);
    expect(stepIndex(0, -1, 3, true)).toBe(2);
    expect(stepIndex(2, 1, 3, false)).toBe(2);
    expect(stepIndex(0, -1, 3, false)).toBe(0);
    expect(stepIndex(0, 1, 0, true)).toBe(0);
  });
});

describe('CarouselComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(CarouselComponent);
    fixture.componentRef.setInput('items', ITEMS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, cmp: fixture.componentInstance, el };
  }

  it('renders one labelled group per slide and hides the inactive ones', () => {
    const { el, cmp } = setup();
    const region = el.querySelector('[role="region"]')!;
    expect(region.getAttribute('aria-roledescription')).toBe(cmp.i18n.carousel);
    const slides = el.querySelectorAll('.carousel__slide');
    expect(slides.length).toBe(3);
    expect(slides[0].getAttribute('aria-hidden')).toBeNull();
    expect(slides[1].getAttribute('aria-hidden')).toBe('true');
    expect(slides[1].hasAttribute('inert')).toBe(true);
    expect(el.querySelector('.carousel__caption')?.textContent).toContain('Bee');
  });

  it('moves with the arrows and the dots', () => {
    const { fixture, cmp, el } = setup();
    (el.querySelector('.carousel__arrow--next') as HTMLButtonElement).click();
    expect(cmp.index()).toBe(1);
    (el.querySelectorAll('.carousel__dot')[2] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(cmp.index()).toBe(2);
    expect(el.querySelectorAll('.carousel__dot')[2].getAttribute('aria-current')).toBe('true');
    expect((el.querySelector('.carousel__track') as HTMLElement).style.transform).toBe(
      'translateX(-200%)',
    );
  });

  it('wraps with loop and disables the arrows at the ends without it', () => {
    const a = setup({ index: 2 });
    a.cmp.next();
    expect(a.cmp.index()).toBe(0);

    const b = setup({ loop: false });
    const prev = b.el.querySelector('.carousel__arrow--prev') as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
    b.cmp.prev();
    expect(b.cmp.index()).toBe(0);
  });

  it('handles ArrowLeft/ArrowRight/Home/End', () => {
    const { cmp, el } = setup();
    const region = el.querySelector('[role="region"]')!;
    const key = (k: string) => region.dispatchEvent(new KeyboardEvent('keydown', { key: k }));
    key('ArrowRight');
    expect(cmp.index()).toBe(1);
    key('End');
    expect(cmp.index()).toBe(2);
    key('Home');
    expect(cmp.index()).toBe(0);
    key('ArrowLeft');
    expect(cmp.index()).toBe(2);
  });

  it('swipes with pointer events past the threshold', () => {
    const { cmp, el } = setup();
    const viewport = el.querySelector('.carousel__viewport')!;
    const pointer = (type: string, x: number) =>
      viewport.dispatchEvent(new PointerEvent(type, { clientX: x, button: 0 }));
    pointer('pointerdown', 200);
    pointer('pointerup', 190);
    expect(cmp.index()).toBe(0);
    pointer('pointerdown', 200);
    pointer('pointerup', 100);
    expect(cmp.index()).toBe(1);
    pointer('pointerdown', 100);
    pointer('pointerup', 200);
    expect(cmp.index()).toBe(0);
  });

  it('emits itemClick with the item and its index', () => {
    const { cmp, el } = setup();
    let got: { item: CarouselItem; index: number } | undefined;
    cmp.itemClick.subscribe((e) => (got = e));
    (el.querySelectorAll('.carousel__image')[0] as HTMLImageElement).click();
    expect(got).toEqual({ item: ITEMS[0], index: 0 });
  });

  describe('autoplay', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('advances every period, shows a pause button and stops while paused or hovered', () => {
      const { fixture, cmp, el } = setup({ autoplay: 1000 });
      TestBed.tick();
      vi.advanceTimersByTime(1000);
      expect(cmp.index()).toBe(1);

      fixture.detectChanges();
      const play = el.querySelector('.carousel__play') as HTMLButtonElement;
      expect(play.getAttribute('aria-label')).toBe(cmp.i18n.pauseAutoplay);
      play.click();
      TestBed.tick();
      vi.advanceTimersByTime(3000);
      expect(cmp.index()).toBe(1);

      cmp.toggleAutoplay();
      cmp.onMouseEnter();
      TestBed.tick();
      vi.advanceTimersByTime(3000);
      expect(cmp.index()).toBe(1);

      cmp.onMouseLeave();
      TestBed.tick();
      vi.advanceTimersByTime(1000);
      expect(cmp.index()).toBe(2);
    });

    it('has no pause button without autoplay', () => {
      const { el } = setup();
      expect(el.querySelector('.carousel__play')).toBeNull();
    });
  });
});
