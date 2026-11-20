import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { TimelineComponent } from '../../../src/lib/organisms/timeline/timeline.component';
import { TimelineItemComponent } from '../../../src/lib/organisms/timeline/timeline-item.component';
import { CheckCircle, Circle, AlertCircle, Clock } from 'lucide-angular';

@Component({
  selector: 'timeline-wrapper',
  standalone: true,
  imports: [TimelineComponent, TimelineItemComponent],
  template: `
    <div class="p-6" style="max-width:480px;">
      <ngx-ds-timeline>
        <ngx-ds-timeline-item
          title="Pedido realizado"
          description="Tu pedido fue confirmado y está siendo procesado."
          time="Hoy, 10:30 AM"
          status="completed"
          [icon]="checkIcon"
        />
        <ngx-ds-timeline-item
          title="En preparación"
          description="El equipo está preparando tu pedido."
          time="Hoy, 11:15 AM"
          status="active"
          [icon]="clockIcon"
        />
        <ngx-ds-timeline-item
          title="En camino"
          description="Tu paquete será enviado próximamente."
          status="pending"
          [icon]="circleIcon"
        />
        <ngx-ds-timeline-item title="Entregado" status="pending" [icon]="circleIcon" />
      </ngx-ds-timeline>
    </div>
  `,
})
class Wrapper {
  readonly checkIcon = CheckCircle;
  readonly circleIcon = Circle;
  readonly alertIcon = AlertCircle;
  readonly clockIcon = Clock;
}

const meta: Meta = { title: 'Organisms/Timeline' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<timeline-wrapper />`,
    moduleMetadata: { imports: [Wrapper] },
  }),
};

@Component({
  selector: 'timeline-compact-wrapper',
  standalone: true,
  imports: [TimelineComponent, TimelineItemComponent],
  template: `
    <div class="p-6" style="max-width:480px;">
      <ngx-ds-timeline variant="compact">
        <ngx-ds-timeline-item title="Commit subido" time="09:12" status="completed" />
        <ngx-ds-timeline-item title="Tests" time="09:14" status="error" description="2 fallos" />
        <ngx-ds-timeline-item title="Revisión" status="active" />
        <ngx-ds-timeline-item title="Despliegue" status="pending" />
      </ngx-ds-timeline>
    </div>
  `,
})
class CompactWrapper {}

export const Compact: Story = {
  render: () => ({
    template: `<timeline-compact-wrapper />`,
    moduleMetadata: { imports: [CompactWrapper] },
  }),
};
