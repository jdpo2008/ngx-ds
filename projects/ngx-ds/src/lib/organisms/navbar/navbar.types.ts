import { LucideIconData } from 'lucide-angular';

export interface NavbarItem {
  id: string;
  label: string;
  icon?: LucideIconData;
  badge?: string | number;
  disabled?: boolean;
}
