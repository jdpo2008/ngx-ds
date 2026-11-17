import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { KbdComponent } from '../../../src/lib/atoms/kbd/kbd.component';

@Component({
  selector: 'kbd-wrapper',
  standalone: true,
  imports: [KbdComponent],
  template: `
    <div class="p-6" style="display:flex; flex-direction:column; gap:1.5rem;">
      <div style="display:flex; gap:0.5rem; align-items:center;">
        <ngx-ds-kbd>Ctrl</ngx-ds-kbd>
        <span style="font-size:0.875rem; color:#6b7280;">+</span>
        <ngx-ds-kbd>K</ngx-ds-kbd>
        <span style="font-size:0.875rem; margin-left:0.5rem; color:#6b7280;">Abrir búsqueda</span>
      </div>

      <div style="display:flex; gap:0.5rem; align-items:center;">
        <ngx-ds-kbd>⌘</ngx-ds-kbd>
        <span style="font-size:0.875rem; color:#6b7280;">+</span>
        <ngx-ds-kbd>Shift</ngx-ds-kbd>
        <span style="font-size:0.875rem; color:#6b7280;">+</span>
        <ngx-ds-kbd>P</ngx-ds-kbd>
      </div>

      <div style="display:flex; gap:0.5rem; align-items:center;">
        <ngx-ds-kbd size="sm">Esc</ngx-ds-kbd>
        <ngx-ds-kbd size="md">Enter</ngx-ds-kbd>
        <ngx-ds-kbd size="lg">Tab</ngx-ds-kbd>
      </div>
    </div>
  `,
})
class Wrapper {}

const meta: Meta = { title: 'Atoms/Kbd' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { size: 'md' },
  argTypes: { size: { control: 'radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => ({
    props: args,
    template: `<div style="padding:1.5rem;"><ngx-ds-kbd [size]="size">Ctrl + K</ngx-ds-kbd></div>`,
    moduleMetadata: { imports: [KbdComponent] },
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `<kbd-wrapper />`,
    moduleMetadata: { imports: [Wrapper] },
  }),
};
