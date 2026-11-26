import { IconInput } from '../../atoms/icon/icon.types';
import type { MenuButtonColor } from '../../atoms/menu-button/menu-button.component';
import type { AvatarColor } from '../../atoms/avatar/avatar.component';

export interface UserMenuUser {
  name: string;
  email: string;
  avatarSrc?: string;
  initials?: string;
  avatarColor?: AvatarColor;
}

export interface UserMenuAction {
  id: string;
  label: string;
  icon?: IconInput;
  color?: MenuButtonColor;
  disabled?: boolean;
  separator?: boolean;
}
