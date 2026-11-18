import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { NotificationCenterComponent } from '../../../src/lib/organisms/notification-center/notification-center.component';
import type { NgxNotification } from '../../../src/lib/organisms/notification-center/notification.types';

// ── Seed data ─────────────────────────────────────────────────────────────────

function minutesAgo(n: number): Date {
  return new Date(Date.now() - n * 60_000);
}

const SEED: NgxNotification[] = [
  {
    id: 1,
    type: 'success',
    title: 'Pago procesado correctamente',
    description: 'Tu pago de $250.00 ha sido confirmado.',
    time: minutesAgo(3),
    read: false,
    actionLabel: 'Ver recibo',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Suscripción próxima a vencer',
    description: 'Tu plan Pro vence en 3 días. Renueva para no perder acceso.',
    time: minutesAgo(45),
    read: false,
    actionLabel: 'Renovar ahora',
  },
  {
    id: 3,
    type: 'info',
    title: 'Nuevo comentario en tu proyecto',
    description: 'Ana García comentó: "Excelente trabajo, lo revisaré mañana."',
    time: minutesAgo(120),
    read: false,
  },
  {
    id: 4,
    type: 'danger',
    title: 'Error al sincronizar datos',
    description: 'No se pudo conectar con el servidor. Intenta de nuevo.',
    time: minutesAgo(300),
    read: true,
  },
  {
    id: 5,
    type: 'info',
    title: 'Actualización disponible',
    description: 'La versión 3.2.0 está lista para instalar.',
    time: minutesAgo(1440),
    read: true,
  },
];

// ── Interactive wrapper ───────────────────────────────────────────────────────

@Component({
  selector: 'nc-wrapper',
  standalone: true,
  imports: [NotificationCenterComponent],
  template: `
    <div
      style="padding:2rem; min-height:480px; display:flex; align-items:flex-start; justify-content:flex-end;"
    >
      <ngx-ds-notification-center
        [notifications]="items()"
        (markRead)="onMarkRead($event)"
        (markAllRead)="onMarkAllRead()"
        (dismissed)="onDismiss($event)"
        (dismissAll)="onDismissAll()"
        (action)="onAction($event)"
      />
    </div>
    <p
      style="position:fixed; bottom:1rem; left:1rem; font-size:0.75rem; color:var(--text-placeholder, #6b7280); margin:0;"
    >
      Última acción: {{ lastAction() }}
    </p>
  `,
})
class Wrapper {
  items = signal<NgxNotification[]>([...SEED]);
  lastAction = signal('ninguna');

  onMarkRead(n: NgxNotification): void {
    this.items.update((list) =>
      list.map((item) => (item.id === n.id ? { ...item, read: true } : item)),
    );
    this.lastAction.set(`Leída: "${n.title}"`);
  }

  onMarkAllRead(): void {
    this.items.update((list) => list.map((item) => ({ ...item, read: true })));
    this.lastAction.set('Todas marcadas como leídas');
  }

  onDismiss(n: NgxNotification): void {
    this.items.update((list) => list.filter((item) => item.id !== n.id));
    this.lastAction.set(`Descartada: "${n.title}"`);
  }

  onDismissAll(): void {
    this.items.set([]);
    this.lastAction.set('Todas descartadas');
  }

  onAction(n: NgxNotification): void {
    this.lastAction.set(`Acción en: "${n.title}"`);
  }
}

// ── Empty state wrapper ───────────────────────────────────────────────────────

@Component({
  selector: 'nc-empty-wrapper',
  standalone: true,
  imports: [NotificationCenterComponent],
  template: `
    <div style="padding:2rem; display:flex; justify-content:flex-end;">
      <ngx-ds-notification-center [notifications]="[]" />
    </div>
  `,
})
class EmptyWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = { title: 'Organisms/NotificationCenter' };
export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<nc-wrapper />`,
    moduleMetadata: { imports: [Wrapper] },
  }),
};

export const Empty: Story = {
  render: () => ({
    template: `<nc-empty-wrapper />`,
    moduleMetadata: { imports: [EmptyWrapper] },
  }),
};
