import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { TreeNodeComponent } from './tree-node.component';

export interface TreeNode {
  id: string | number;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
  data?: unknown;
}

@Component({
  selector: 'ngx-ds-tree-view',
  standalone: true,
  imports: [TreeNodeComponent],
  templateUrl: './tree-view.component.html',
  styleUrl: './tree-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeViewComponent {
  readonly nodes = input<TreeNode[]>([]);
  readonly selected = model<(string | number)[]>([]);
  readonly expanded = model<(string | number)[]>([]);
  readonly selectable = input<boolean>(true);

  readonly nodeClick = output<TreeNode>();
  readonly nodeToggle = output<{ node: TreeNode; expanded: boolean }>();

  isSelected(node: TreeNode): boolean {
    return this.selected().includes(node.id);
  }

  isExpanded(node: TreeNode): boolean {
    return this.expanded().includes(node.id);
  }

  onSelect(node: TreeNode): void {
    if (!this.selectable() || node.disabled) return;
    const current = this.selected();
    const idx = current.indexOf(node.id);
    this.selected.set(idx >= 0 ? current.filter((id) => id !== node.id) : [...current, node.id]);
    this.nodeClick.emit(node);
  }

  onToggle(node: TreeNode): void {
    const current = this.expanded();
    const idx = current.indexOf(node.id);
    const isNowExpanded = idx < 0;
    this.expanded.set(
      isNowExpanded ? [...current, node.id] : current.filter((id) => id !== node.id),
    );
    this.nodeToggle.emit({ node, expanded: isNowExpanded });
  }
}
