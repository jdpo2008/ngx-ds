import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { SplitterComponent } from '../../../src/lib/organisms/splitter/splitter.component';

const PANE = 'padding: 1rem; font-size: 0.875rem; color: #374151';

// ── Default ───────────────────────────────────────────────────

@Component({
  selector: 'splitter-default-wrapper',
  standalone: true,
  imports: [SplitterComponent],
  template: `
    <div style="height: 320px; margin: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem">
      <ngx-ds-splitter [(size)]="size" (resizeEnd)="last.set($event)">
        <div splitter-start style="${PANE}; background: #f9fafb; height: 100%">
          <strong>Panel izquierdo</strong>
          <p>Arrastra el divisor o usa las flechas con el foco en él.</p>
        </div>
        <div splitter-end style="${PANE}">
          <strong>Panel derecho</strong>
          <p>Enter colapsa el primer panel y lo restaura.</p>
        </div>
      </ngx-ds-splitter>
    </div>
    <p style="margin: 0 1.5rem; font-size: 0.875rem; color: #6b7280">
      Tamaño: {{ size() }}% · último resizeEnd: {{ last() ?? '—' }}
    </p>
  `,
})
class DefaultWrapper {
  readonly size = signal(35);
  readonly last = signal<number | null>(null);
}

// ── Vertical ──────────────────────────────────────────────────

@Component({
  selector: 'splitter-vertical-wrapper',
  standalone: true,
  imports: [SplitterComponent],
  template: `
    <div style="height: 400px; margin: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem">
      <ngx-ds-splitter orientation="vertical" [size]="60" [min]="20" [max]="80">
        <div splitter-start style="${PANE}">
          <strong>Editor</strong>
        </div>
        <div splitter-end style="${PANE}; background: #f9fafb; height: 100%">
          <strong>Consola</strong>
        </div>
      </ngx-ds-splitter>
    </div>
  `,
})
class VerticalWrapper {}

// ── Nested ────────────────────────────────────────────────────

@Component({
  selector: 'splitter-nested-wrapper',
  standalone: true,
  imports: [SplitterComponent],
  template: `
    <div style="height: 420px; margin: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem">
      <ngx-ds-splitter [size]="25" ariaLabel="Redimensionar barra lateral">
        <div splitter-start style="${PANE}; background: #f9fafb; height: 100%">
          <strong>Explorador</strong>
        </div>
        <ngx-ds-splitter
          splitter-end
          orientation="vertical"
          [size]="70"
          ariaLabel="Redimensionar terminal"
        >
          <div splitter-start style="${PANE}"><strong>Editor</strong></div>
          <div splitter-end style="${PANE}; background: #f9fafb; height: 100%">
            <strong>Terminal</strong>
          </div>
        </ngx-ds-splitter>
      </ngx-ds-splitter>
    </div>
  `,
})
class NestedWrapper {}

// ── Disabled ──────────────────────────────────────────────────

@Component({
  selector: 'splitter-disabled-wrapper',
  standalone: true,
  imports: [SplitterComponent],
  template: `
    <div style="height: 240px; margin: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem">
      <ngx-ds-splitter [size]="40" [disabled]="true">
        <div splitter-start style="${PANE}; background: #f9fafb; height: 100%">Fijo (40%)</div>
        <div splitter-end style="${PANE}">Fijo (60%)</div>
      </ngx-ds-splitter>
    </div>
  `,
})
class DisabledWrapper {}

const meta: Meta = {
  title: 'Organisms/Splitter',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<splitter-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `<splitter-vertical-wrapper />`,
    moduleMetadata: { imports: [VerticalWrapper] },
  }),
};

export const Nested: Story = {
  render: () => ({
    template: `<splitter-nested-wrapper />`,
    moduleMetadata: { imports: [NestedWrapper] },
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<splitter-disabled-wrapper />`,
    moduleMetadata: { imports: [DisabledWrapper] },
  }),
};
