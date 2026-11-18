import { TestBed } from '@angular/core/testing';
import { UserMenuComponent } from './user-menu.component';
import { UserMenuAction } from './user-menu.types';

const ACTIONS: UserMenuAction[] = [
  { id: 'profile', label: 'Perfil' },
  { id: 'billing', label: 'Facturación', disabled: true },
  { id: 'logout', label: 'Salir', separator: true },
];

describe('UserMenuComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(UserMenuComponent);
    fixture.componentRef.setInput('user', { name: 'Ana Ruiz', email: 'ana@example.com' });
    fixture.componentRef.setInput('actions', ACTIONS);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const el = fixture.nativeElement as HTMLElement;
    const clicked: string[] = [];
    cmp.actionClick.subscribe((a) => clicked.push(a.id));
    const click = (target: HTMLElement) => {
      target.click();
      fixture.detectChanges();
    };
    const openMenu = () => click(el.querySelector<HTMLElement>('.popover__trigger')!);
    const action = (label: string) =>
      Array.from(el.querySelectorAll<HTMLElement>('ngx-ds-menu-button')).find((b) =>
        b.textContent?.includes(label),
      )!;
    return { el, clicked, click, openMenu, action };
  }

  it('labels the trigger with the user name', () => {
    const { el } = setup();
    expect(el.querySelector('.um__trigger .um__sr-only')?.textContent?.trim()).toBe('Ana Ruiz');
    expect(el.querySelector('.um__panel')).toBeNull();
  });

  it('shows name, email and actions when opened', () => {
    const { el, openMenu } = setup();
    openMenu();
    expect(el.querySelector('.um__name')?.textContent).toContain('Ana Ruiz');
    expect(el.querySelector('.um__email')?.textContent).toContain('ana@example.com');
    expect(el.querySelectorAll('ngx-ds-menu-button').length).toBe(3);
  });

  it('emits the action and closes the panel', () => {
    const { el, clicked, click, openMenu, action } = setup();
    openMenu();
    click(action('Salir'));
    expect(clicked).toEqual(['logout']);
    expect(el.querySelector('.um__panel')).toBeNull();
  });

  it('ignores disabled actions and stays open', () => {
    const { el, clicked, click, openMenu, action } = setup();
    openMenu();
    click(action('Facturación'));
    expect(clicked).toEqual([]);
    expect(el.querySelector('.um__panel')).not.toBeNull();
  });
});
