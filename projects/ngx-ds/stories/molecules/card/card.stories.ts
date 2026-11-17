import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  CardComponent,
  CardShadow,
  CardPadding,
} from '../../../src/lib/molecules/card/card.component';
import { ButtonComponent } from '../../../src/lib/atoms/button/button.component';
import { BadgeComponent } from '../../../src/lib/atoms/badge/badge.component';
import { AvatarComponent } from '../../../src/lib/atoms/avatar/avatar.component';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'card-basic-wrapper',
  standalone: true,
  imports: [CardComponent, ButtonComponent, BadgeComponent],
  template: `
    <div class="p-6" style="max-width: 22rem;">
      <ngx-ds-card>
        <div card-header style="display:flex; align-items:center; justify-content:space-between;">
          <span style="font-weight:600; font-size:0.9375rem; color:var(--text-base, #111827);"
            >Resumen del pedido</span
          >
          <ngx-ds-badge color="success">Activo</ngx-ds-badge>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <div style="display:flex; justify-content:space-between; font-size:0.875rem;">
            <span style="color:var(--text-muted, #6b7280);">Subtotal</span>
            <span style="color:var(--text-base, #111827); font-weight:500;">$1,240.00</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.875rem;">
            <span style="color:var(--text-muted, #6b7280);">IVA (16%)</span>
            <span style="color:var(--text-base, #111827); font-weight:500;">$198.40</span>
          </div>
          <div
            style="display:flex; justify-content:space-between; font-size:0.875rem; font-weight:600;"
          >
            <span style="color:var(--text-base, #111827);">Total</span>
            <span style="color:var(--text-base, #111827);">$1,438.40</span>
          </div>
        </div>
        <div card-footer style="display:flex; gap:0.5rem; justify-content:flex-end;">
          <ngx-ds-button variant="outline" color="secondary">Cancelar</ngx-ds-button>
          <ngx-ds-button color="primary">Confirmar pago</ngx-ds-button>
        </div>
      </ngx-ds-card>
    </div>
  `,
})
class BasicWrapper {}

// ── Profile Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'card-profile-wrapper',
  standalone: true,
  imports: [CardComponent, ButtonComponent, AvatarComponent, BadgeComponent],
  template: `
    <div class="p-6" style="display:flex; gap:1rem; flex-wrap:wrap;">
      @for (user of users; track user.name) {
        <ngx-ds-card style="width:14rem;" [hoverable]="true">
          <div
            style="display:flex; flex-direction:column; align-items:center; gap:0.75rem; text-align:center;"
          >
            <ngx-ds-avatar [name]="user.name" size="lg" />
            <div>
              <p
                style="font-weight:600; font-size:0.9375rem; color:var(--text-base, #111827); margin:0;"
              >
                {{ user.name }}
              </p>
              <p style="font-size:0.75rem; color:var(--text-muted, #6b7280); margin:0.25rem 0 0;">
                {{ user.role }}
              </p>
            </div>
            <ngx-ds-badge [color]="user.badgeColor">{{ user.status }}</ngx-ds-badge>
          </div>
          <div card-footer style="display:flex; justify-content:center;">
            <ngx-ds-button size="sm" variant="ghost" color="primary">Ver perfil</ngx-ds-button>
          </div>
        </ngx-ds-card>
      }
    </div>
  `,
})
class ProfileWrapper {
  users = [
    {
      name: 'Ana García',
      role: 'Product Manager',
      status: 'Activo',
      badgeColor: 'success' as const,
    },
    {
      name: 'Luis Martínez',
      role: 'Frontend Dev',
      status: 'En reunión',
      badgeColor: 'warning' as const,
    },
    { name: 'Sara López', role: 'UX Designer', status: 'Inactivo', badgeColor: 'default' as const },
  ];
}

// ── Hoverable Wrapper ─────────────────────────────────────────────────────────

@Component({
  selector: 'card-hoverable-wrapper',
  standalone: true,
  imports: [CardComponent],
  template: `
    <div class="p-6" style="display:flex; gap:1rem; flex-wrap:wrap;">
      @for (item of items; track item.title) {
        <ngx-ds-card style="width:15rem;" [hoverable]="true" shadow="md">
          <div style="font-size:1.5rem; margin-bottom:0.5rem;">{{ item.icon }}</div>
          <h3
            style="font-weight:600; color:var(--text-base, #111827); margin:0 0 0.375rem; font-size:0.9375rem;"
          >
            {{ item.title }}
          </h3>
          <p
            style="font-size:0.8125rem; color:var(--text-muted, #6b7280); margin:0; line-height:1.5;"
          >
            {{ item.desc }}
          </p>
        </ngx-ds-card>
      }
    </div>
  `,
})
class HoverableWrapper {
  items = [
    {
      icon: '🚀',
      title: 'Alto rendimiento',
      desc: 'Optimizado para Angular 21 con signals y OnPush.',
    },
    {
      icon: '🎨',
      title: 'Personalizable',
      desc: 'Tokens CSS para adaptar colores y tipografía fácilmente.',
    },
    {
      icon: '♿',
      title: 'Accesible',
      desc: 'ARIA roles y semántica correcta en todos los componentes.',
    },
  ];
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/Card',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    shadow: 'sm' as CardShadow,
    padding: 'md' as CardPadding,
    bordered: true,
    hoverable: false,
  },
  argTypes: {
    shadow: { control: 'radio', options: ['none', 'sm', 'md', 'lg'] },
    padding: { control: 'radio', options: ['none', 'sm', 'md', 'lg'] },
    bordered: { control: 'boolean' },
    hoverable: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 1.5rem; max-width: 22rem;">
        <ngx-ds-card [shadow]="shadow" [padding]="padding" [bordered]="bordered" [hoverable]="hoverable">
          <div card-header>
            <span style="font-weight:600; color:var(--text-base, #111827);">Título de la tarjeta</span>
          </div>
          <p style="margin:0; color:var(--text-muted, #6b7280); font-size:0.875rem;">
            Este es el contenido principal de la card. Puede contener cualquier elemento HTML o componente Angular.
          </p>
          <div card-footer style="display:flex; gap:0.5rem;">
            <button style="padding:0.375rem 0.75rem; border:1px solid var(--border-input, #d1d5db); border-radius:0.375rem; background:var(--surface-base, #fff); cursor:pointer; font-size:0.8125rem;">Cancelar</button>
            <button style="padding:0.375rem 0.75rem; border:none; border-radius:0.375rem; background:#3b82f6; color:#fff; cursor:pointer; font-size:0.8125rem;">Aceptar</button>
          </div>
        </ngx-ds-card>
      </div>
    `,
    moduleMetadata: { imports: [CardComponent] },
  }),
};

export const WithHeaderFooter: Story = {
  render: () => ({
    template: `<card-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};

export const ProfileCards: Story = {
  render: () => ({
    template: `<card-profile-wrapper />`,
    moduleMetadata: { imports: [ProfileWrapper] },
  }),
};

export const Hoverable: Story = {
  render: () => ({
    template: `<card-hoverable-wrapper />`,
    moduleMetadata: { imports: [HoverableWrapper] },
  }),
};
