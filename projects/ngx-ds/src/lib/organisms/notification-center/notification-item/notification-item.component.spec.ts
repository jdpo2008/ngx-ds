import { TestBed } from '@angular/core/testing';
import { NotificationItemComponent } from './notification-item.component';
import { NgxNotification } from '../notification.types';
import { NGX_DS_LOCALE } from '../../../shared/locale';

const MIN = 60_000;

describe('NotificationItemComponent', () => {
  afterEach(() => vi.useRealTimers());

  function setup(notification: NgxNotification) {
    const fixture = TestBed.createComponent(NotificationItemComponent);
    fixture.componentRef.setInput('notification', notification);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const el = fixture.nativeElement as HTMLElement;
    const root = el.querySelector('.notif-item') as HTMLElement;
    const markRead = vi.fn();
    const dismissed = vi.fn();
    const action = vi.fn();
    cmp.markRead.subscribe(markRead);
    cmp.dismissed.subscribe(dismissed);
    cmp.action.subscribe(action);
    return { fixture, cmp, el, root, markRead, dismissed, action };
  }

  const base: NgxNotification = { id: 1, type: 'info', title: 'Hola' };

  describe('rendering', () => {
    it('renders the title and the type class', () => {
      const { el, root } = setup({ ...base, type: 'warning' });
      expect(el.querySelector('.notif-item__title')?.textContent?.trim()).toBe('Hola');
      expect(root.classList).toContain('notif-item--warning');
    });

    it('marks unread items with a class and a labelled dot', () => {
      const { el, root } = setup(base);
      expect(root.classList).toContain('notif-item--unread');
      expect(el.querySelector('.notif-item__dot')?.getAttribute('aria-label')).toBe('No leída');
    });

    it('has no dot or unread class once read', () => {
      const { el, root } = setup({ ...base, read: true });
      expect(root.classList).not.toContain('notif-item--unread');
      expect(el.querySelector('.notif-item__dot')).toBeNull();
    });

    it('renders the description only when present', () => {
      expect(setup(base).el.querySelector('.notif-item__desc')).toBeNull();
      const { el } = setup({ ...base, description: 'Detalle' });
      expect(el.querySelector('.notif-item__desc')?.textContent?.trim()).toBe('Detalle');
    });

    it('renders the action button only with an actionLabel', () => {
      expect(setup(base).el.querySelector('ngx-ds-button')).toBeNull();
      const { el } = setup({ ...base, actionLabel: 'Ver' });
      expect(el.querySelector('ngx-ds-button')?.textContent?.trim()).toBe('Ver');
    });

    it('labels the dismiss button', () => {
      const { el } = setup(base);
      expect(el.querySelector('.notif-item__dismiss button')?.getAttribute('aria-label')).toBe(
        'Descartar notificación',
      );
    });
  });

  describe('relative time', () => {
    const NOW = new Date('2026-03-15T12:00:00Z');
    const ago = (ms: number) => new Date(NOW.getTime() - ms);

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(NOW);
    });

    it('is empty without a time and hides the time element', () => {
      const { cmp, el } = setup(base);
      expect(cmp.timeLabel()).toBe('');
      expect(el.querySelector('.notif-item__time')).toBeNull();
    });

    it.each([
      [30 * 1000, 'Ahora'],
      [5 * MIN, 'Hace 5 min'],
      [59 * MIN, 'Hace 59 min'],
      [3 * 60 * MIN, 'Hace 3 h'],
      [2 * 24 * 60 * MIN, 'Hace 2 d'],
    ])('formats %i ms ago as "%s"', (ms, label) => {
      const { cmp, el } = setup({ ...base, time: ago(ms) });
      expect(cmp.timeLabel()).toBe(label);
      expect(el.querySelector('.notif-item__time')?.textContent?.trim()).toBe(label);
    });

    it('falls back to a short date after a week', () => {
      const date = ago(10 * 24 * 60 * MIN);
      const { cmp } = setup({ ...base, time: date });
      expect(cmp.timeLabel()).toBe(
        date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
      );
    });

    it('uses the NGX_DS_LOCALE for that date', () => {
      TestBed.configureTestingModule({
        providers: [{ provide: NGX_DS_LOCALE, useValue: 'en-US' }],
      });
      const date = ago(10 * 24 * 60 * MIN);
      const { cmp } = setup({ ...base, time: date });
      expect(cmp.timeLabel()).toBe(
        date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      );
    });

    it('accepts an ISO string', () => {
      const { cmp } = setup({ ...base, time: ago(5 * MIN).toISOString() });
      expect(cmp.timeLabel()).toBe('Hace 5 min');
    });

    it('shows an unparseable string as is', () => {
      const { cmp } = setup({ ...base, time: 'ayer' });
      expect(cmp.timeLabel()).toBe('ayer');
    });
  });

  describe('outputs', () => {
    it('emits markRead on click when unread', () => {
      const { root, markRead } = setup(base);
      root.click();
      expect(markRead).toHaveBeenCalledWith(base);
    });

    it('emits markRead on Enter', () => {
      const { root, markRead } = setup(base);
      root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(markRead).toHaveBeenCalledTimes(1);
    });

    it('does not emit markRead when already read', () => {
      const { root, markRead } = setup({ ...base, read: true });
      root.click();
      expect(markRead).not.toHaveBeenCalled();
    });

    it('emits dismissed without marking as read', () => {
      const { el, dismissed, markRead } = setup(base);
      (el.querySelector('.notif-item__dismiss button') as HTMLElement).click();
      expect(dismissed).toHaveBeenCalledWith(base);
      expect(markRead).not.toHaveBeenCalled();
    });

    it('emits action without marking as read', () => {
      const n = { ...base, actionLabel: 'Ver' };
      const { el, action, markRead } = setup(n);
      (el.querySelector('ngx-ds-button button') as HTMLElement).click();
      expect(action).toHaveBeenCalledWith(n);
      expect(markRead).not.toHaveBeenCalled();
    });

    it('does not mark as read when Enter is pressed on the dismiss or action button', () => {
      const { root, markRead } = setup({ ...base, actionLabel: 'Ver' });
      for (const btn of Array.from(root.querySelectorAll('button'))) {
        btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      }
      expect(markRead).not.toHaveBeenCalled();
      root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(markRead).toHaveBeenCalledTimes(1);
    });
  });
});
