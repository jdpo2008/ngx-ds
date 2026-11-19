import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { AlertTriangle, DollarSign, ShoppingCart, Users } from 'lucide-angular';
import { StatCardComponent } from '../../../src/lib/molecules/stat-card/stat-card.component';

const GRID =
  'display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;';

// ── Dashboard Wrapper ─────────────────────────────────────────────────────────

@Component({
  selector: 'stat-card-dashboard-wrapper',
  standalone: true,
  imports: [StatCardComponent],
  template: `
    <div style="${GRID}">
      <ngx-ds-stat-card
        label="Ingresos"
        value="48.250 €"
        [delta]="12.5"
        deltaLabel="vs. mes anterior"
        [icon]="dollar"
      />
      <ngx-ds-stat-card
        label="Usuarios activos"
        value="1.240"
        [delta]="-3.2"
        deltaLabel="vs. mes anterior"
        [icon]="users"
      />
      <ngx-ds-stat-card
        label="Pedidos"
        [value]="312"
        [delta]="0"
        deltaLabel="vs. ayer"
        [icon]="cart"
      />
      <ngx-ds-stat-card
        label="Errores"
        [value]="18"
        [delta]="-40"
        deltaLabel="menos es mejor"
        [invertTrend]="true"
        [icon]="alert"
      />
    </div>
  `,
})
class DashboardWrapper {
  readonly dollar = DollarSign;
  readonly users = Users;
  readonly cart = ShoppingCart;
  readonly alert = AlertTriangle;
}

// ── Simple Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'stat-card-simple-wrapper',
  standalone: true,
  imports: [StatCardComponent],
  template: `
    <div style="${GRID}">
      <ngx-ds-stat-card label="Tiempo medio de respuesta" value="1,8 s" />
      <ngx-ds-stat-card label="Satisfacción" value="4,6 / 5">
        <a stat-footer href="#" style="font-size: 0.8125rem; color: var(--primary-700, #4338ca);">
          Ver encuestas
        </a>
      </ngx-ds-stat-card>
    </div>
  `,
})
class SimpleWrapper {}

// ── Loading Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'stat-card-loading-wrapper',
  standalone: true,
  imports: [StatCardComponent],
  template: `
    <div style="${GRID}">
      <ngx-ds-stat-card label="Ingresos" value="" [loading]="true" [icon]="dollar" />
      <ngx-ds-stat-card label="Usuarios activos" value="" [loading]="true" [icon]="users" />
    </div>
  `,
})
class LoadingWrapper {
  readonly dollar = DollarSign;
  readonly users = Users;
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/StatCard',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Dashboard: Story = {
  render: () => ({
    template: `<stat-card-dashboard-wrapper />`,
    moduleMetadata: { imports: [DashboardWrapper] },
  }),
};

export const WithoutChange: Story = {
  render: () => ({
    template: `<stat-card-simple-wrapper />`,
    moduleMetadata: { imports: [SimpleWrapper] },
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `<stat-card-loading-wrapper />`,
    moduleMetadata: { imports: [LoadingWrapper] },
  }),
};
