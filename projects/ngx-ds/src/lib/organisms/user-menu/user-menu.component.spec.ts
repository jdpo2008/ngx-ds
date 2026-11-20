import { TestBed } from '@angular/core/testing';
import { UserMenuComponent } from './user-menu.component';
import { UserMenuAction, UserMenuUser } from './user-menu.types';

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

describe('UserMenuComponent behaviour', () => {
  function setup(user: UserMenuUser, actions: UserMenuAction[] = ACTIONS) {
    const fixture = TestBed.createComponent(UserMenuComponent);
    fixture.componentRef.setInput('user', user);
    fixture.componentRef.setInput('actions', actions);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    document.body.appendChild(el);
    const trigger = el.querySelector<HTMLButtonElement>('.um__trigger')!;
    const click = (target: HTMLElement) => {
      target.click();
      fixture.detectChanges();
    };
    return { fixture, el, trigger, click };
  }

  afterEach(() => document.body.querySelectorAll('ngx-ds-user-menu').forEach((n) => n.remove()));

  it('derives the avatar initials from the name when none are given', () => {
    const { el } = setup({ name: 'Ana María Ruiz', email: 'a@x.es' });
    expect(el.querySelector('ngx-ds-avatar')!.textContent?.trim()).toBe('AR');
  });

  it('a single-word name gives one initial; explicit initials win', () => {
    expect(
      setup({ name: 'Cher', email: 'c@x.es' })
        .el.querySelector('ngx-ds-avatar')!
        .textContent?.trim(),
    ).toBe('C');
    expect(
      setup({ name: 'Ana Ruiz', email: 'a@x.es', initials: 'zz' })
        .el.querySelector('ngx-ds-avatar')!
        .textContent?.trim(),
    ).toBe('ZZ');
  });

  it('marks the trigger as a popup and reflects whether it is open', () => {
    const { trigger, click } = setup({ name: 'Ana Ruiz', email: 'a@x.es' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('returns focus to the trigger after choosing an action', () => {
    const { el, trigger, click } = setup({ name: 'Ana Ruiz', email: 'a@x.es' });
    click(trigger);
    const btn = el.querySelector<HTMLButtonElement>('ngx-ds-menu-button button')!;
    btn.focus();
    click(btn);
    expect(el.querySelector('.um__panel')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('does not draw a divider before a leading separator action', () => {
    const { el, trigger, click } = setup({ name: 'Ana Ruiz', email: 'a@x.es' }, [
      { id: 'a', label: 'A', separator: true },
      { id: 'b', label: 'B', separator: true },
    ]);
    click(trigger);
    expect(el.querySelectorAll('.um__actions ngx-ds-divider').length).toBe(1);
  });
});
