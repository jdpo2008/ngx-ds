import { TestBed } from '@angular/core/testing';
import { MenuItem } from '../../molecules/menu/menu.types';
import { ContextMenuComponent } from './context-menu.component';

const ITEMS: MenuItem[] = [
  { id: 'copy', label: 'Copiar' },
  { id: 'paste', label: 'Pegar' },
];

describe('ContextMenuComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ContextMenuComponent);
    for (const [k, v] of Object.entries({ items: ITEMS, ...inputs })) {
      fixture.componentRef.setInput(k, v);
    }
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const el = fixture.nativeElement as HTMLElement;
    const events: string[] = [];
    cmp.opened.subscribe(() => events.push('opened'));
    cmp.closed.subscribe(() => events.push('closed'));
    cmp.itemClick.subscribe((i) => events.push(`click:${i.id}`));
    const openAt = (x: number, y: number) => {
      const ev = new MouseEvent('contextmenu', {
        clientX: x,
        clientY: y,
        bubbles: true,
        cancelable: true,
      });
      el.querySelector('.ctx')!.dispatchEvent(ev);
      fixture.detectChanges();
      return ev;
    };
    return { fixture, cmp, el, events, openAt };
  }

  it('opens at the pointer position and prevents the native menu', () => {
    const { cmp, el, events, openAt } = setup();
    const ev = openAt(40, 60);
    expect(ev.defaultPrevented).toBe(true);
    expect(cmp.isOpen()).toBe(true);
    expect(cmp.posX()).toBe(40);
    expect(cmp.posY()).toBe(60);
    expect(el.querySelectorAll('[role="menuitem"]').length).toBe(2);
    expect(events).toEqual(['opened']);
  });

  it('does not open when disabled', () => {
    const { cmp, openAt } = setup({ disabled: true });
    openAt(10, 10);
    expect(cmp.isOpen()).toBe(false);
  });

  it('emits itemClick and closes when an item is chosen', () => {
    const { fixture, cmp, el, events, openAt } = setup();
    openAt(10, 10);
    el.querySelectorAll<HTMLElement>('[role="menuitem"]')[1].click();
    fixture.detectChanges();
    expect(events).toEqual(['opened', 'click:paste', 'closed']);
    expect(cmp.isOpen()).toBe(false);
    expect(el.querySelector('.ctx__panel')).toBeNull();
  });

  it('closes with Escape', () => {
    const { cmp, events, openAt } = setup();
    openAt(10, 10);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(cmp.isOpen()).toBe(false);
    expect(events.filter((e) => e === 'closed').length).toBe(1);
  });

  it('closes on click outside', () => {
    const { cmp, openAt } = setup();
    openAt(10, 10);
    document.body.click();
    expect(cmp.isOpen()).toBe(false);
  });
});

describe('ContextMenuComponent behaviour', () => {
  function setup() {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const fixture = TestBed.createComponent(ContextMenuComponent);
    fixture.componentRef.setInput('items', ITEMS);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    document.body.appendChild(el);
    const openAt = (x: number, y: number) => {
      el.querySelector('.ctx')!.dispatchEvent(
        new MouseEvent('contextmenu', { clientX: x, clientY: y, bubbles: true, cancelable: true }),
      );
      fixture.detectChanges();
    };
    const cleanup = () => {
      trigger.remove();
      el.remove();
    };
    return { fixture, cmp: fixture.componentInstance, el, trigger, openAt, cleanup };
  }

  it('returns focus to the original element after reopening in place', () => {
    const { cmp, el, trigger, openAt, cleanup } = setup();
    openAt(10, 10);
    el.querySelector<HTMLElement>('[role="menuitem"]')!.focus();
    openAt(20, 20);
    cmp.close();
    expect(document.activeElement).toBe(trigger);
    cleanup();
  });

  it('restores focus after Escape', () => {
    const { cmp, trigger, openAt, cleanup } = setup();
    openAt(10, 10);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(cmp.isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);
    cleanup();
  });

  const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

  it('focuses the first item once the panel is visible', async () => {
    const { fixture, el, openAt, cleanup } = setup();
    let visibleWhenFocused: boolean | null = null;
    el.addEventListener('focusin', (e) => {
      const panel = (e.target as HTMLElement).closest('.ctx__panel');
      if (panel) visibleWhenFocused ??= panel.classList.contains('ctx__panel--visible');
    });
    openAt(10, 10);
    await nextFrame();
    await fixture.whenStable();
    expect(document.activeElement).toBe(el.querySelector('[role="menuitem"]'));
    expect(visibleWhenFocused).toBe(true);
    cleanup();
  });

  it('opens from the keyboard below the focused target', () => {
    const { fixture, el, cleanup } = setup();
    const target = document.createElement('div');
    target.tabIndex = 0;
    el.querySelector('.ctx')!.appendChild(target);
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(30, 50, 100, 20) /* left 30, top 50, bottom 70 */,
    );
    target.focus();
    // Shift+F10 / the ContextMenu key: a contextmenu event with no pointer position.
    target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.isOpen()).toBe(true);
    const panel = el.querySelector<HTMLElement>('.ctx__panel')!;
    expect(panel.style.left).toBe('30px');
    expect(panel.style.top).toBe('70px');
    cleanup();
  });

  it('closes on Tab and restores focus without blocking the focus move', () => {
    const { fixture, cmp, el, trigger, openAt, cleanup } = setup();
    openAt(10, 10);
    const item = el.querySelector<HTMLElement>('[role="menuitem"]')!;
    item.focus();
    const ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    item.dispatchEvent(ev);
    fixture.detectChanges();
    expect(cmp.isOpen()).toBe(false);
    expect(ev.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(trigger);
    cleanup();
  });

  it('places the panel at the pointer', () => {
    const { el, openAt, cleanup } = setup();
    openAt(40, 60);
    const panel = el.querySelector<HTMLElement>('.ctx__panel')!;
    expect(panel.style.left).toBe('40px');
    expect(panel.style.top).toBe('60px');
    cleanup();
  });
});
