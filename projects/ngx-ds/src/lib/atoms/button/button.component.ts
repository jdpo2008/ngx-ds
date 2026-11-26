import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { IconInput } from '../icon/icon.types';
import { IconComponent } from '../icon/icon.component';
import { SpinnerComponent, SpinnerSize } from '../spinner/spinner.component';
import { Size } from '../../shared/size';

export type ButtonVariant = 'solid' | 'outline';
export type ButtonSize = Size;
export type ButtonColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';

const ICON_SIZE: Record<ButtonSize, number> = { sm: 14, md: 16, lg: 20 };
const SPINNER_SIZE: Record<ButtonSize, SpinnerSize> = { sm: 'xs', md: 'sm', lg: 'md' };

@Component({
  selector: 'ngx-ds-button',
  standalone: true,
  imports: [IconComponent, SpinnerComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('solid');
  readonly size = input<ButtonSize>('md');
  readonly color = input<ButtonColor>('primary');
  readonly iconLeft = input<IconInput | undefined>(undefined);
  readonly iconRight = input<IconInput | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly rounded = input<boolean>(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  /** Accessible name for icon-only buttons; set on the native `<button>`. */
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly hostClasses = computed(() => {
    const classes = [
      'btn',
      `btn--${this.variant()}`,
      `btn--${this.size()}`,
      `btn--${this.color()}`,
    ];
    if (this.rounded()) classes.push('btn--rounded');
    if (this.loading()) classes.push('btn--loading');
    return classes.join(' ');
  });

  readonly iconSize = computed(() => ICON_SIZE[this.size()]);
  readonly spinnerSize = computed(() => SPINNER_SIZE[this.size()]);
}
