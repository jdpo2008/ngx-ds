import { IconInput } from '../../atoms/icon/icon.types';

export interface NavbarItem {
  id: string;
  label: string;
  icon?: IconInput;
  badge?: string | number;
  disabled?: boolean;
}
