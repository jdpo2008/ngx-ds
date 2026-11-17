import { Injectable, signal } from '@angular/core';

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
}

export interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private readonly _state = signal<ConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'info',
  });

  readonly state = this._state.asReadonly();

  private resolveCallback?: (confirmed: boolean) => void;

  confirm(options: ConfirmationOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.resolveCallback = resolve;
      this._state.set({
        ...options,
        isOpen: true,
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        type: options.type || 'info',
      });
    });
  }

  handleConfirm(): void {
    if (this.resolveCallback) {
      this.resolveCallback(true);
      this.resolveCallback = undefined;
    }
    this.close();
  }

  handleCancel(): void {
    if (this.resolveCallback) {
      this.resolveCallback(false);
      this.resolveCallback = undefined;
    }
    this.close();
  }

  close(): void {
    this._state.update((state) => ({ ...state, isOpen: false }));
  }
}
