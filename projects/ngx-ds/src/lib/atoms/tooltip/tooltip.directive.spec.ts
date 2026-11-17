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

  it('cleans up when the host is destroyed', () => {
    const { fixture, btn, tip } = setup();
    btn.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(100);
    expect(tip()).not.toBeNull();
    fixture.destroy();
    expect(tip()).toBeNull();
  });
});
