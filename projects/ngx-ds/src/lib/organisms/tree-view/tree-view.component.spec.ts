import { TestBed } from '@angular/core/testing';
import { TreeNode, TreeViewComponent } from './tree-view.component';

const NODES: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'app', label: 'app.ts' },
      { id: 'main', label: 'main.ts' },
    ],
  },
  { id: 'readme', label: 'README.md' },
  { id: 'lock', label: 'lock', disabled: true },
];

describe('TreeViewComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TreeViewComponent);
    for (const [k, v] of Object.entries({ nodes: NODES, ...inputs })) {
      fixture.componentRef.setInput(k, v);
    }
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const el = fixture.nativeElement as HTMLElement;
    const clicks: TreeNode[] = [];
    const toggles: { node: TreeNode; expanded: boolean }[] = [];
    cmp.nodeClick.subscribe((n) => clicks.push(n));
    cmp.nodeToggle.subscribe((e) => toggles.push(e));
    const items = () => Array.from(el.querySelectorAll<HTMLElement>('[role="treeitem"]'));
    const row = (label: string) =>
      items()
        .find((i) => i.querySelector('.tree-node__label')?.textContent?.trim() === label)!
        .querySelector<HTMLElement>('.tree-node__label')!.parentElement!;
    const click = (target: HTMLElement) => {
      target.click();
      fixture.detectChanges();
    };
    return { fixture, cmp, el, items, row, click, clicks, toggles };
  }

  it('renders only root nodes while collapsed', () => {
    const { items, el } = setup();
    expect(items().length).toBe(3);
    expect(items()[0].getAttribute('aria-expanded')).toBe('false');
    expect(items()[1].hasAttribute('aria-expanded')).toBe(false);
    expect(el.querySelector('[role="group"]')).toBeNull();
  });

  it('expands and collapses a node with its toggle', () => {
    const { cmp, el, items, click, toggles } = setup();
    click(el.querySelector<HTMLElement>('.tree-node__toggle')!);
    expect(cmp.expanded()).toEqual(['src']);
    expect(items().length).toBe(5);
    expect(toggles).toEqual([{ node: NODES[0], expanded: true }]);
    expect(cmp.selected()).toEqual([]);
    click(el.querySelector<HTMLElement>('.tree-node__toggle')!);
    expect(cmp.expanded()).toEqual([]);
    expect(toggles[1].expanded).toBe(false);
  });

  it('toggles selection on row click and emits nodeClick', () => {
    const { cmp, row, items, click, clicks } = setup();
    click(row('README.md'));
    expect(cmp.selected()).toEqual(['readme']);
    expect(items()[1].getAttribute('aria-selected')).toBe('true');
    expect(clicks.map((n) => n.id)).toEqual(['readme']);
    click(row('README.md'));
    expect(cmp.selected()).toEqual([]);
  });

  it('selects nested nodes', () => {
    const { cmp, row, click } = setup({ expanded: ['src'] });
    click(row('main.ts'));
    expect(cmp.selected()).toEqual(['main']);
  });

  it('ignores disabled nodes', () => {
    const { cmp, row, click } = setup();
    click(row('lock'));
    expect(cmp.selected()).toEqual([]);
  });

  it('does not select when selectable is false', () => {
    const { cmp, row, click } = setup({ selectable: false });
    click(row('README.md'));
    expect(cmp.selected()).toEqual([]);
  });
});
