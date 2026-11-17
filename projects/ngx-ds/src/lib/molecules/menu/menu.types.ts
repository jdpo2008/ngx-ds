import type { LucideIconData } from 'lucide-angular';

export interface MenuItem {
  id: string;
  label: string;
  icon?: LucideIconData;
  kbd?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  children?: MenuItem[];
}
