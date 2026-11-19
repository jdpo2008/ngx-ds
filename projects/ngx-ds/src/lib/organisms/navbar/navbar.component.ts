import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideIconData, Menu, X } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { BadgeComponent } from '../../atoms/badge/badge.component';
import { NGX_DS_LABELS } from '../../shared/labels';
import { setupClickOutside } from '../../shared/click-outside';
import { setupEscapeClose } from '../../shared/escape-close';
import { NavbarItem } from './navbar.types';

let nextId = 0;

/**
 * Top application bar with brand, navigation links and actions. When the bar
 * is narrower than 768px the links move into a menu opened by a toggle button.
 *
 * Slots: `[navbar-brand]` (logo, app name) and `[navbar-actions]`
 * (NotificationCenter, UserMenu, buttons).
 */
@Component({
  selector: 'ngx-ds-navbar',
  standalone: true,
  imports: [NgTemplateOutlet, IconComponent, BadgeComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.navbar-host--sticky]': 'sticky()' },
})
export class NavbarComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly items = input<NavbarItem[]>([]);
  readonly activeId = input<string | null>(null);
  /** Sticks the bar to the top of its scroll container. */
  readonly sticky = input<boolean>(false);
  readonly ariaLabel = input<string | undefined>(undefined);

  /** Whether the compact menu is open. */
  readonly menuOpen = model<boolean>(false);
  readonly itemClick = output<NavbarItem>();

  readonly panelId = `ngx-navbar-panel-${nextId++}`;
  readonly menuIcon: LucideIconData = Menu;
  readonly closeIcon: LucideIconData = X;

  private readonly toggle = viewChild<ElementRef<HTMLButtonElement>>('toggle');

  constructor() {
    setupClickOutside(() => this.menuOpen.set(false));
    setupEscapeClose(() => {
      if (!this.menuOpen()) return;
      this.menuOpen.set(false);
      this.toggle()?.nativeElement.focus();
    });
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  onItemClick(item: NavbarItem): void {
    if (item.disabled) return;
    this.itemClick.emit(item);
    this.menuOpen.set(false);
  }

  badgeCount(item: NavbarItem): number | undefined {
    return typeof item.badge === 'number' ? item.badge : undefined;
  }

  badgeLabel(item: NavbarItem): string {
    return typeof item.badge === 'string' ? item.badge : '';
  }
}
