import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpinnerColor = 'current' | 'primary' | 'secondary' | 'danger' | 'success' | 'warning';

@Component({
  selector: 'ngx-ds-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  readonly size = input<SpinnerSize>('md');
  readonly color = input<SpinnerColor>('current');

  readonly hostClasses = computed(() => {
    const classes = ['spinner', `spinner--${this.size()}`, `spinner--${this.color()}`];
    return classes.join(' ');
  });
}
