import { IconInput } from '../../atoms/icon/icon.types';

export interface MenuItem {
  id: string;
  label: string;
  icon?: IconInput;
  kbd?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  children?: MenuItem[];
}
