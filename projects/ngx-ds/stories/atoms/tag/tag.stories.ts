import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { TagComponent } from '../../../src/lib/atoms/tag/tag.component';
import { Check, Star, Zap, Tag, Flame, Clock, Bell, Lock, Globe } from 'lucide-angular';

// ── Default Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'tag-default-wrapper',
  standalone: true,
  imports: [TagComponent],
  template: `
    <div class="p-6 flex flex-wrap items-center gap-3">
      <ngx-ds-tag label="Primary" color="primary" variant="soft" />
      <ngx-ds-tag label="Success" color="success" variant="soft" [iconLeft]="iconCheck" />
      <ngx-ds-tag label="Danger" color="danger" variant="solid" />
      <ngx-ds-tag label="Warning" color="warning" variant="outline" />
      <ngx-ds-tag label="Dismissible" color="secondary" variant="soft" [dismissible]="true" />
    </div>
  `,
})
class DefaultWrapper {
  readonly iconCheck = Check;
}

// ── Variants Wrapper ──────────────────────────────────────────────────────────

@Component({
  selector: 'tag-variants-wrapper',
  standalone: true,
  imports: [TagComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Soft (por defecto)</p>
        <div class="flex flex-wrap gap-2">
          <ngx-ds-tag label="Primary" color="primary" variant="soft" />
          <ngx-ds-tag label="Secondary" color="secondary" variant="soft" />
          <ngx-ds-tag label="Danger" color="danger" variant="soft" />
          <ngx-ds-tag label="Success" color="success" variant="soft" />
          <ngx-ds-tag label="Warning" color="warning" variant="soft" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Solid</p>
        <div class="flex flex-wrap gap-2">
          <ngx-ds-tag label="Primary" color="primary" variant="solid" />
          <ngx-ds-tag label="Secondary" color="secondary" variant="solid" />
          <ngx-ds-tag label="Danger" color="danger" variant="solid" />
          <ngx-ds-tag label="Success" color="success" variant="solid" />
          <ngx-ds-tag label="Warning" color="warning" variant="solid" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Outline</p>
        <div class="flex flex-wrap gap-2">
          <ngx-ds-tag label="Primary" color="primary" variant="outline" />
          <ngx-ds-tag label="Secondary" color="secondary" variant="outline" />
          <ngx-ds-tag label="Danger" color="danger" variant="outline" />
          <ngx-ds-tag label="Success" color="success" variant="outline" />
          <ngx-ds-tag label="Warning" color="warning" variant="outline" />
        </div>
      </div>
    </div>
  `,
})
class VariantsWrapper {}

// ── Sizes Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'tag-sizes-wrapper',
  standalone: true,
  imports: [TagComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Soft — sm, md, lg</p>
        <div class="flex flex-wrap items-center gap-3">
          <ngx-ds-tag label="Small" color="primary" variant="soft" size="sm" />
          <ngx-ds-tag label="Medium" color="primary" variant="soft" size="md" />
          <ngx-ds-tag label="Large" color="primary" variant="soft" size="lg" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Solid — sm, md, lg</p>
        <div class="flex flex-wrap items-center gap-3">
          <ngx-ds-tag label="Small" color="danger" variant="solid" size="sm" />
          <ngx-ds-tag label="Medium" color="danger" variant="solid" size="md" />
          <ngx-ds-tag label="Large" color="danger" variant="solid" size="lg" />
        </div>
      </div>
    </div>
  `,
})
class SizesWrapper {}

// ── Icons Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'tag-icons-wrapper',
  standalone: true,
  imports: [TagComponent],
  template: `
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-gray-500 mb-3">Icono a la izquierda</p>
        <div class="flex flex-wrap gap-2">
          <ngx-ds-tag label="Verificado" color="success" variant="soft" [iconLeft]="iconCheck" />
          <ngx-ds-tag label="Destacado" color="warning" variant="soft" [iconLeft]="iconStar" />
          <ngx-ds-tag label="Activo" color="primary" variant="soft" [iconLeft]="iconZap" />
          <ngx-ds-tag label="Etiqueta" color="secondary" variant="outline" [iconLeft]="iconTag" />
          <ngx-ds-tag label="Popular" color="danger" variant="solid" [iconLeft]="iconFlame" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Icono a la derecha</p>
        <div class="flex flex-wrap gap-2">
          <ngx-ds-tag label="Pendiente" color="warning" variant="soft" [iconRight]="iconClock" />
          <ngx-ds-tag label="Notificación" color="primary" variant="soft" [iconRight]="iconBell" />
          <ngx-ds-tag label="Privado" color="secondary" variant="outline" [iconRight]="iconLock" />
          <ngx-ds-tag label="Público" color="success" variant="soft" [iconRight]="iconGlobe" />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Ambos iconos</p>
        <div class="flex flex-wrap gap-2">
          <ngx-ds-tag
            label="Verificado"
            color="success"
            variant="soft"
            [iconLeft]="iconCheck"
            [iconRight]="iconGlobe"
          />
          <ngx-ds-tag
            label="Activo"
            color="primary"
            variant="solid"
            [iconLeft]="iconZap"
            [iconRight]="iconBell"
          />
        </div>
      </div>
    </div>
  `,
})
class IconsWrapper {
  readonly iconCheck = Check;
  readonly iconStar = Star;
  readonly iconZap = Zap;
  readonly iconTag = Tag;
  readonly iconFlame = Flame;
  readonly iconClock = Clock;
  readonly iconBell = Bell;
  readonly iconLock = Lock;
  readonly iconGlobe = Globe;
}

// ── Dismissible Wrapper ───────────────────────────────────────────────────────

@Component({
  selector: 'tag-dismissible-wrapper',
  standalone: true,
  imports: [TagComponent],
  template: `
    <div class="p-6 space-y-4">
      <p class="text-sm text-gray-500 mb-3">Tags descartables</p>
      <div class="flex flex-wrap gap-2">
        @for (tag of tags; track tag.label) {
          <ngx-ds-tag
            [label]="tag.label"
            [color]="tag.color"
            variant="soft"
            [dismissible]="true"
            (dismissed)="remove(tag.label)"
          />
        }
      </div>
      <p class="text-xs text-gray-500 mt-2">Haz clic en la × para descartar un tag.</p>
    </div>
  `,
})
class DismissibleWrapper {
  tags = [
    { label: 'Angular', color: 'danger' as const },
    { label: 'TypeScript', color: 'primary' as const },
    { label: 'Tailwind', color: 'success' as const },
    { label: 'Storybook', color: 'warning' as const },
    { label: 'Lucide', color: 'secondary' as const },
  ];

  remove(label: string): void {
    this.tags = this.tags.filter((t) => t.label !== label);
  }
}

// ── Rounded Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'tag-rounded-wrapper',
  standalone: true,
  imports: [TagComponent],
  template: `
    <div class="p-6 space-y-4">
      <div>
        <p class="text-sm text-gray-500 mb-3">Pill (rounded=true, por defecto)</p>
        <div class="flex flex-wrap gap-2">
          <ngx-ds-tag label="Primary" color="primary" variant="soft" [rounded]="true" />
          <ngx-ds-tag label="Success" color="success" variant="solid" [rounded]="true" />
          <ngx-ds-tag label="Danger" color="danger" variant="outline" [rounded]="true" />
          <ngx-ds-tag
            label="Con icono"
            color="warning"
            variant="soft"
            [rounded]="true"
            [iconLeft]="iconStar"
          />
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-3">Sin redondear (rounded=false)</p>
        <div class="flex flex-wrap gap-2">
          <ngx-ds-tag label="Primary" color="primary" variant="soft" [rounded]="false" />
          <ngx-ds-tag label="Success" color="success" variant="solid" [rounded]="false" />
          <ngx-ds-tag label="Danger" color="danger" variant="outline" [rounded]="false" />
          <ngx-ds-tag
            label="Con icono"
            color="warning"
            variant="soft"
            [rounded]="false"
            [iconLeft]="iconStar"
          />
        </div>
      </div>
    </div>
  `,
})
class RoundedWrapper {
  readonly iconStar = Star;
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Atoms/Tag',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<tag-default-wrapper />`,
    moduleMetadata: { imports: [DefaultWrapper] },
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `<tag-variants-wrapper />`,
    moduleMetadata: { imports: [VariantsWrapper] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<tag-sizes-wrapper />`,
    moduleMetadata: { imports: [SizesWrapper] },
  }),
};

export const WithIcons: Story = {
  render: () => ({
    template: `<tag-icons-wrapper />`,
    moduleMetadata: { imports: [IconsWrapper] },
  }),
};

export const Dismissible: Story = {
  render: () => ({
    template: `<tag-dismissible-wrapper />`,
    moduleMetadata: { imports: [DismissibleWrapper] },
  }),
};

export const Rounded: Story = {
  render: () => ({
    template: `<tag-rounded-wrapper />`,
    moduleMetadata: { imports: [RoundedWrapper] },
  }),
};
