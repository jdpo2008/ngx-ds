import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import {
  SegmentedControlComponent,
  SegmentOption,
} from '../../../src/lib/molecules/segmented-control/segmented-control.component';

@Component({
  selector: 'seg-basic-wrapper',
  standalone: true,
  imports: [SegmentedControlComponent],
  template: `
    <div class="p-6" style="display:flex; flex-direction:column; gap:1.5rem;">
      <ngx-ds-segmented-control [options]="opts" [(value)]="view" />
      <ngx-ds-segmented-control [options]="opts" [(value)]="view" size="sm" />
      <ngx-ds-segmented-control [options]="opts" [(value)]="view" size="lg" />
      <ngx-ds-segmented-control [options]="opts" [(value)]="view" [fullWidth]="true" />
      <p style="font-size:0.8rem; color:#6b7280;">Seleccionado: {{ view() }}</p>
    </div>
  `,
})
class BasicWrapper {
  view = signal<string | number>('list');
  opts: SegmentOption[] = [
    { value: 'list', label: 'Lista' },
    { value: 'grid', label: 'Cuadrícula' },
    { value: 'table', label: 'Tabla' },
  ];
}

const meta: Meta = { title: 'Molecules/SegmentedControl' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { size: 'md', fullWidth: false },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
  },
  render: (args) => ({
    props: {
      ...args,
      value: 'list',
      opts: [
        { value: 'list', label: 'Lista' },
        { value: 'grid', label: 'Cuadrícula' },
        { value: 'table', label: 'Tabla' },
      ],
    },
    template: `
      <div style="padding:1.5rem;">
        <ngx-ds-segmented-control [options]="opts" [(value)]="value" [size]="size" [fullWidth]="fullWidth" />
      </div>
    `,
    moduleMetadata: { imports: [SegmentedControlComponent] },
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<seg-basic-wrapper />`,
    moduleMetadata: { imports: [BasicWrapper] },
  }),
};
