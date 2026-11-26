import { IconInput } from '../../atoms/icon/icon.types';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: IconInput;
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarSection {
  id?: string;
  title?: string;
  items: SidebarItem[];
}
