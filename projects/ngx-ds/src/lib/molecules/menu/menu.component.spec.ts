import { TestBed } from '@angular/core/testing';
import { Copy, Trash } from 'lucide-angular';
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
    expect(btns[1].disabled).toBe(true);
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

  it('moves focus with arrows, skipping disabled items and wrapping', () => {
    const { cmp, buttons, key } = setup();
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
});
