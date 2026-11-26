import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import {
  LucideBell as Bell,
  LucideFileText as FileText,
  LucideHome as Home,
  LucideLayers as Layers,
  LucideSettings as Settings,
  LucideUsers as Users,
} from '@lucide/angular';
import { NavbarComponent } from '../../../src/lib/organisms/navbar/navbar.component';
import type { NavbarItem } from '../../../src/lib/organisms/navbar/navbar.types';
import { IconButtonComponent } from '../../../src/lib/atoms/icon-button/icon-button.component';
import { IconComponent } from '../../../src/lib/atoms/icon/icon.component';

const ITEMS: NavbarItem[] = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'docs', label: 'Documentos', icon: FileText, badge: 3 },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'settings', label: 'Configuración', icon: Settings, disabled: true },
];

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'navbar-default-wrapper',
  standalone: true,
  imports: [NavbarComponent, IconButtonComponent, IconComponent],
  template: `
    <div style="border: 1px solid var(--border-base, #e5e7eb); border-radius: 0.5rem;">
      <ngx-ds-navbar [items]="items" [activeId]="activeId()" (itemClick)="activeId.set($event.id)">
        <span navbar-brand style="display: flex; align-items: center; gap: 0.5rem;">
          <ngx-ds-icon [icon]="logo" [size]="22" />
          ngx-ds
        </span>
        <ngx-ds-icon-button
          navbar-actions
          [icon]="bell"
          ariaLabel="Notificaciones"
          variant="outline"
          color="secondary"
          [bordered]="false"
        />
      </ngx-ds-navbar>
      <p style="padding: 1.5rem; margin: 0;">
        Sección activa: <strong>{{ activeId() }}</strong>
      </p>
    </div>
  `,
})
class DefaultWrapper {
  readonly items = ITEMS;
  readonly logo = Layers;
  readonly bell = Bell;
  activeId = signal('home');
}

// ── Compact Wrapper (narrow container shows the menu toggle) ─────────────────

@Component({
  selector: 'navbar-compact-wrapper',
  standalone: true,
  imports: [NavbarComponent],
  template: `
    <div
      style="width: 375px; height: 360px; border: 1px solid var(--border-base, #e5e7eb); border-radius: 0.5rem; overflow: hidden;"
    >
      <ngx-ds-navbar [items]="items" [activeId]="activeId()" (itemClick)="activeId.set($event.id)">
        <span navbar-brand>ngx-ds</span>
      </ngx-ds-navbar>
      <p style="padding: 1.5rem; margin: 0;">
        Sección activa: <strong>{{ activeId() }}</strong>
      </p>
    </div>
  `,
})
class CompactWrapper {
  readonly items = ITEMS;
  activeId = signal('home');
}

// ── Brand only Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'navbar-brand-wrapper',
  standalone: true,
  imports: [NavbarComponent],
  template: `
    <ngx-ds-navbar>
      <span navbar-brand>ngx-ds</span>
      <a navbar-actions href="#" style="color: var(--primary-700, #4338ca); font-size: 0.875rem;">
        Iniciar sesión
      </a>
    </ngx-ds-navbar>
  `,
})
class BrandWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Organisms/Navbar',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<navbar-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const Compact: Story = {
  render: () => ({
    template: `<navbar-compact-wrapper />`,
    moduleMetadata: { imports: [CompactWrapper] },
  }),
};

export const WithoutItems: Story = {
  render: () => ({
    template: `<navbar-brand-wrapper />`,
    moduleMetadata: { imports: [BrandWrapper] },
  }),
};
