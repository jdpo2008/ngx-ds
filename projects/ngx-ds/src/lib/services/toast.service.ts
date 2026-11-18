import { Injectable, signal } from '@angular/core';

/** Toast colour. `'error'` is a deprecated alias of `'danger'` and will be removed in 1.0. */
export type ToastType = 'success' | 'danger' | 'warning' | 'info' | 'error';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number; // in milliseconds, default 5000
  position?: ToastPosition;
  title?: string;
}

export interface Toast extends Omit<ToastOptions, 'type' | 'duration' | 'position'> {
  id: string;
  timestamp: number;
  type: ToastType;
  duration: number;
  position: ToastPosition;
}

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  private readonly _toasts = signal<Toast[]>([]);

  readonly toasts = this._toasts.asReadonly();

  show(options: ToastOptions): string {
    const id = this.generateId();
    const toast: Toast = {
      ...options,
      id,
      type: options.type === 'error' ? 'danger' : options.type || 'info',
      duration: options.duration || 5000,
      position: options.position || 'top-right',
      timestamp: Date.now(),
    };

    this._toasts.update((toasts) => [...toasts, toast]);

    // Auto-remove after duration
    if (toast.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, toast.duration);
    }

    return id;
  }

  success(message: string, title?: string, duration?: number): string {
    return this.show({ message, type: 'success', title, duration });
  }

  danger(message: string, title?: string, duration?: number): string {
    return this.show({ message, type: 'danger', title, duration });
  }

  /** @deprecated Use `danger()`. Will be removed in 1.0. */
  error(message: string, title?: string, duration?: number): string {
    return this.danger(message, title, duration);
  }

  warning(message: string, title?: string, duration?: number): string {
    return this.show({ message, type: 'warning', title, duration });
  }

  info(message: string, title?: string, duration?: number): string {
    return this.show({ message, type: 'info', title, duration });
  }

  remove(id: string): void {
    this._toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  clear(): void {
    this._toasts.set([]);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
