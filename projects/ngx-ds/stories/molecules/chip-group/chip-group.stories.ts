import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import {
  ChipGroupComponent,
  ChipItem,
} from '../../../src/lib/molecules/chip-group/chip-group.component';

const TAGS: ChipItem[] = [
  { value: 'angular', label: 'Angular' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'SolidJS', disabled: true },
];

@Component({
  selector: 'chip-group-wrapper',
  standalone: true,
  imports: [ChipGroupComponent],
  template: `
    <div class="p-6" style="display:flex; flex-direction:column; gap:1.5rem;">
      <ngx-ds-chip-group [chips]="tags" [(selected)]="sel" variant="soft" />
      <ngx-ds-chip-group [chips]="tags" [(selected)]="sel" variant="filled" />
      <ngx-ds-chip-group [chips]="tags" [(selected)]="sel" variant="outline" />
      <ngx-ds-chip-group
        [chips]="tags"
        [(selected)]="sel"
        [removable]="true"
        (removed)="onRemove($event)"
      />
      <p style="font-size:0.8rem;color:#6b7280;">Seleccionados: {{ sel().join(', ') }}</p>
    </div>
  `,
})
class Wrapper {
  tags = [...TAGS];
  sel = signal<(string | number)[]>([]);
  onRemove(chip: ChipItem): void {
    this.tags = this.tags.filter((t) => t.value !== chip.value);
  }
}

const meta: Meta = { title: 'Molecules/ChipGroup' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<chip-group-wrapper />`,
    moduleMetadata: { imports: [Wrapper] },
  }),
};
