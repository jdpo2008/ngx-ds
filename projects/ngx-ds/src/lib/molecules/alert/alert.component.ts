import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  inject,
} from '@angular/core';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X, LucideIconData } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { NGX_DS_LABELS } from '../../shared/labels';

export type AlertType = 'info' | 'success' | 'warning' | 'danger';
export type AlertVariant = 'solid' | 'soft' | 'outline';

const TYPE_ICONS: Record<AlertType, LucideIconData> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
};

@Component({
  selector: 'ngx-ds-alert',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly title = input<string>('');
  readonly type = input<AlertType>('info');
  readonly variant = input<AlertVariant>('soft');
  readonly showIcon = input<boolean>(true);
  readonly dismissible = input<boolean>(false);

  readonly dismissed = output<void>();

  readonly #closed = signal(false);
  readonly isClosed = this.#closed.asReadonly();

  readonly closeIcon = X;

  readonly typeIcon = computed(() => TYPE_ICONS[this.type()]);

  readonly hostClasses = computed(() =>
    ['alert', `alert--${this.type()}`, `alert--${this.variant()}`].join(' '),
  );

  close(): void {
    this.#closed.set(true);
    this.dismissed.emit();
  }
}
