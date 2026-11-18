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

export type AlertColor = 'info' | 'success' | 'warning' | 'danger';
/** @deprecated Use `AlertColor`. Removed in 1.0. */
export type AlertType = AlertColor;
export type AlertVariant = 'solid' | 'soft' | 'outline';

const TYPE_ICONS: Record<AlertColor, LucideIconData> = {
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
  readonly color = input<AlertColor>('info');
  /** @deprecated Use `color`. Removed in 1.0. */
  readonly type = input<AlertColor | undefined>(undefined);
  readonly effectiveColor = computed(() => this.type() ?? this.color());
  readonly variant = input<AlertVariant>('soft');
  readonly showIcon = input<boolean>(true);
  readonly dismissible = input<boolean>(false);

  readonly dismissed = output<void>();

  readonly #closed = signal(false);
  readonly isClosed = this.#closed.asReadonly();

  readonly closeIcon = X;

  readonly typeIcon = computed(() => TYPE_ICONS[this.effectiveColor()]);

  readonly hostClasses = computed(() =>
    ['alert', `alert--${this.effectiveColor()}`, `alert--${this.variant()}`].join(' '),
  );

  close(): void {
    this.#closed.set(true);
    this.dismissed.emit();
  }
}
