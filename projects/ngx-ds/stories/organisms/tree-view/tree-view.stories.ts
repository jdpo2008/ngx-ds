import { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import {
  TreeViewComponent,
  TreeNode,
} from '../../../src/lib/organisms/tree-view/tree-view.component';
import { TreeNodeComponent } from '../../../src/lib/organisms/tree-view/tree-node.component';

const TREE: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'app',
        label: 'app',
        children: [
          { id: 'app.ts', label: 'app.component.ts' },
          { id: 'app.html', label: 'app.component.html' },
        ],
      },
      {
        id: 'lib',
        label: 'lib',
        children: [
          { id: 'atoms', label: 'atoms', children: [{ id: 'btn', label: 'button' }] },
          { id: 'molecules', label: 'molecules', children: [{ id: 'inp', label: 'input' }] },
        ],
      },
    ],
  },
  { id: 'package.json', label: 'package.json' },
  { id: 'tsconfig.json', label: 'tsconfig.json' },
];

@Component({
  selector: 'tree-view-wrapper',
  standalone: true,
  imports: [TreeViewComponent, TreeNodeComponent],
  template: `
    <div class="p-6" style="max-width:380px;">
      <ngx-ds-tree-view [nodes]="tree" [(selected)]="sel" [(expanded)]="exp" />
      <p style="margin-top:1rem;font-size:0.8rem;color:#6b7280;">
        Seleccionados: {{ sel().join(', ') || 'ninguno' }}
      </p>
    </div>
  `,
})
class Wrapper {
  tree = TREE;
  sel = signal<(string | number)[]>([]);
  exp = signal<(string | number)[]>(['src', 'app']);
}

const meta: Meta = { title: 'Organisms/TreeView' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<tree-view-wrapper />`,
    moduleMetadata: { imports: [Wrapper, TreeNodeComponent] },
  }),
};
