import { TestBed } from '@angular/core/testing';
import { SplitterComponent } from './splitter.component';

describe('SplitterComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SplitterComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const handle = el.querySelector<HTMLElement>('[role="separator"]')!;
    const press = (key: string) => {
      handle.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true }));
      fixture.detectChanges();
    };
    return { fixture, cmp: fixture.componentInstance, el, handle, press };
  }

  it('exposes an accessible separator tied to the first pane', () => {
    const { el, handle, cmp } = setup();
    const pane = el.querySelector('.splitter__pane')!;
    expect(handle.getAttribute('tabindex')).toBe('0');
    expect(handle.getAttribute('aria-label')).toBe(cmp.i18n.resizePanels);
    expect(handle.getAttribute('aria-orientation')).toBe('vertical');
    expect(handle.getAttribute('aria-controls')).toBe(pane.id);
    expect(handle.getAttribute('aria-valuenow')).toBe('50');
    expect(handle.getAttribute('aria-valuemin')).toBe('10');
    expect(handle.getAttribute('aria-valuemax')).toBe('90');
  });

  it('lays out the panes with the size as grid tracks', () => {
    const { el, fixture } = setup({ size: 30 });
    const grid = el.querySelector<HTMLElement>('.splitter')!;
    expect(grid.style.gridTemplateColumns).toContain('30fr');
    expect(grid.style.gridTemplateColumns).toContain('70fr');
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.detectChanges();
    expect(grid.style.gridTemplateRows).toContain('30fr');
    expect(grid.style.gridTemplateColumns).toBe('');
  });

  it('resizes with arrows, Home and End and clamps to min/max', () => {
    const { cmp, press, handle } = setup({ step: 10 });
    const ends: number[] = [];
    cmp.resizeEnd.subscribe((v) => ends.push(v));
    press('ArrowRight');
    expect(cmp.size()).toBe(60);
    press('ArrowLeft');
    press('ArrowLeft');
    expect(cmp.size()).toBe(40);
    press('ArrowUp'); // ignored in horizontal
    expect(cmp.size()).toBe(40);
    press('End');
    press('ArrowRight');
    expect(cmp.size()).toBe(90);
    press('Home');
    expect(cmp.size()).toBe(10);
    expect(handle.getAttribute('aria-valuenow')).toBe('10');
    expect(ends).toEqual([60, 50, 40, 90, 90, 10]);
  });

  it('uses Up/Down when vertical', () => {
    const { cmp, press, handle } = setup({ orientation: 'vertical' });
    expect(handle.getAttribute('aria-orientation')).toBe('horizontal');
    press('ArrowDown');
    expect(cmp.size()).toBe(55);
    press('ArrowLeft');
    expect(cmp.size()).toBe(55);
  });

  it('Enter collapses the first pane and restores it', () => {
    const { cmp, press } = setup({ size: 35 });
    press('Enter');
    expect(cmp.size()).toBe(10);
    press('Enter');
    expect(cmp.size()).toBe(35);
  });

  it('ignores the keyboard and leaves the tab order when disabled', () => {
    const { cmp, press, handle } = setup({ disabled: true });
    expect(handle.getAttribute('tabindex')).toBeNull();
    expect(handle.getAttribute('aria-disabled')).toBe('true');
    press('ArrowRight');
    expect(cmp.size()).toBe(50);
  });

  it('drags to a pointer position', () => {
    const { cmp, el, handle, fixture } = setup();
    el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 1000, height: 400 }) as DOMRect;
    Object.defineProperty(handle, 'offsetWidth', { value: 0 });
    const ends: number[] = [];
    cmp.resizeEnd.subscribe((v) => ends.push(v));
    const fire = (type: string, clientX: number) =>
      handle.dispatchEvent(
        Object.assign(new MouseEvent(type, { clientX, button: 0, cancelable: true }), {
          pointerId: 1,
          pointerType: 'mouse',
        }),
      );
    fire('pointerdown', 500);
    fixture.detectChanges();
    expect(el.querySelector('.splitter--dragging')).not.toBeNull();
    fire('pointermove', 250);
    expect(cmp.size()).toBe(25);
    fire('pointermove', 990);
    expect(cmp.size()).toBe(90);
    fire('pointerup', 990);
    fixture.detectChanges();
    expect(el.querySelector('.splitter--dragging')).toBeNull();
    expect(ends).toEqual([90]);
  });
});
