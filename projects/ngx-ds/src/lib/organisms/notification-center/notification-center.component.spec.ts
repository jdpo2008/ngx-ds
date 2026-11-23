import { TestBed } from '@angular/core/testing';
import { NotificationCenterComponent } from './notification-center.component';
import { NgxNotification } from './notification.types';

const NOTIFS: NgxNotification[] = [
  { id: 1, type: 'info', title: 'Uno' },
  { id: 2, type: 'success', title: 'Dos', read: true },
  { id: 3, type: 'warning', title: 'Tres' },
];

describe('NotificationCenterComponent', () => {
  function setup(notifications: NgxNotification[] = NOTIFS) {
    const fixture = TestBed.createComponent(NotificationCenterComponent);
    fixture.componentRef.setInput('notifications', notifications);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const el = fixture.nativeElement as HTMLElement;
    const run = (fn: () => void) => {
      fn();
      fixture.detectChanges();
    };
    return { cmp, el, run };
  }

  it('counts unread notifications in the badge', () => {
    const { cmp, el } = setup();
    expect(cmp.unreadCount()).toBe(2);
    expect(el.querySelector('.nc__badge')?.textContent?.trim()).toBe('2');
  });

  it('caps the badge at 99+', () => {
    const many = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      type: 'info' as const,
      title: `n${i}`,
    }));
    const { cmp } = setup(many);
    expect(cmp.badgeLabel()).toBe('99+');
  });

  it('hides the badge with no unread notifications', () => {
    const { el } = setup([{ id: 1, type: 'info', title: 'x', read: true }]);
    expect(el.querySelector('.nc__badge')).toBeNull();
  });

  it('opens the panel from the bell and lists notifications', () => {
    const { cmp, el, run } = setup();
    run(() => el.querySelector<HTMLElement>('.nc__bell-wrap button')!.click());
    expect(cmp.isOpen()).toBe(true);
    expect(el.querySelector('[role="dialog"]')).not.toBeNull();
    expect(el.querySelectorAll('ngx-ds-notification-item').length).toBe(3);
  });

  it('styles danger notifications', () => {
    const { el, run, cmp } = setup([{ id: 1, type: 'danger', title: 'a' }]);
    run(() => cmp.togglePanel());
    expect(el.querySelector('.notif-item')!.classList).toContain('notif-item--danger');
  });

  it('filters to unread notifications', () => {
    const { cmp, el, run } = setup();
    run(() => cmp.togglePanel());
    run(() => cmp.setFilter('unread'));
    expect(cmp.displayedNotifications().map((n) => n.id)).toEqual([1, 3]);
    expect(el.querySelectorAll('ngx-ds-notification-item').length).toBe(2);
  });

  it('shows the empty state when nothing matches', () => {
    const { cmp, el, run } = setup([]);
    run(() => cmp.togglePanel());
    expect(cmp.isEmpty()).toBe(true);
    expect(el.querySelector('ngx-ds-empty-state')).not.toBeNull();
  });

  it('closes with Escape', () => {
    const { cmp, run } = setup();
    run(() => cmp.togglePanel());
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(cmp.isOpen()).toBe(false);
  });

  it('re-emits bulk actions', () => {
    const { cmp } = setup();
    let all = 0;
    let dismissed = 0;
    cmp.markAllRead.subscribe(() => all++);
    cmp.dismissAll.subscribe(() => dismissed++);
    cmp.onMarkAllRead();
    cmp.onDismissAll();
    expect(all).toBe(1);
    expect(dismissed).toBe(1);
  });

  it('tells assistive tech whether the panel is open', () => {
    const { cmp, el, run } = setup();
    const bell = () => el.querySelector('.nc__bell-wrap button') as HTMLButtonElement;
    expect(bell().getAttribute('aria-expanded')).toBe('false');
    run(() => cmp.togglePanel());
    expect(bell().getAttribute('aria-expanded')).toBe('true');
  });

  it('marks the selected filter tab', () => {
    const { cmp, el, run } = setup();
    run(() => cmp.togglePanel());
    const tabs = () =>
      Array.from(el.querySelectorAll('[role="tab"]'), (t) => t.getAttribute('aria-selected'));
    expect(tabs()).toEqual(['true', 'false']);
    run(() => cmp.setFilter('unread'));
    expect(tabs()).toEqual(['false', 'true']);
  });

  it('returns focus to the bell when Escape closes the panel from inside', () => {
    const { cmp, el, run } = setup();
    document.body.appendChild(el);
    run(() => cmp.togglePanel());
    (el.querySelector('.nc__panel button') as HTMLButtonElement).focus();
    run(() =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })),
    );
    expect(cmp.isOpen()).toBe(false);
    expect(document.activeElement).toBe(el.querySelector('.nc__bell-wrap button'));
    el.remove();
  });

  it('leaves focus alone when Escape is pressed with the panel closed', () => {
    const { el, run } = setup();
    document.body.appendChild(el);
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();
    run(() =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })),
    );
    expect(document.activeElement).toBe(outside);
    outside.remove();
    el.remove();
  });
});
