import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import { AvatarComponent } from '../../atoms/avatar/avatar.component';
import type { AvatarSize } from '../../atoms/avatar/avatar.component';
import { MenuButtonComponent } from '../../atoms/menu-button/menu-button.component';
import { DividerComponent } from '../../atoms/divider/divider.component';
import { PopoverComponent } from '../popover/popover.component';
import type { PopoverPlacement } from '../popover/popover.component';
import type { UserMenuUser, UserMenuAction } from './user-menu.types';

@Component({
  selector: 'ngx-ds-user-menu',
  standalone: true,
  imports: [PopoverComponent, AvatarComponent, MenuButtonComponent, DividerComponent],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {
  readonly user      = input.required<UserMenuUser>();
  readonly actions   = input<UserMenuAction[]>([]);
  readonly placement = input<PopoverPlacement>('bottom-end');
  readonly size      = input<AvatarSize>('md');

  readonly actionClick = output<UserMenuAction>();

  readonly #popover = viewChild.required(PopoverComponent);

  onAction(action: UserMenuAction): void {
    if (action.disabled) return;
    this.actionClick.emit(action);
    this.#popover().open.set(false);
  }
}
