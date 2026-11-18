/**
 * Notification colour. `'error'` is a deprecated alias of `'danger'` and will be removed in 1.0.
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'danger' | 'error';

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
