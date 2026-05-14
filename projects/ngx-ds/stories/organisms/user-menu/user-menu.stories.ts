import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { User, Settings, LogOut, CreditCard } from 'lucide-angular';
import { UserMenuComponent } from '../../../src/lib/organisms/user-menu/user-menu.component';
import type { UserMenuAction, UserMenuUser } from '../../../src/lib/organisms/user-menu/user-menu.types';

// ── Seed data ─────────────────────────────────────────────────────────────────

const USER_WITH_AVATAR: UserMenuUser = {
  name: 'Ana García',
  email: 'ana.garcia@empresa.com',
  avatarSrc: 'https://i.pravatar.cc/150?img=47',
  avatarColor: 'primary',
};

const USER_INITIALS: UserMenuUser = {
  name: 'Carlos López',
  email: 'carlos.lopez@empresa.com',
  initials: 'CL',
  avatarColor: 'warning',
};

const ACTIONS: UserMenuAction[] = [
  { id: 'profile',  label: 'Perfil',         icon: User,       color: 'default' },
  { id: 'billing',  label: 'Facturación',     icon: CreditCard, color: 'default' },
  { id: 'settings', label: 'Configuración',   icon: Settings,   color: 'default' },
  { id: 'logout',   label: 'Cerrar sesión',   icon: LogOut,     color: 'danger',  separator: true },
];

// ── Interactive wrapper ───────────────────────────────────────────────────────

@Component({
  selector: 'um-wrapper',
  standalone: true,
  imports: [UserMenuComponent],
  template: `
    <div style="padding: 2rem; min-height: 420px; display: flex; align-items: flex-start; justify-content: flex-end;">
      <ngx-ds-user-menu
        [user]="user"
        [actions]="actions"
        placement="bottom-end"
        (actionClick)="onAction($event)"
      />
    </div>
    <p style="position:fixed; bottom:1rem; left:1rem; font-size:0.75rem; color:#9ca3af; margin:0;">
      Última acción: {{ lastAction() }}
    </p>
  `,
})
class Wrapper {
  user    = USER_WITH_AVATAR;
  actions = ACTIONS;
  lastAction = signal('ninguna');

  onAction(action: UserMenuAction): void {
    this.lastAction.set(action.label);
  }
}

// ── Initials wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'um-initials-wrapper',
  standalone: true,
  imports: [UserMenuComponent],
  template: `
    <div style="padding: 2rem; min-height: 420px; display: flex; align-items: flex-start; justify-content: flex-end;">
      <ngx-ds-user-menu
        [user]="user"
        [actions]="actions"
        placement="bottom-end"
        (actionClick)="onAction($event)"
      />
    </div>
    <p style="position:fixed; bottom:1rem; left:1rem; font-size:0.75rem; color:#9ca3af; margin:0;">
      Última acción: {{ lastAction() }}
    </p>
  `,
})
class InitialsWrapper {
  user    = USER_INITIALS;
  actions = ACTIONS;
  lastAction = signal('ninguna');

  onAction(action: UserMenuAction): void {
    this.lastAction.set(action.label);
  }
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = { title: 'Organisms/UserMenu' };
export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const WithAvatar: Story = {
  render: () => ({
    template: `<um-wrapper />`,
    moduleMetadata: { imports: [Wrapper] },
  }),
};

export const WithInitials: Story = {
  render: () => ({
    template: `<um-initials-wrapper />`,
    moduleMetadata: { imports: [InitialsWrapper] },
  }),
};
