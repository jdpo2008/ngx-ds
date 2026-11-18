import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal, OnDestroy } from '@angular/core';
import { ProgressBarComponent } from '../../../src/lib/atoms/progress-bar/progress-bar.component';

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'pb-default-wrapper',
  standalone: true,
  imports: [ProgressBarComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-md">
      <ngx-ds-progress-bar [value]="25" label="Cargando..." [showValue]="true" />
      <ngx-ds-progress-bar [value]="50" label="Procesando" [showValue]="true" color="secondary" />
      <ngx-ds-progress-bar [value]="75" label="Casi listo" [showValue]="true" color="success" />
      <ngx-ds-progress-bar [value]="100" label="Completado" [showValue]="true" color="primary" />
    </div>
  `,
})
class DefaultWrapper {}

// ── Colors Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'pb-colors-wrapper',
  standalone: true,
  imports: [ProgressBarComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-md">
      <ngx-ds-progress-bar [value]="60" color="primary" label="Primary" [showValue]="true" />
      <ngx-ds-progress-bar [value]="60" color="secondary" label="Secondary" [showValue]="true" />
      <ngx-ds-progress-bar [value]="60" color="success" label="Success" [showValue]="true" />
      <ngx-ds-progress-bar [value]="60" color="warning" label="Warning" [showValue]="true" />
      <ngx-ds-progress-bar [value]="60" color="info" label="Info" [showValue]="true" />
      <ngx-ds-progress-bar [value]="60" color="danger" label="Danger" [showValue]="true" />
    </div>
  `,
})
class ColorsWrapper {}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'pb-sizes-wrapper',
  standalone: true,
  imports: [ProgressBarComponent],
  template: `
    <div class="p-6 flex flex-col gap-6 max-w-md">
      <div>
        <p class="text-sm text-gray-500 mb-2">Small</p>
        <ngx-ds-progress-bar [value]="65" size="sm" />
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">Medium (por defecto)</p>
        <ngx-ds-progress-bar [value]="65" size="md" />
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">Large</p>
        <ngx-ds-progress-bar [value]="65" size="lg" />
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── Striped Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'pb-striped-wrapper',
  standalone: true,
  imports: [ProgressBarComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-md">
      <div>
        <p class="text-sm text-gray-500 mb-3">Rayado estático</p>
        <div class="flex flex-col gap-3">
          <ngx-ds-progress-bar
            [value]="55"
            [striped]="true"
            color="primary"
            label="Primary"
            [showValue]="true"
          />
          <ngx-ds-progress-bar
            [value]="70"
            [striped]="true"
            color="success"
            label="Success"
            [showValue]="true"
          />
          <ngx-ds-progress-bar
            [value]="40"
            [striped]="true"
            color="warning"
            label="Warning"
            [showValue]="true"
          />
        </div>
      </div>
      <div class="mt-2">
        <p class="text-sm text-gray-500 mb-3">Rayado animado</p>
        <div class="flex flex-col gap-3">
          <ngx-ds-progress-bar
            [value]="55"
            [animated]="true"
            color="primary"
            label="Subiendo archivo…"
            [showValue]="true"
          />
          <ngx-ds-progress-bar
            [value]="30"
            [animated]="true"
            color="secondary"
            label="Procesando datos…"
            [showValue]="true"
          />
          <ngx-ds-progress-bar
            [value]="80"
            [animated]="true"
            color="success"
            label="Sincronizando…"
            [showValue]="true"
          />
        </div>
      </div>
    </div>
  `,
})
class StripedWrapper {}

// ── Rounded Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'pb-rounded-wrapper',
  standalone: true,
  imports: [ProgressBarComponent],
  template: `
    <div class="p-6 flex flex-col gap-6 max-w-md">
      <div>
        <p class="text-sm text-gray-500 mb-2">Redondeado (por defecto)</p>
        <ngx-ds-progress-bar [value]="65" size="lg" [rounded]="true" />
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-2">Cuadrado</p>
        <ngx-ds-progress-bar [value]="65" size="lg" [rounded]="false" />
      </div>
    </div>
  `,
})
class RoundedWrapper {}

// ── Interactive Wrapper ───────────────────────────────────────────────────────

@Component({
  selector: 'pb-interactive-wrapper',
  standalone: true,
  imports: [ProgressBarComponent],
  template: `
    <div class="p-6 flex flex-col gap-6 max-w-md">
      <p class="text-sm text-gray-500">Simulación de carga con progreso automático</p>

      <ngx-ds-progress-bar
        [value]="progress()"
        [color]="progressColor()"
        [label]="progressLabel()"
        [showValue]="true"
        [animated]="progress() < 100"
        size="lg"
      />

      <div class="flex gap-3">
        <button
          class="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
          (click)="reset()"
        >
          Reiniciar
        </button>
        <button
          class="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
          (click)="start()"
          [disabled]="running()"
        >
          {{ running() ? 'Cargando…' : 'Iniciar carga' }}
        </button>
      </div>
    </div>
  `,
})
class InteractiveWrapper implements OnDestroy {
  progress = signal(0);
  running = signal(false);
  private timer?: ReturnType<typeof setInterval>;

  readonly progressColor = () => {
    const p = this.progress();
    if (p < 40) return 'primary' as const;
    if (p < 80) return 'warning' as const;
    return 'success' as const;
  };

  readonly progressLabel = () => {
    const p = this.progress();
    if (p === 0) return 'Esperando…';
    if (p < 100) return `Cargando archivos… (${p}%)`;
    return '¡Carga completada!';
  };

  start(): void {
    if (this.running()) return;
    this.running.set(true);
    this.timer = setInterval(() => {
      const next = Math.min(100, this.progress() + Math.floor(Math.random() * 8) + 2);
      this.progress.set(next);
      if (next >= 100) {
        this.running.set(false);
        clearInterval(this.timer);
      }
    }, 300);
  }

  reset(): void {
    clearInterval(this.timer);
    this.progress.set(0);
    this.running.set(false);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}

// ── Real World Wrapper ────────────────────────────────────────────────────────

@Component({
  selector: 'pb-real-world-wrapper',
  standalone: true,
  imports: [ProgressBarComponent],
  template: `
    <div class="p-6 max-w-md space-y-6">
      <div>
        <p class="text-sm font-semibold text-gray-700 mb-3">Habilidades</p>
        <div class="flex flex-col gap-3">
          <ngx-ds-progress-bar
            [value]="90"
            color="primary"
            label="Angular"
            [showValue]="true"
            size="lg"
          />
          <ngx-ds-progress-bar
            [value]="78"
            color="success"
            label="TypeScript"
            [showValue]="true"
            size="lg"
          />
          <ngx-ds-progress-bar
            [value]="65"
            color="warning"
            label="Node.js"
            [showValue]="true"
            size="lg"
          />
          <ngx-ds-progress-bar
            [value]="45"
            color="secondary"
            label="Python"
            [showValue]="true"
            size="lg"
          />
        </div>
      </div>

      <div>
        <p class="text-sm font-semibold text-gray-700 mb-3">Almacenamiento</p>
        <ngx-ds-progress-bar
          [value]="73"
          color="warning"
          label="Disco utilizado"
          [showValue]="true"
          [striped]="true"
          size="lg"
        />
        <p class="text-xs text-gray-500 mt-1">7.3 GB de 10 GB utilizados</p>
      </div>

      <div>
        <p class="text-sm font-semibold text-gray-700 mb-3">Estado de tareas</p>
        <div class="flex flex-col gap-2">
          <ngx-ds-progress-bar [value]="100" color="success" label="Diseño" [showValue]="true" />
          <ngx-ds-progress-bar [value]="85" color="primary" label="Desarrollo" [showValue]="true" />
          <ngx-ds-progress-bar [value]="40" color="warning" label="QA" [showValue]="true" />
          <ngx-ds-progress-bar
            [value]="0"
            color="secondary"
            label="Despliegue"
            [showValue]="true"
          />
        </div>
      </div>
    </div>
  `,
})
class RealWorldWrapper {}

// ── Indeterminate Wrapper ─────────────────────────────────────────────────────

@Component({
  selector: 'pb-indeterminate-wrapper',
  standalone: true,
  imports: [ProgressBarComponent],
  template: `
    <div class="p-6 flex flex-col gap-4 max-w-md">
      <ngx-ds-progress-bar [indeterminate]="true" label="Cargando…" color="primary" />
      <ngx-ds-progress-bar
        [indeterminate]="true"
        label="Sincronizando…"
        color="secondary"
        size="lg"
      />
    </div>
  `,
})
class IndeterminateWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Atoms/ProgressBar',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<pb-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `<pb-colors-wrapper />`,
    moduleMetadata: { imports: [ColorsWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<pb-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const Striped: Story = {
  render: () => ({
    template: `<pb-striped-wrapper />`,
    moduleMetadata: { imports: [StripedWrapper] },
  }),
};

export const Rounded: Story = {
  render: () => ({
    template: `<pb-rounded-wrapper />`,
    moduleMetadata: { imports: [RoundedWrapper] },
  }),
};

export const Interactive: Story = {
  render: () => ({
    template: `<pb-interactive-wrapper />`,
    moduleMetadata: { imports: [InteractiveWrapper] },
  }),
};

export const RealWorld: Story = {
  render: () => ({
    template: `<pb-real-world-wrapper />`,
    moduleMetadata: { imports: [RealWorldWrapper] },
  }),
};

export const Indeterminate: Story = {
  render: () => ({
    template: `<pb-indeterminate-wrapper />`,
    moduleMetadata: { imports: [IndeterminateWrapper] },
  }),
};
