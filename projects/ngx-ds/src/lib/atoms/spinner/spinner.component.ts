import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { NGX_DS_LABELS } from '../../shared/labels';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpinnerColor =
  'current' | 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';

@Component({
  selector: 'ngx-ds-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly size = input<SpinnerSize>('md');
  readonly color = input<SpinnerColor>('current');

  readonly hostClasses = computed(() => {
    const classes = ['spinner', `spinner--${this.size()}`, `spinner--${this.color()}`];
    return classes.join(' ');
  });
}
