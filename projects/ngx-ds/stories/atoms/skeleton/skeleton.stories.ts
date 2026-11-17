import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import {
  SkeletonComponent,
  SkeletonVariant,
} from '../../../src/lib/atoms/skeleton/skeleton.component';

// ── Card Wrapper ──────────────────────────────────────────────────────────────

@Component({
  selector: 'skeleton-card-wrapper',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <div class="p-6" style="max-width: 24rem; display: flex; flex-direction: column; gap: 1.5rem;">
      @for (i of [1, 2, 3]; track i) {
        <div style="display:flex; gap:0.75rem; align-items:flex-start;">
          <ngx-ds-skeleton variant="circle" width="2.5rem" height="2.5rem" />
          <div
            style="flex:1; display:flex; flex-direction:column; gap:0.5rem; padding-top:0.25rem;"
          >
            <ngx-ds-skeleton variant="text" width="60%" />
            <ngx-ds-skeleton variant="text" [lines]="2" />
          </div>
        </div>
      }
    </div>
  `,
})
class CardWrapper {}

// ── Table Wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'skeleton-table-wrapper',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <div class="p-6" style="max-width: 36rem;">
      <!-- Header -->
      <div style="display:flex; gap:1rem; margin-bottom:0.75rem;">
        <ngx-ds-skeleton width="6rem" height="0.875rem" />
        <ngx-ds-skeleton width="8rem" height="0.875rem" />
        <ngx-ds-skeleton width="5rem" height="0.875rem" />
        <ngx-ds-skeleton width="4rem" height="0.875rem" />
      </div>
      <ngx-ds-skeleton height="1px" style="margin-bottom:0.75rem;" />
      <!-- Rows -->
      @for (row of [1, 2, 3, 4, 5]; track row) {
        <div style="display:flex; gap:1rem; margin-bottom:0.75rem; align-items:center;">
          <ngx-ds-skeleton variant="circle" width="1.75rem" height="1.75rem" />
          <ngx-ds-skeleton width="7rem" height="0.875rem" />
          <ngx-ds-skeleton width="9rem" height="0.875rem" />
          <ngx-ds-skeleton width="3rem" height="1.25rem" />
          <ngx-ds-skeleton width="3.5rem" height="0.875rem" />
        </div>
      }
    </div>
  `,
})
class TableWrapper {}

// ── Profile Wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'skeleton-profile-wrapper',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <div class="p-6" style="max-width: 20rem;">
      <div
        style="display:flex; flex-direction:column; align-items:center; gap:1rem; margin-bottom:1.5rem;"
      >
        <ngx-ds-skeleton variant="circle" width="5rem" height="5rem" />
        <div
          style="width:100%; display:flex; flex-direction:column; align-items:center; gap:0.5rem;"
        >
          <ngx-ds-skeleton width="8rem" height="1.25rem" />
          <ngx-ds-skeleton width="12rem" height="0.875rem" />
        </div>
      </div>
      <ngx-ds-skeleton height="1px" style="margin-bottom:1rem;" />
      <ngx-ds-skeleton variant="text" [lines]="4" />
    </div>
  `,
})
class ProfileWrapper {}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Atoms/Skeleton',
};

export default meta;
type Story = StoryObj;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'rect' as SkeletonVariant,
    width: '100%',
    height: '1.25rem',
    lines: 1,
    animated: true,
  },
  argTypes: {
    variant: { control: 'radio', options: ['rect', 'circle', 'text'] },
    width: { control: 'text' },
    height: { control: 'text' },
    lines: { control: 'number' },
    animated: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 1.5rem; max-width: 24rem;">
        <ngx-ds-skeleton
          [variant]="variant"
          [width]="width"
          [height]="height"
          [lines]="lines"
          [animated]="animated"
        />
      </div>
    `,
    moduleMetadata: { imports: [SkeletonComponent] },
  }),
};

export const CardLoading: Story = {
  render: () => ({
    template: `<skeleton-card-wrapper />`,
    moduleMetadata: { imports: [CardWrapper] },
  }),
};

export const TableLoading: Story = {
  render: () => ({
    template: `<skeleton-table-wrapper />`,
    moduleMetadata: { imports: [TableWrapper] },
  }),
};

export const ProfileLoading: Story = {
  render: () => ({
    template: `<skeleton-profile-wrapper />`,
    moduleMetadata: { imports: [ProfileWrapper] },
  }),
};
