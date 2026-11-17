import { LucideIconData } from 'lucide-angular';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: LucideIconData;
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarSection {
  id?: string;
  title?: string;
  items: SidebarItem[];
}
