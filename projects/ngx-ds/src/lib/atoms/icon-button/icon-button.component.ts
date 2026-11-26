import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { IconInput } from '../icon/icon.types';
import { ButtonVariant, ButtonSize, ButtonColor } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

const ICON_SIZE: Record<ButtonSize, number> = { sm: 14, md: 18, lg: 22 };

@Component({
  selector: 'ngx-ds-icon-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  readonly icon = input.required<IconInput>();
  readonly ariaLabel = input.required<string>();
  readonly variant = input<ButtonVariant>('solid');
  readonly size = input<ButtonSize>('md');
  readonly color = input<ButtonColor>('primary');
  readonly rounded = input<boolean>(false);
  readonly bordered = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  /** Sets `aria-expanded` on the button when it toggles a region. */
  readonly ariaExpanded = input<boolean | undefined>(undefined);
  /** Sets `aria-haspopup` on the button when it opens a popup. */
  readonly ariaHaspopup = input<'true' | 'menu' | 'listbox' | 'dialog' | undefined>(undefined);
  /** Sets `aria-controls` on the button: the id of the region it toggles. */
  readonly ariaControls = input<string | null | undefined>(undefined);

  readonly hostClasses = computed(() => {
    const classes = [
      'icon-btn',
      `icon-btn--${this.variant()}`,
      `icon-btn--${this.size()}`,
      `icon-btn--${this.color()}`,
    ];
    if (this.rounded()) classes.push('icon-btn--rounded');
    if (!this.bordered()) classes.push('icon-btn--borderless');
    return classes.join(' ');
  });

  readonly iconSize = computed(() => ICON_SIZE[this.size()]);
}
