/** Notification colour. */
export type NotificationType = 'info' | 'success' | 'warning' | 'danger';

export interface NgxNotification {
  id: string | number;
  type: NotificationType;
  title: string;
  description?: string;
  time?: Date | string;
  read?: boolean;
  actionLabel?: string;
  data?: unknown;
}
