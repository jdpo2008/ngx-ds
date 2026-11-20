import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
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
  readonly user = input.required<UserMenuUser>();
  readonly actions = input<UserMenuAction[]>([]);
  readonly placement = input<PopoverPlacement>('bottom-end');
  readonly size = input<AvatarSize>('md');

  readonly actionClick = output<UserMenuAction>();

  /** The given initials, or the first letters of the first and last words of the name. */
  readonly initials = computed(() => {
    const { initials, name } = this.user();
    if (initials) return initials;
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '';
    const first = words[0][0];
    const last = words.length > 1 ? words[words.length - 1][0] : '';
    return first + last;
  });

  private readonly popover = viewChild.required(PopoverComponent);
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');

  onAction(action: UserMenuAction): void {
    if (action.disabled) return;
    this.actionClick.emit(action);
    this.popover().open.set(false);
    // The clicked button leaves the DOM with the panel; keep focus on the menu.
    this.trigger().nativeElement.focus();
  }
}
