import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { Size } from '../../shared/size';
import { NGX_DS_LABELS } from '../../shared/labels';

export type ProgressBarSize = Size;
export type ProgressBarColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';

@Component({
  selector: 'ngx-ds-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly value = input<number>(0);
  readonly max = input<number>(100);
  readonly size = input<ProgressBarSize>('md');
  readonly color = input<ProgressBarColor>('primary');
  readonly label = input<string>('');
  readonly showValue = input<boolean>(false);
  readonly striped = input<boolean>(false);
  readonly animated = input<boolean>(false);
  readonly rounded = input<boolean>(true);
  readonly indeterminate = input<boolean>(false);

  /** The value kept inside [0, max], as aria-valuenow must be. */
  readonly clampedValue = computed(() => Math.min(this.max(), Math.max(0, this.value())));

  readonly percentage = computed(() => {
    const max = this.max();
    return max > 0 ? (this.clampedValue() / max) * 100 : 0;
  });

  readonly displayValue = computed(() => `${Math.round(this.percentage())}%`);

  readonly trackClasses = computed(() => {
    const base = 'progress';
    return [
      base,
      `${base}--${this.size()}`,
      `${base}--${this.color()}`,
      this.rounded() ? `${base}--rounded` : '',
      this.indeterminate() ? `${base}--indeterminate` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  readonly barClasses = computed(() => {
    const base = 'progress__bar';
    return [
      base,
      this.striped() || this.animated() ? `${base}--striped` : '',
      this.animated() ? `${base}--animated` : '',
      this.rounded() ? `${base}--rounded` : '',
      this.indeterminate() ? `${base}--indeterminate` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
}
