import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { LucideIconData, PanelLeftClose, PanelLeftOpen } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { IconButtonComponent } from '../../atoms/icon-button/icon-button.component';
import { BadgeComponent } from '../../atoms/badge/badge.component';
import { TooltipDirective } from '../../atoms/tooltip/tooltip.directive';
import { SidebarItem, SidebarSection } from './sidebar.types';

@Component({
  selector: 'ngx-ds-sidebar',
  standalone: true,
  imports: [IconComponent, IconButtonComponent, BadgeComponent, TooltipDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly sections = input.required<SidebarSection[]>();
  readonly activeId = input<string | null>(null);
  readonly collapsible = input<boolean>(false);
  readonly ariaLabel = input<string>('Navegación principal');

  readonly collapsed = model<boolean>(false);
  readonly itemClick = output<SidebarItem>();

  private readonly panelLeftOpen: LucideIconData = PanelLeftOpen;
  private readonly panelLeftClose: LucideIconData = PanelLeftClose;

  readonly toggleIcon = computed(() =>
    this.collapsed() ? this.panelLeftOpen : this.panelLeftClose,
  );

  onItemClick(item: SidebarItem): void {
    if (item.disabled) return;
    this.itemClick.emit(item);
  }

  toggleCollapsed(): void {
    this.collapsed.update((v) => !v);
  }

  badgeCount(item: SidebarItem): number | undefined {
    return typeof item.badge === 'number' ? item.badge : undefined;
  }

  badgeLabel(item: SidebarItem): string {
    return typeof item.badge === 'string' ? item.badge : '';
  }
}
