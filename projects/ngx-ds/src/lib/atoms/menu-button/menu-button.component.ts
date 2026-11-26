import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { IconInput } from '../icon/icon.types';
import { IconComponent } from '../icon/icon.component';
import { Size } from '../../shared/size';

export type MenuButtonColor = 'default' | 'primary' | 'danger' | 'success' | 'warning' | 'info';
export type MenuButtonSize = Size;

const ICON_SIZE: Record<MenuButtonSize, number> = { sm: 14, md: 16, lg: 18 };

@Component({
  selector: 'ngx-ds-menu-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuButtonComponent {
  readonly iconLeft = input<IconInput | undefined>(undefined);
  readonly iconRight = input<IconInput | undefined>(undefined);
  readonly color = input<MenuButtonColor>('default');
  readonly size = input<MenuButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly hostClasses = computed(() => {
    const classes = ['menu-btn', `menu-btn--${this.size()}`, `menu-btn--${this.color()}`];
    if (this.fullWidth()) classes.push('menu-btn--full');
    return classes.join(' ');
  });

  readonly iconSize = computed(() => ICON_SIZE[this.size()]);
}
