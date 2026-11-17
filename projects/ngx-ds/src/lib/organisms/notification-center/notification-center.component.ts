import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  inject,
} from '@angular/core';
import { Bell, BellOff } from 'lucide-angular';
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconButtonComponent } from '../../atoms/icon-button/icon-button.component';
import { EmptyStateComponent } from '../../molecules/empty-state/empty-state.component';
import { NotificationItemComponent } from './notification-item/notification-item.component';
import type { NgxNotification } from './notification.types';
import { NGX_DS_LABELS } from '../../shared/labels';

export type NotificationFilter = 'all' | 'unread';

@Component({
  selector: 'ngx-ds-notification-center',
  standalone: true,
  imports: [ButtonComponent, IconButtonComponent, EmptyStateComponent, NotificationItemComponent],
  templateUrl: './notification-center.component.html',
  styleUrl: './notification-center.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCenterComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  // ── Inputs ────────────────────────────────────────────────────────────────
  readonly notifications = input<NgxNotification[]>([]);
  readonly panelTitle = input<string | undefined>(undefined);
  readonly maxHeight = input<string>('28rem');
  readonly placement = input<'bottom-end' | 'bottom-start'>('bottom-end');

  // ── Outputs ───────────────────────────────────────────────────────────────
  readonly markRead = output<NgxNotification>();
  readonly markAllRead = output<void>();
  readonly dismiss = output<NgxNotification>();
  readonly dismissAll = output<void>();
  readonly action = output<NgxNotification>();

  // ── Internal state ────────────────────────────────────────────────────────
  readonly #open = signal(false);
  readonly #filter = signal<NotificationFilter>('all');

  readonly isOpen = this.#open.asReadonly();
  readonly filter = this.#filter.asReadonly();

  readonly BellIcon = Bell;
  readonly BellOffIcon = BellOff;

  // ── Derived ───────────────────────────────────────────────────────────────
  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.read).length);

  readonly hasUnread = computed(() => this.unreadCount() > 0);

  readonly displayedNotifications = computed(() => {
    const all = this.notifications();
    return this.#filter() === 'unread' ? all.filter((n) => !n.read) : all;
  });

  readonly isEmpty = computed(() => this.displayedNotifications().length === 0);

  readonly badgeLabel = computed(() => {
    const count = this.unreadCount();
    return count > 0 ? (count > 99 ? '99+' : String(count)) : '';
  });

  readonly panelClasses = computed(() => `nc__panel nc__panel--${this.placement()}`);

  // ── Interaction ───────────────────────────────────────────────────────────
  togglePanel(): void {
    this.#open.update((v) => !v);
  }

  setFilter(f: NotificationFilter): void {
    this.#filter.set(f);
  }

  onMarkRead(n: NgxNotification): void {
    this.markRead.emit(n);
  }

  onMarkAllRead(): void {
    this.markAllRead.emit();
  }

  onDismiss(n: NgxNotification): void {
    this.dismiss.emit(n);
  }

  onDismissAll(): void {
    this.dismissAll.emit();
  }

  onAction(n: NgxNotification): void {
    this.action.emit(n);
  }

  constructor() {
    setupClickOutside(() => {
      if (!this.#open()) return;
      this.#open.set(false);
    });

    setupEscapeClose(() => this.#open.set(false));
  }
}
