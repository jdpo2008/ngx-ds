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
