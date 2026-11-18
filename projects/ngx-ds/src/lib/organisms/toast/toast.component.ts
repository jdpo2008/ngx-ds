import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService, ToastType, Toast } from '../../services/toast.service';
import { NGX_DS_LABELS } from '../../shared/labels';

@Component({
  selector: 'ngx-ds-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly toastService = inject(ToastrService);
  readonly toasts = this.toastService.toasts;

  readonly toastsByPosition = computed(() => {
    const grouped: Record<string, Toast[]> = {
      'top-right': [],
      'top-left': [],
      'bottom-right': [],
      'bottom-left': [],
    };

    this.toasts().forEach((toast) => {
      grouped[toast.position || 'top-right'].push(toast);
    });

    return grouped;
  });

  getToastsByPosition(position: string): Toast[] {
    return this.toastsByPosition()[position] || [];
  }

  getIconPath(type: ToastType | undefined): string {
    const defaultType: ToastType = 'info';
    const effectiveType = type === 'error' ? 'danger' : type || defaultType;
    // Return icon SVG path based on type
    const icons: Record<Exclude<ToastType, 'error'>, string> = {
      success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      danger: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      warning:
        'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    };
    return icons[effectiveType];
  }

  onClose(id: string): void {
    this.toastService.remove(id);
  }
}
