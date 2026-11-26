import { TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { LucidePanelLeftOpen as PanelLeftOpen } from '@lucide/angular';
import { SidebarItem, SidebarSection } from './sidebar.types';

const SECTIONS: SidebarSection[] = [
  {
    id: 'main',
    title: 'Principal',
    items: [
      { id: 'home', label: 'Inicio' },
      { id: 'reports', label: 'Informes', badge: 3 },
      { id: 'admin', label: 'Admin', disabled: true },
    ],
  },
];

describe('SidebarComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SidebarComponent);
    for (const [k, v] of Object.entries({ sections: SECTIONS, ...inputs })) {
      fixture.componentRef.setInput(k, v);
    }
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const el = fixture.nativeElement as HTMLElement;
    const clicked: SidebarItem[] = [];
    cmp.itemClick.subscribe((i) => clicked.push(i));
    const items = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.sidebar__item'));
    return { fixture, cmp, el, clicked, items };
  }

  it('renders section titles and items', () => {
    const { el, items } = setup();
    expect(el.querySelector('.sidebar__section-title')?.textContent).toContain('Principal');
    expect(items().length).toBe(3);
    expect(el.querySelectorAll('ngx-ds-badge').length).toBe(1);
  });

  it('marks the active item with aria-current', () => {
    const { items } = setup({ activeId: 'reports' });
    expect(items().map((i) => i.getAttribute('aria-current'))).toEqual([null, 'page', null]);
  });

  it('emits itemClick for enabled items only', () => {
    const { cmp, clicked, items } = setup();
    items()[0].click();
    expect(items()[2].disabled).toBe(true);
    cmp.onItemClick(SECTIONS[0].items[2]);
    expect(clicked.map((i) => i.id)).toEqual(['home']);
  });

  it('toggles the collapsed state from the toggle button', () => {
    const { fixture, cmp, el } = setup({ collapsible: true });
    el.querySelector<HTMLElement>('.sidebar__toggle button')!.click();
    fixture.detectChanges();
    expect(cmp.collapsed()).toBe(true);
    expect(el.querySelector('nav')?.classList).toContain('sidebar--collapsed');
  });

  it('omits the toggle when not collapsible', () => {
    const { el } = setup({ collapsible: false });
    expect(el.querySelector('.sidebar__toggle')).toBeNull();
  });
});

describe('SidebarComponent behaviour', () => {
  const ICON_SECTIONS: SidebarSection[] = [
    { items: [{ id: 'home', label: 'Inicio', icon: PanelLeftOpen }] },
  ];

  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SidebarComponent);
    for (const [k, v] of Object.entries({ sections: ICON_SECTIONS, ...inputs })) {
      fixture.componentRef.setInput(k, v);
    }
    fixture.detectChanges();
    return { fixture, cmp: fixture.componentInstance, el: fixture.nativeElement as HTMLElement };
  }

  it('hides item icons from assistive tech', () => {
    const { el } = setup();
    expect(el.querySelector('.sidebar__item-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('reports the expanded state on the toggle', () => {
    const { fixture, el } = setup({ collapsible: true });
    const btn = () => el.querySelector<HTMLElement>('.sidebar__toggle button')!;
    expect(btn().getAttribute('aria-expanded')).toBe('true');
    btn().click();
    fixture.detectChanges();
    expect(btn().getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps the item label as accessible name when collapsed', () => {
    const { el } = setup({ collapsed: true });
    expect(el.querySelector('.sidebar__item')?.textContent).toContain('Inicio');
  });

  it('uses a custom aria-label for the nav', () => {
    const { el } = setup({ ariaLabel: 'Menú' });
    expect(el.querySelector('nav')?.getAttribute('aria-label')).toBe('Menú');
  });

  it('shows string badges as labels', () => {
    const { el } = setup({ sections: [{ items: [{ id: 'a', label: 'A', badge: 'Nuevo' }] }] });
    expect(el.querySelector('ngx-ds-badge')?.textContent).toContain('Nuevo');
  });
});
