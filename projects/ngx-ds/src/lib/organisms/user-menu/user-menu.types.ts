import type { LucideIconData } from 'lucide-angular';
import type { MenuButtonColor } from '../../atoms/menu-button/menu-button.component';
import type { AvatarColor, AvatarSize } from '../../atoms/avatar/avatar.component';

export type { AvatarSize };

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
  icon?: LucideIconData;
  color?: MenuButtonColor;
  disabled?: boolean;
  separator?: boolean;
}
