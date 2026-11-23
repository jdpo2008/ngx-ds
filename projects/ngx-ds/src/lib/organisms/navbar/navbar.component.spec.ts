import { TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { NavbarItem } from './navbar.types';

const ITEMS: NavbarItem[] = [
  { id: 'home', label: 'Inicio' },
  { id: 'docs', label: 'Docs', badge: 3 },
  { id: 'admin', label: 'Admin', disabled: true },
];

describe('NavbarComponent', () => {
  function setup(items: NavbarItem[] = ITEMS, activeId: string | null = 'docs') {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('activeId', activeId);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const render = () => fixture.detectChanges();
    const toggle = () => el.querySelector<HTMLButtonElement>('.navbar__toggle');
    const panel = () => el.querySelector('.navbar__panel');
    return { fixture, el, render, toggle, panel };
  }

  it('renders one link per item with the active one marked', () => {
    const { el } = setup();
    const links = el.querySelectorAll<HTMLButtonElement>('.navbar__nav .navbar__link');
    expect(links.length).toBe(3);
    expect(links[1].getAttribute('aria-current')).toBe('page');
    expect(links[1].classList).toContain('navbar__link--active');
    expect(links[0].getAttribute('aria-current')).toBeNull();
    expect(links[2].disabled).toBe(true);
    expect(el.querySelector('.navbar__nav')?.getAttribute('aria-label')).toBe(
      'Navegación principal',
    );
  });

  it('emits itemClick for enabled items only', () => {
    const { fixture, el } = setup();
    const clicked: string[] = [];
    fixture.componentInstance.itemClick.subscribe((i) => clicked.push(i.id));
    const links = el.querySelectorAll<HTMLButtonElement>('.navbar__nav .navbar__link');
    links[0].click();
    fixture.componentInstance.onItemClick(ITEMS[2]);
    expect(clicked).toEqual(['home']);
  });

  it('hides the nav and toggle without items', () => {
    const { el, toggle } = setup([]);
    expect(el.querySelector('.navbar__nav')).toBeNull();
    expect(toggle()).toBeNull();
  });

  it('toggles the menu panel and updates aria-expanded', () => {
    const { render, toggle, panel } = setup();
    expect(toggle()!.getAttribute('aria-expanded')).toBe('false');
    expect(toggle()!.getAttribute('aria-label')).toBe('Abrir menú');
    expect(panel()).toBeNull();

    toggle()!.click();
    render();
    expect(toggle()!.getAttribute('aria-expanded')).toBe('true');
    expect(toggle()!.getAttribute('aria-label')).toBe('Cerrar menú');
    expect(panel()).not.toBeNull();
    expect(toggle()!.getAttribute('aria-controls')).toBe(panel()!.id);
  });

  it('closes the menu when an item is clicked', () => {
    const { fixture, render, toggle, panel } = setup();
    toggle()!.click();
    render();
    panel()!.querySelector<HTMLButtonElement>('.navbar__link')!.click();
    render();
    expect(fixture.componentInstance.menuOpen()).toBe(false);
    expect(panel()).toBeNull();
  });

  it('closes the menu on Escape and returns focus to the toggle', () => {
    const { fixture, render, toggle } = setup();
    document.body.appendChild(fixture.nativeElement);
    toggle()!.click();
    render();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    render();
    expect(fixture.componentInstance.menuOpen()).toBe(false);
    expect(document.activeElement).toBe(toggle());
    fixture.nativeElement.remove();
  });

  it('closes the menu on a click outside', () => {
    const { fixture, render, toggle } = setup();
    toggle()!.click();
    render();
    document.body.click();
    render();
    expect(fixture.componentInstance.menuOpen()).toBe(false);
  });
});

describe('NavbarComponent toggle', () => {
  it('points aria-controls at the panel only while it exists', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.componentRef.setInput('items', ITEMS);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const toggle = el.querySelector<HTMLButtonElement>('.navbar__toggle')!;
    expect(toggle.getAttribute('aria-controls')).toBeNull();
    toggle.click();
    fixture.detectChanges();
    const id = toggle.getAttribute('aria-controls');
    expect(id).toBeTruthy();
    expect(el.querySelector(`#${id}`)).not.toBeNull();
  });
});
