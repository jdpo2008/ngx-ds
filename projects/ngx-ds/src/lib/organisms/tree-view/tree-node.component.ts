import { ChangeDetectionStrategy, Component, input, output, computed, inject } from '@angular/core';
import { ChevronRight } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import type { TreeNode } from './tree-view.component';
import { NGX_DS_LABELS } from '../../shared/labels';

@Component({
  selector: 'ngx-ds-tree-node',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './tree-node.component.html',
  styleUrl: './tree-node.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeComponent {
  readonly i18n = inject(NGX_DS_LABELS);

  readonly node = input.required<TreeNode>();
  readonly depth = input<number>(0);
  readonly selected = input<(string | number)[]>([]);
  readonly expanded = input<(string | number)[]>([]);
  readonly selectable = input<boolean>(true);

  readonly nodeSelect = output<TreeNode>();
  readonly nodeToggle = output<TreeNode>();

  readonly ChevronRight = ChevronRight;

  readonly hasChildren = computed(() => !!this.node().children?.length);
  readonly isSelected = computed(() => this.selected().includes(this.node().id));
  readonly isExpanded = computed(() => this.expanded().includes(this.node().id));
  readonly indent = computed(() => `${this.depth() * 1.25}rem`);

  readonly rowClasses = computed(() => {
    const cls = ['tree-node__row'];
    if (this.isSelected()) cls.push('tree-node__row--selected');
    if (this.node().disabled) cls.push('tree-node__row--disabled');
    return cls.join(' ');
  });

  select(): void {
    if (!this.node().disabled) this.nodeSelect.emit(this.node());
  }

  /** Row keys. Keys pressed on the toggle button are left to the button. */
  onRowKey(event: KeyboardEvent): void {
    if (event.target !== event.currentTarget) return;
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.select();
        break;
      case 'ArrowRight':
        if (this.hasChildren() && !this.isExpanded()) {
          event.preventDefault();
          this.nodeToggle.emit(this.node());
        }
        break;
      case 'ArrowLeft':
        if (this.hasChildren() && this.isExpanded()) {
          event.preventDefault();
          this.nodeToggle.emit(this.node());
        }
        break;
    }
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    if (this.hasChildren()) this.nodeToggle.emit(this.node());
  }

  bubbleSelect(node: TreeNode): void {
    this.nodeSelect.emit(node);
  }
  bubbleToggle(node: TreeNode): void {
    this.nodeToggle.emit(node);
  }
}
