import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { AvatarGroupComponent } from '../../../src/lib/molecules/avatar-group/avatar-group.component';
import { AvatarComponent } from '../../../src/lib/atoms/avatar/avatar.component';

// ── Basic Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'avatar-group-basic-wrapper',
  standalone: true,
  imports: [AvatarGroupComponent, AvatarComponent],
  template: `
    <div class="p-6">
      <ngx-ds-avatar-group [max]="4">
        <ngx-ds-avatar initials="AB" color="primary" />
        <ngx-ds-avatar initials="CD" color="secondary" />
        <ngx-ds-avatar initials="EF" color="success" />
        <ngx-ds-avatar initials="GH" color="warning" />
        <ngx-ds-avatar initials="IJ" color="danger" />
        <ngx-ds-avatar initials="KL" color="neutral" />
      </ngx-ds-avatar-group>
    </div>
  `,
})
class BasicWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Molecules/AvatarGroup',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `<avatar-group-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};
