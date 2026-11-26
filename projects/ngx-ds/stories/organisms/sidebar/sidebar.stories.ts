import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import {
  LucideHome as Home,
  LucideFileText as FileText,
  LucideSettings as Settings,
  LucideUsers as Users,
  LucideBell as Bell,
} from '@lucide/angular';
import { SidebarComponent } from '../../../src/lib/organisms/sidebar/sidebar.component';
import type { SidebarSection, SidebarItem } from '../../../src/lib/organisms/sidebar/sidebar.types';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'sidebar-basic-wrapper',
  standalone: true,
  imports: [SidebarComponent],
  template: `
    <div
      style="display: flex; height: 480px; border: 1px solid var(--border-base, #e5e7eb); border-radius: 0.5rem; overflow: hidden;"
    >
      <ngx-ds-sidebar
        [sections]="sections"
        [activeId]="activeId()"
        [collapsible]="true"
        [(collapsed)]="collapsed"
        (itemClick)="onItemClick($event)"
      >
        <div sidebar-header style="padding: 0.75rem; font-weight: 600;">ngx-ds</div>
        <div
          sidebar-footer
          style="padding: 0.75rem; font-size: 0.75rem; color: var(--text-muted, #6b7280);"
        >
          v1.0.0
        </div>
      </ngx-ds-sidebar>
      <div style="flex: 1; padding: 1.5rem;">
        <p>
          Sección activa: <strong>{{ activeId() }}</strong>
        </p>
        <p style="font-size: 0.875rem; color: var(--text-muted, #6b7280);">
          Colapsado: {{ collapsed }}
        </p>
      </div>
    </div>
  `,
})
class BasicWrapper {
  collapsed = false;
  activeId = signal('home');

  readonly sections: SidebarSection[] = [
    {
      title: 'General',
      items: [
        { id: 'home', label: 'Inicio', icon: Home },
        { id: 'docs', label: 'Documentos', icon: FileText, badge: 3 },
        { id: 'notifications', label: 'Notificaciones', icon: Bell, badge: 'Nuevo' },
      ],
    },
    {
      title: 'Administración',
      items: [
        { id: 'users', label: 'Usuarios', icon: Users },
        { id: 'settings', label: 'Configuración', icon: Settings, disabled: true },
      ],
    },
  ];

  onItemClick(item: SidebarItem): void {
    this.activeId.set(item.id);
  }
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Organisms/Sidebar',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<sidebar-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};
