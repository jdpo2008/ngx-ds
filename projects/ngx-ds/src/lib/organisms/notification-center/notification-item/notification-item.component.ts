import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Info, CheckCircle, AlertTriangle, AlertCircle, X, LucideIconData } from 'lucide-angular';
import { ButtonComponent } from '../../../atoms/button/button.component';
import { IconComponent } from '../../../atoms/icon/icon.component';
import { IconButtonComponent } from '../../../atoms/icon-button/icon-button.component';
import { NGX_DS_LOCALE } from '../../../shared/locale';
import type { NgxNotification, NotificationType } from '../notification.types';
import { NGX_DS_LABELS, NgxDsLabels } from '../../../shared/labels';

const TYPE_ICONS: Record<Exclude<NotificationType, 'error'>, LucideIconData> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: AlertCircle,
};

function relativeTime(
  value: Date | string | undefined,
  locale: string,
  labels: NgxDsLabels,
): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return String(value);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return labels.timeNow;
  if (diffMin < 60) return labels.minutesAgo(diffMin);
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return labels.hoursAgo(diffH);
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return labels.daysAgo(diffD);
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

@Component({
  selector: 'ngx-ds-notification-item',
  standalone: true,
  imports: [ButtonComponent, IconComponent, IconButtonComponent],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationItemComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly notification = input.required<NgxNotification>();

  readonly markRead = output<NgxNotification>();
  readonly dismiss = output<NgxNotification>();
  readonly action = output<NgxNotification>();

  readonly XIcon = X;

  /** The notification type, with the deprecated `'error'` mapped to `'danger'`. */
  readonly type = computed(() => {
    const type = this.notification().type;
    return type === 'error' ? 'danger' : type;
  });

  readonly typeIcon = computed(() => TYPE_ICONS[this.type()]);
  readonly #locale = inject(NGX_DS_LOCALE);
  readonly timeLabel = computed(() =>
    relativeTime(this.notification().time, this.#locale, this.i18n),
  );

  readonly hostClasses = computed(() => {
    const n = this.notification();
    const cls = [`notif-item notif-item--${this.type()}`];
    if (!n.read) cls.push('notif-item--unread');
    return cls.join(' ');
  });

  onMarkRead(): void {
    if (!this.notification().read) this.markRead.emit(this.notification());
  }

  onDismiss(event: MouseEvent): void {
    event.stopPropagation();
    this.dismiss.emit(this.notification());
  }

  onAction(event: MouseEvent): void {
    event.stopPropagation();
    this.action.emit(this.notification());
  }
}
