import { TestBed } from '@angular/core/testing';
import { LucideCopy as Copy, LucideTrash as Trash } from '@lucide/angular';
import { MenuComponent } from './menu.component';
import type { MenuItem } from './menu.types';

const ITEMS: MenuItem[] = [
  { id: 'copy', label: 'Copiar', icon: Copy, kbd: 'Ctrl+C' },
  { id: 'off', label: 'Desactivado', disabled: true },
  {
    id: 'more',
    label: 'Más',
    children: [
      { id: 'a', label: 'Opción A' },
      { id: 'b', label: 'Opción B' },
    ],
  },
  { id: 'del', label: 'Eliminar', icon: Trash, danger: true, separator: true },
];

describe('MenuComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.componentRef.setInput('items', ITEMS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const buttons = () =>
      Array.from(host.querySelectorAll<HTMLButtonElement>(':scope > .menu__item-wrapper > button'));
    const key = (k: string) => {
      host.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
      fixture.detectChanges();
    };
    return { fixture, cmp: fixture.componentInstance, host, buttons, key };
  }

  it('renders menu items with icons, kbd, separator and states', () => {
    const { host, buttons } = setup({ ariaLabel: 'Acciones' });
    expect(host.getAttribute('role')).toBe('menu');
    expect(host.getAttribute('aria-label')).toBe('Acciones');
    const btns = buttons();
    expect(btns.map((b) => b.querySelector('.menu__item-label')?.textContent)).toEqual([
      'Copiar',
      'Desactivado',
      'Más',
      'Eliminar',
    ]);
    expect(btns.every((b) => b.getAttribute('role') === 'menuitem')).toBe(true);
    expect(btns[0].querySelector('ngx-ds-kbd')?.textContent?.trim()).toBe('Ctrl+C');
    expect(btns[0].querySelector('.menu__item-icon svg')?.getAttribute('width')).toBe('16');
    expect(btns[1].getAttribute('aria-disabled')).toBe('true');
    expect(btns[1].disabled).toBe(false);
    expect(btns[2].getAttribute('aria-haspopup')).toBe('menu');
    expect(btns[2].getAttribute('aria-expanded')).toBe('false');
    expect(btns[3].classList).toContain('menu__item--danger');
    expect(host.querySelectorAll('ngx-ds-divider').length).toBe(1);
  });

  it('uses a roving tabindex starting at the first item', () => {
    const { buttons } = setup();
    expect(buttons().map((b) => b.getAttribute('tabindex'))).toEqual(['0', '-1', '-1', '-1']);
  });

  it('emits itemClick for leaf items', () => {
    const { cmp, buttons } = setup();
    const spy = vi.fn();
    cmp.itemClick.subscribe(spy);
    buttons()[3].click();
    expect(spy).toHaveBeenCalledWith(ITEMS[3]);
  });

  it('toggles a submenu and bubbles clicks from it', () => {
    const { fixture, cmp, host, buttons } = setup();
    const spy = vi.fn();
    cmp.itemClick.subscribe(spy);
    buttons()[2].click();
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
    expect(buttons()[2].getAttribute('aria-expanded')).toBe('true');

    const sub = host.querySelector<HTMLElement>('.menu__submenu ngx-ds-menu')!;
    sub.querySelectorAll<HTMLButtonElement>('button')[1].click();
    expect(spy).toHaveBeenCalledWith(ITEMS[2].children![1]);

    buttons()[2].click();
    fixture.detectChanges();
    expect(host.querySelector('.menu__submenu')).toBeNull();
  });

  it('moves focus with arrows through disabled items and wraps', () => {
    const { cmp, buttons, key } = setup();
    key('ArrowDown');
    expect(cmp.activeIndex()).toBe(1);
    expect(document.activeElement).toBe(buttons()[1]);
    expect(buttons()[1].getAttribute('tabindex')).toBe('0');
    key('ArrowDown');
    expect(cmp.activeIndex()).toBe(2);
    expect(document.activeElement).toBe(buttons()[2]);
    key('ArrowDown');
    expect(cmp.activeIndex()).toBe(3);
    key('ArrowDown');
    expect(cmp.activeIndex()).toBe(0);
    key('ArrowUp');
    expect(cmp.activeIndex()).toBe(3);
    key('Home');
    expect(cmp.activeIndex()).toBe(0);
    key('End');
    expect(cmp.activeIndex()).toBe(3);
  });

  it('opens a submenu with ArrowRight and emits closed on Escape', () => {
    const { cmp, host, key } = setup();
    key('ArrowDown');
    key('ArrowDown');
    key('ArrowRight');
    expect(cmp.openSubmenu()).toBe('more');
    expect(host.querySelector('.menu__submenu')).not.toBeNull();

    const spy = vi.fn();
    cmp.closed.subscribe(spy);
    key('Escape');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('MenuComponent behaviour', () => {
  function setup(items: MenuItem[] = ITEMS) {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const buttons = () =>
      Array.from(host.querySelectorAll<HTMLButtonElement>(':scope > .menu__item-wrapper > button'));
    return { fixture, cmp: fixture.componentInstance, host, buttons };
  }

  it('hides decorative icons from assistive tech', () => {
    const { host } = setup();
    const icons = host.querySelectorAll('.menu__item-icon, .menu__item-chevron');
    expect(icons.length).toBe(3);
    icons.forEach((i) => expect(i.getAttribute('aria-hidden')).toBe('true'));
  });

  it('puts the tab stop on the first enabled item when the first one is disabled', () => {
    const { buttons } = setup([
      { id: 'x', label: 'X', disabled: true },
      { id: 'y', label: 'Y' },
    ]);
    expect(buttons().map((b) => b.getAttribute('tabindex'))).toEqual(['-1', '0']);
  });

  it('names a submenu after its parent item', () => {
    const { fixture, host, buttons } = setup();
    buttons()[2].click();
    fixture.detectChanges();
    expect(host.querySelector('.menu__submenu ngx-ds-menu')?.getAttribute('aria-label')).toBe(
      'Más',
    );
  });

  it('keeps submenu keys inside the submenu', () => {
    const { fixture, cmp, host, buttons } = setup();
    const closed = vi.fn();
    cmp.closed.subscribe(closed);
    buttons()[2].click();
    fixture.detectChanges();
    const sub = host.querySelector<HTMLElement>('.menu__submenu ngx-ds-menu')!;
    const subBtn = sub.querySelector<HTMLButtonElement>('button')!;
    const docKeys = vi.fn();
    document.addEventListener('keydown', docKeys);
    subBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(cmp.activeIndex()).toBe(2);
    subBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    document.removeEventListener('keydown', docKeys);
    expect(closed).not.toHaveBeenCalled();
    expect(docKeys).not.toHaveBeenCalled();
    expect(host.querySelector('.menu__submenu')).toBeNull();
    expect(document.activeElement).toBe(buttons()[2]);
  });

  it('ignores clicks on disabled items', () => {
    const { cmp } = setup();
    const spy = vi.fn();
    cmp.itemClick.subscribe(spy);
    cmp.onItemClick(ITEMS[1], 1);
    expect(spy).not.toHaveBeenCalled();
  });

  function keydown(target: HTMLElement, key: string, init: KeyboardEventInit = {}) {
    const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(ev);
    return ev;
  }

  it('keeps disabled items focusable but does not activate them', () => {
    const { fixture, cmp, host, buttons } = setup();
    const spy = vi.fn();
    cmp.itemClick.subscribe(spy);
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(document.activeElement).toBe(buttons()[1]);
    buttons()[1].click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not close a top-level menu on ArrowLeft', () => {
    const { cmp, host } = setup();
    const closed = vi.fn();
    cmp.closed.subscribe(closed);
    const ev = keydown(host, 'ArrowLeft');
    expect(closed).not.toHaveBeenCalled();
    expect(ev.defaultPrevented).toBe(false);
    keydown(host, 'Escape');
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('closes a submenu on ArrowLeft and returns focus to its parent item', () => {
    const { fixture, cmp, host, buttons } = setup();
    const closed = vi.fn();
    cmp.closed.subscribe(closed);
    buttons()[2].click();
    fixture.detectChanges();
    const subBtn = host.querySelector<HTMLButtonElement>('.menu__submenu button')!;
    keydown(subBtn, 'ArrowLeft');
    fixture.detectChanges();
    expect(host.querySelector('.menu__submenu')).toBeNull();
    expect(document.activeElement).toBe(buttons()[2]);
    expect(closed).not.toHaveBeenCalled();
  });

  it('closes on Tab without preventing the default focus move', () => {
    const { cmp, host } = setup();
    const closed = vi.fn();
    cmp.closed.subscribe(closed);
    const ev = keydown(host, 'Tab');
    expect(closed).toHaveBeenCalledTimes(1);
    expect(ev.defaultPrevented).toBe(false);
  });

  it('closes the top-level menu on Tab from a submenu', () => {
    const { fixture, cmp, host, buttons } = setup();
    const closed = vi.fn();
    cmp.closed.subscribe(closed);
    buttons()[2].click();
    fixture.detectChanges();
    const subBtn = host.querySelector<HTMLButtonElement>('.menu__submenu button')!;
    const ev = keydown(subBtn, 'Tab');
    expect(closed).toHaveBeenCalledTimes(1);
    expect(ev.defaultPrevented).toBe(false);
  });

  it('moves focus to the next enabled item starting with a typed character', () => {
    const { fixture, cmp, host, buttons } = setup([
      { id: 'a', label: 'Abrir' },
      { id: 'b', label: 'Borrar' },
      { id: 'c', label: 'Bloquear', disabled: true },
      { id: 'd', label: 'Buscar' },
    ]);
    keydown(host, 'b');
    fixture.detectChanges();
    expect(cmp.activeIndex()).toBe(1);
    expect(document.activeElement).toBe(buttons()[1]);
    keydown(host, 'B');
    fixture.detectChanges();
    expect(cmp.activeIndex()).toBe(3);
    keydown(host, 'b');
    expect(cmp.activeIndex()).toBe(1);
    keydown(host, 'a');
    expect(cmp.activeIndex()).toBe(0);
    keydown(host, 'z');
    expect(cmp.activeIndex()).toBe(0);
    keydown(host, 'b', { ctrlKey: true });
    expect(cmp.activeIndex()).toBe(0);
  });

  it('opens a submenu with Enter and focuses its first item', async () => {
    const { fixture, host, buttons } = setup();
    document.body.appendChild(host);
    buttons()[2].focus();
    const ev = keydown(buttons()[2], 'Enter');
    expect(ev.defaultPrevented).toBe(true);
    fixture.detectChanges();
    await fixture.whenStable();
    const subBtns = () => host.querySelectorAll<HTMLButtonElement>('.menu__submenu button');
    expect(document.activeElement).toBe(subBtns()[0]);

    // Enter on the parent again keeps the submenu open and moves focus back into it.
    buttons()[2].focus();
    keydown(buttons()[2], 'Enter');
    fixture.detectChanges();
    expect(host.querySelector('.menu__submenu')).not.toBeNull();
    expect(buttons()[2].getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(subBtns()[0]);
    host.remove();
  });

  it('lets Enter on a submenu item reach that item', () => {
    const { fixture, host, buttons } = setup();
    buttons()[2].click();
    fixture.detectChanges();
    const subBtn = host.querySelector<HTMLButtonElement>('.menu__submenu button')!;
    const ev = keydown(subBtn, 'Enter');
    expect(ev.defaultPrevented).toBe(false);
  });
});
