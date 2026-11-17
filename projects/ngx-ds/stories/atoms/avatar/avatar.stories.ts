import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { AvatarComponent } from '../../../src/lib/atoms/avatar/avatar.component';

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'avatar-default-wrapper',
  standalone: true,
  imports: [AvatarComponent],
  template: `
    <div class="p-6 flex flex-wrap items-center gap-4">
      <ngx-ds-avatar initials="JD" color="primary" size="md" />
      <ngx-ds-avatar src="https://i.pravatar.cc/150?img=3" alt="Usuario" size="md" />
      <ngx-ds-avatar initials="AB" color="success" size="md" status="online" />
    </div>
  `,
})
class DefaultWrapper {}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'avatar-sizes-wrapper',
  standalone: true,
  imports: [AvatarComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Iniciales — xs, sm, md, lg, xl</p>
        <div class="flex flex-wrap items-end gap-4">
          <ngx-ds-avatar initials="XS" color="primary" size="xs" />
          <ngx-ds-avatar initials="SM" color="primary" size="sm" />
          <ngx-ds-avatar initials="MD" color="primary" size="md" />
          <ngx-ds-avatar initials="LG" color="primary" size="lg" />
          <ngx-ds-avatar initials="XL" color="primary" size="xl" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Foto — xs, sm, md, lg, xl</p>
        <div class="flex flex-wrap items-end gap-4">
          <ngx-ds-avatar src="https://i.pravatar.cc/150?img=5" alt="Usuario" size="xs" />
          <ngx-ds-avatar src="https://i.pravatar.cc/150?img=5" alt="Usuario" size="sm" />
          <ngx-ds-avatar src="https://i.pravatar.cc/150?img=5" alt="Usuario" size="md" />
          <ngx-ds-avatar src="https://i.pravatar.cc/150?img=5" alt="Usuario" size="lg" />
          <ngx-ds-avatar src="https://i.pravatar.cc/150?img=5" alt="Usuario" size="xl" />
        </div>
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── Colors Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'avatar-colors-wrapper',
  standalone: true,
  imports: [AvatarComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-3">Colores de fondo (iniciales)</p>
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-avatar initials="N" color="neutral" size="md" />
          <span class="text-xs text-gray-400">neutral</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-avatar initials="P" color="primary" size="md" />
          <span class="text-xs text-gray-400">primary</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-avatar initials="S" color="secondary" size="md" />
          <span class="text-xs text-gray-400">secondary</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-avatar initials="D" color="danger" size="md" />
          <span class="text-xs text-gray-400">danger</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-avatar initials="OK" color="success" size="md" />
          <span class="text-xs text-gray-400">success</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ngx-ds-avatar initials="W" color="warning" size="md" />
          <span class="text-xs text-gray-400">warning</span>
        </div>
      </div>
    </div>
  `,
})
class ColorsWrapper {}

// ── Shapes Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'avatar-shapes-wrapper',
  standalone: true,
  imports: [AvatarComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Circular (por defecto)</p>
        <div class="flex flex-wrap items-center gap-4">
          <ngx-ds-avatar initials="JD" color="primary" size="md" shape="circle" />
          <ngx-ds-avatar
            src="https://i.pravatar.cc/150?img=8"
            alt="Usuario"
            size="md"
            shape="circle"
          />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Cuadrado redondeado</p>
        <div class="flex flex-wrap items-center gap-4">
          <ngx-ds-avatar initials="JD" color="primary" size="md" shape="square" />
          <ngx-ds-avatar
            src="https://i.pravatar.cc/150?img=8"
            alt="Usuario"
            size="md"
            shape="square"
          />
        </div>
      </div>
    </div>
  `,
})
class ShapesWrapper {}

// ── Status Wrapper ────────────────────────────────────────────────────────────

@Component({
  selector: 'avatar-status-wrapper',
  standalone: true,
  imports: [AvatarComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Indicadores de estado</p>
        <div class="flex flex-wrap items-center gap-6">
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-avatar initials="ON" color="success" size="md" status="online" />
            <span class="text-xs text-gray-400">online</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-avatar initials="OF" color="secondary" size="md" status="offline" />
            <span class="text-xs text-gray-400">offline</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-avatar initials="AW" color="warning" size="md" status="away" />
            <span class="text-xs text-gray-400">away</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ngx-ds-avatar initials="BS" color="danger" size="md" status="busy" />
            <span class="text-xs text-gray-400">busy</span>
          </div>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Con foto</p>
        <div class="flex flex-wrap items-center gap-6">
          <ngx-ds-avatar
            src="https://i.pravatar.cc/150?img=12"
            alt="Usuario"
            size="md"
            status="online"
          />
          <ngx-ds-avatar
            src="https://i.pravatar.cc/150?img=12"
            alt="Usuario"
            size="md"
            status="offline"
          />
          <ngx-ds-avatar
            src="https://i.pravatar.cc/150?img=12"
            alt="Usuario"
            size="md"
            status="away"
          />
          <ngx-ds-avatar
            src="https://i.pravatar.cc/150?img=12"
            alt="Usuario"
            size="md"
            status="busy"
          />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Tamaños con estado</p>
        <div class="flex flex-wrap items-end gap-4">
          <ngx-ds-avatar initials="XS" color="primary" size="xs" status="online" />
          <ngx-ds-avatar initials="SM" color="primary" size="sm" status="online" />
          <ngx-ds-avatar initials="MD" color="primary" size="md" status="online" />
          <ngx-ds-avatar initials="LG" color="primary" size="lg" status="online" />
          <ngx-ds-avatar initials="XL" color="primary" size="xl" status="online" />
        </div>
      </div>
    </div>
  `,
})
class StatusWrapper {}

// ── Bordered Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'avatar-bordered-wrapper',
  standalone: true,
  imports: [AvatarComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-3">Con borde blanco (para fondos de color)</p>
      <div class="flex flex-wrap items-center gap-4 bg-blue-500 p-4 rounded-lg">
        <ngx-ds-avatar initials="JD" color="primary" size="md" [bordered]="true" />
        <ngx-ds-avatar initials="AB" color="success" size="md" [bordered]="true" />
        <ngx-ds-avatar initials="XY" color="warning" size="md" [bordered]="true" />
        <ngx-ds-avatar
          src="https://i.pravatar.cc/150?img=7"
          alt="Usuario"
          size="md"
          [bordered]="true"
        />
        <ngx-ds-avatar
          src="https://i.pravatar.cc/150?img=7"
          alt="Usuario"
          size="lg"
          [bordered]="true"
          status="online"
        />
      </div>
    </div>
  `,
})
class BorderedWrapper {}

// ── Group Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'avatar-group-wrapper',
  standalone: true,
  imports: [AvatarComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-3">Grupo superpuesto (usando CSS margin negativo)</p>
      <div class="flex -space-x-2">
        <ngx-ds-avatar
          src="https://i.pravatar.cc/150?img=1"
          alt="Usuario 1"
          size="md"
          [bordered]="true"
        />
        <ngx-ds-avatar
          src="https://i.pravatar.cc/150?img=2"
          alt="Usuario 2"
          size="md"
          [bordered]="true"
        />
        <ngx-ds-avatar
          src="https://i.pravatar.cc/150?img=3"
          alt="Usuario 3"
          size="md"
          [bordered]="true"
        />
        <ngx-ds-avatar initials="+5" color="neutral" size="md" [bordered]="true" />
      </div>
    </div>
  `,
})
class GroupWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Atoms/Avatar',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<avatar-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<avatar-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `<avatar-colors-wrapper />`,
    moduleMetadata: { imports: [ColorsWrapper] },
  }),
};

export const Shapes: Story = {
  render: () => ({
    template: `<avatar-shapes-wrapper />`,
    moduleMetadata: { imports: [ShapesWrapper] },
  }),
};

export const Status: Story = {
  render: () => ({
    template: `<avatar-status-wrapper />`,
    moduleMetadata: { imports: [StatusWrapper] },
  }),
};

export const Bordered: Story = {
  render: () => ({
    template: `<avatar-bordered-wrapper />`,
    moduleMetadata: { imports: [BorderedWrapper] },
  }),
};

export const Group: Story = {
  render: () => ({
    template: `<avatar-group-wrapper />`,
    moduleMetadata: { imports: [GroupWrapper] },
  }),
};
