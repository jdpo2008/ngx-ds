import { ApplicationRef, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TooltipDirective } from './tooltip.directive';

describe('TooltipDirective', () => {
  @Component({
    standalone: true,
    imports: [TooltipDirective],
    template: `
      <button [ngxTooltip]="text()" [tooltipDisabled]="disabled()" [tooltipDelay]="100">
        Ayuda
      </button>
    `,
  })
  class Host {
    text = signal('Más información');
    disabled = signal(false);
  }

  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const btn = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    const tip = () => document.body.querySelector<HTMLElement>('.ngx-tooltip');
    return { fixture, host: fixture.componentInstance, btn, tip };
  }

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    document.body.querySelectorAll('ngx-ds-tooltip-box').forEach((n) => n.remove());
  });

  it('shows after the delay on hover and removes on leave', () => {
    const { btn, tip } = setup();
    btn.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(99);
    expect(tip()).toBeNull();
    vi.advanceTimersByTime(1);
    TestBed.inject(ApplicationRef).tick();
    expect(tip()?.textContent?.trim()).toBe('Más información');
    expect(tip()?.getAttribute('role')).toBe('tooltip');

    btn.dispatchEvent(new Event('mouseleave'));
    expect(tip()).toBeNull();
  });

  it('shows on focus and cancels a pending show on blur', () => {
    const { btn, tip } = setup();
    btn.dispatchEvent(new Event('focusin'));
    vi.advanceTimersByTime(50);
    btn.dispatchEvent(new Event('focusout'));
    vi.advanceTimersByTime(100);
    expect(tip()).toBeNull();
  });

  it('does nothing when disabled or empty', () => {
    const { fixture, host, btn, tip } = setup();
    host.disabled.set(true);
    fixture.detectChanges();
    btn.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(100);
    expect(tip()).toBeNull();

    host.disabled.set(false);
    host.text.set('');
    fixture.detectChanges();
    btn.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(100);
    expect(tip()).toBeNull();
  });

  it('shows a single tooltip when hover and focus both fire', () => {
    const { btn } = setup();
    btn.dispatchEvent(new Event('focusin'));
    btn.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(100);
    expect(document.body.querySelectorAll('.ngx-tooltip').length).toBe(1);
    btn.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(100);
    expect(document.body.querySelectorAll('.ngx-tooltip').length).toBe(1);
    btn.dispatchEvent(new Event('mouseleave'));
    expect(document.body.querySelectorAll('.ngx-tooltip').length).toBe(0);
  });

  describe('positioning', () => {
    const rect = (left: number, top: number, width: number, height: number) =>
      ({ left, top, width, height, right: left + width, bottom: top + height }) as DOMRect;

    /** Host at (100, 100) 40×20, tooltip 60×10, viewport 1000×800. */
    function place(placement: string, host = rect(100, 100, 40, 20)) {
      const fixture = TestBed.createComponent(PlacedHost);
      fixture.componentInstance.placement.set(placement);
      fixture.detectChanges();
      const btn = (fixture.nativeElement as HTMLElement).querySelector('button')!;
      vi.spyOn(btn, 'getBoundingClientRect').mockReturnValue(host);
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: HTMLElement,
      ) {
        return this === btn ? host : rect(0, 0, 60, 10);
      });
      vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000);
      vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(800);
      btn.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(0);
      vi.advanceTimersByTime(20); // requestAnimationFrame
      const tip = document.body.querySelector<HTMLElement>('.ngx-tooltip')!;
      return { left: tip.style.left, top: tip.style.top };
    }

    @Component({
      standalone: true,
      imports: [TooltipDirective],
      template: `<button ngxTooltip="Tip" [tooltipPlacement]="$any(placement())" [tooltipDelay]="0">
        X
      </button>`,
    })
    class PlacedHost {
      placement = signal('top');
    }

    afterEach(() => vi.restoreAllMocks());

    it('centres above the host by default', () => {
      expect(place('top')).toEqual({ left: '90px', top: '82px' });
    });

    it('centres below the host', () => {
      expect(place('bottom')).toEqual({ left: '90px', top: '128px' });
    });

    it('sits to the left and to the right of the host', () => {
      expect(place('left')).toEqual({ left: '32px', top: '105px' });
      document.body.querySelectorAll('ngx-ds-tooltip-box').forEach((n) => n.remove());
      expect(place('right')).toEqual({ left: '148px', top: '105px' });
    });

    it('stays inside the viewport', () => {
      expect(place('top', rect(0, 0, 10, 10))).toEqual({ left: '8px', top: '8px' });
      document.body.querySelectorAll('ngx-ds-tooltip-box').forEach((n) => n.remove());
      expect(place('bottom', rect(990, 790, 10, 10))).toEqual({ left: '932px', top: '782px' });
    });

    it('skips positioning when hidden before the frame runs', () => {
      const fixture = TestBed.createComponent(PlacedHost);
      fixture.detectChanges();
      const btn = (fixture.nativeElement as HTMLElement).querySelector('button')!;
      btn.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(0);
      btn.dispatchEvent(new Event('mouseleave'));
      expect(() => vi.advanceTimersByTime(20)).not.toThrow();
      expect(document.body.querySelector('.ngx-tooltip')).toBeNull();
    });
  });

  it('cleans up when the host is destroyed', () => {
    const { fixture, btn, tip } = setup();
    btn.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(100);
    expect(tip()).not.toBeNull();
    fixture.destroy();
    expect(tip()).toBeNull();
  });
});
