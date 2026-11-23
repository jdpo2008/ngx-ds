import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TreeSelectComponent, TreeSelectNode, TreeSelectValue } from './tree-select.component';

const NODES: TreeSelectNode[] = [
  {
    id: 'fruit',
    label: 'Fruta',
    children: [
      { id: 'apple', label: 'Manzana' },
      { id: 'pear', label: 'Pera' },
      {
        id: 'citrus',
        label: 'Cítricos',
        children: [
          { id: 'lemon', label: 'Limón' },
          { id: 'orange', label: 'Naranja', disabled: true },
        ],
      },
    ],
  },
  { id: 'veg', label: 'Verdura', children: [{ id: 'carrot', label: 'Zanahoria' }] },
  { id: 'bread', label: 'Pan' },
];

function key(target: HTMLElement, k: string, init: KeyboardEventInit = {}): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...init }));
}

describe('TreeSelectComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TreeSelectComponent);
    fixture.componentRef.setInput('nodes', NODES);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const trigger = el.querySelector<HTMLElement>('[role="combobox"]')!;
    const rows = () => Array.from(el.querySelectorAll<HTMLElement>('[role="treeitem"]'));
    const row = (label: string) =>
      rows().find((r) => r.querySelector('.ts__row-label')?.textContent?.trim() === label)!;
    const labels = () => rows().map((r) => r.querySelector('.ts__row-label')!.textContent!.trim());
    const open = () => {
      trigger.click();
      fixture.detectChanges();
    };
    const tick = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    };
    return { fixture, cmp: fixture.componentInstance, el, trigger, rows, row, labels, open, tick };
  }

  it('opens a tree with the top-level nodes and tree semantics', () => {
    const { el, trigger, rows, labels, open } = setup({ label: 'Categoría' });
    expect(el.querySelector('.ts__placeholder')?.textContent).toContain('Seleccionar...');
    expect(trigger.getAttribute('aria-haspopup')).toBe('tree');
    open();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('[role="tree"]')?.getAttribute('aria-label')).toBe('Categoría');
    expect(labels()).toEqual(['Fruta', 'Verdura', 'Pan']);
    const first = rows()[0];
    expect(first.getAttribute('aria-level')).toBe('1');
    expect(first.getAttribute('aria-expanded')).toBe('false');
    expect(first.getAttribute('aria-posinset')).toBe('1');
    expect(first.getAttribute('aria-setsize')).toBe('3');
    expect(rows()[2].hasAttribute('aria-expanded')).toBe(false);
  });

  it('single mode: a parent click expands, a leaf click selects and closes', () => {
    const { fixture, cmp, el, trigger, row, labels, open } = setup();
    open();
    row('Fruta').click();
    fixture.detectChanges();
    expect(cmp.value()).toBeNull();
    expect(labels()).toEqual(['Fruta', 'Manzana', 'Pera', 'Cítricos', 'Verdura', 'Pan']);
    expect(row('Manzana').getAttribute('aria-level')).toBe('2');
    row('Pera').click();
    fixture.detectChanges();
    expect(cmp.value()).toBe('pear');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(el.querySelector('.ts__single')?.textContent).toContain('Pera');
  });

  it('selectableParents lets a parent be picked; the chevron still expands', () => {
    const { fixture, cmp, row, labels, open } = setup({ selectableParents: true });
    open();
    row('Verdura').querySelector<HTMLElement>('.ts__toggle')!.click();
    fixture.detectChanges();
    expect(labels()).toContain('Zanahoria');
    expect(cmp.value()).toBeNull();
    row('Verdura').click();
    expect(cmp.value()).toBe('veg');
  });

  it('reveals and marks the selected node on open', () => {
    const { row, open } = setup({ value: 'lemon' });
    open();
    expect(row('Limón').getAttribute('aria-selected')).toBe('true');
    expect(row('Limón').getAttribute('tabindex')).toBe('0');
    expect(row('Pan').getAttribute('aria-selected')).toBe('false');
  });

  it('multiple + cascade: checking a parent checks its enabled leaves', () => {
    const { fixture, cmp, el, row, open } = setup({ multiple: true, expanded: ['fruit'] });
    open();
    expect(el.querySelector('[role="tree"]')?.getAttribute('aria-multiselectable')).toBe('true');
    row('Fruta').click();
    fixture.detectChanges();
    // Naranja is disabled, so it stays out.
    expect(cmp.value()).toEqual(['apple', 'pear', 'lemon']);
    expect(row('Fruta').getAttribute('aria-checked')).toBe('mixed');
    expect(row('Cítricos').getAttribute('aria-checked')).toBe('mixed');
    expect(row('Pera').getAttribute('aria-checked')).toBe('true');
    expect(el.querySelectorAll('.ts__chip').length).toBe(3);

    // A second click unchecks them all; the panel stays open.
    row('Fruta').click();
    fixture.detectChanges();
    expect(cmp.value()).toEqual([]);
    expect(row('Fruta').getAttribute('aria-checked')).toBe('false');
  });

  it('multiple + cascade: a parent is checked when all its leaves are', () => {
    const { row, open } = setup({ multiple: true, value: ['carrot'], expanded: ['veg'] });
    open();
    expect(row('Verdura').getAttribute('aria-checked')).toBe('true');
  });

  it('multiple without cascade checks each node on its own', () => {
    const { fixture, cmp, row, open } = setup({ multiple: true, cascade: false });
    open();
    row('Fruta').click();
    fixture.detectChanges();
    expect(cmp.value()).toEqual(['fruit']);
    expect(row('Fruta').getAttribute('aria-checked')).toBe('true');
  });

  it('removes a chip without opening the panel', () => {
    const { fixture, cmp, el, trigger } = setup({ multiple: true, value: ['apple', 'bread'] });
    el.querySelector<HTMLButtonElement>('.ts__chip-remove')!.click();
    fixture.detectChanges();
    expect(cmp.value()).toEqual(['bread']);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('search keeps the matches and their ancestors, expanded', () => {
    const { fixture, el, labels, open } = setup({ searchable: true });
    open();
    const input = el.querySelector<HTMLInputElement>('.ts__search')!;
    input.value = 'lim';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(labels()).toEqual(['Fruta', 'Cítricos', 'Limón']);

    input.value = 'xyz';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(el.querySelector('.ts__empty')?.textContent).toContain('Sin resultados');
  });

  it('a matching parent keeps all its children', () => {
    const { fixture, el, labels, open } = setup({ searchable: true });
    open();
    const input = el.querySelector<HTMLInputElement>('.ts__search')!;
    input.value = 'cítr';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(labels()).toEqual(['Fruta', 'Cítricos']);
  });

  it('keyboard: arrows move, Right expands and enters, Left goes to the parent', async () => {
    const { fixture, cmp, trigger, row, tick } = setup();
    key(trigger, 'ArrowDown');
    await tick();
    expect(document.activeElement).toBe(row('Fruta'));

    key(row('Fruta'), 'ArrowRight');
    await tick();
    expect(row('Manzana')).toBeTruthy();
    key(row('Fruta'), 'ArrowRight');
    await tick();
    expect(document.activeElement).toBe(row('Manzana'));

    key(row('Manzana'), 'End');
    await tick();
    expect(document.activeElement).toBe(row('Pan'));
    key(row('Pan'), 'Home');
    await tick();
    expect(document.activeElement).toBe(row('Fruta'));

    key(row('Fruta'), 'ArrowDown');
    await tick();
    key(row('Manzana'), 'ArrowLeft');
    await tick();
    expect(document.activeElement).toBe(row('Fruta'));
    key(row('Fruta'), 'ArrowLeft');
    await tick();
    expect(row('Manzana')).toBeUndefined();

    key(row('Fruta'), 'ArrowDown');
    await tick();
    key(row('Verdura'), 'ArrowDown');
    await tick();
    key(row('Pan'), 'Enter');
    fixture.detectChanges();
    expect(cmp.value()).toBe('bread');
    expect(document.activeElement).toBe(trigger);
  });

  it('Escape closes and returns focus to the trigger', () => {
    const { fixture, trigger, row, open } = setup();
    open();
    row('Pan').focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('ignores disabled nodes and a disabled control', () => {
    const { fixture, cmp, trigger, row, open } = setup({ expanded: ['fruit', 'citrus'] });
    open();
    row('Naranja').click();
    expect(cmp.value()).toBeNull();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('tabindex')).toBe('-1');
  });

  it('works with reactive forms', () => {
    @Component({
      standalone: true,
      imports: [TreeSelectComponent, ReactiveFormsModule],
      template: `<ngx-ds-tree-select [nodes]="nodes" [multiple]="true" [formControl]="ctrl" />`,
    })
    class Host {
      nodes = NODES;
      ctrl = new FormControl<string[]>(['apple']);
    }
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.ts__chip').length).toBe(1);

    el.querySelector<HTMLButtonElement>('.ts__chip-remove')!.click();
    expect(fixture.componentInstance.ctrl.value).toEqual([]);
    expect(fixture.componentInstance.ctrl.touched).toBe(true);

    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();
    expect(el.querySelector('[role="combobox"]')?.getAttribute('aria-disabled')).toBe('true');
  });
});

describe('TreeSelectComponent behaviour', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TreeSelectComponent);
    fixture.componentRef.setInput('nodes', NODES);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    const cmp = fixture.componentInstance;
    const changes: TreeSelectValue[] = [];
    const touched = vi.fn();
    cmp.registerOnChange((v) => changes.push(v));
    cmp.registerOnTouched(touched);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    const el = fixture.nativeElement as HTMLElement;
    const trigger = el.querySelector<HTMLElement>('[role="combobox"]')!;
    const render = () => fixture.detectChanges();
    const rows = () => Array.from(el.querySelectorAll<HTMLElement>('[role="treeitem"]'));
    const row = (label: string) =>
      rows().find((r) => r.querySelector('.ts__row-label')?.textContent?.trim() === label)!;
    const labels = () => rows().map((r) => r.querySelector('.ts__row-label')!.textContent!.trim());
    const open = () => {
      trigger.click();
      render();
    };
    const tick = async () => {
      render();
      await fixture.whenStable();
    };
    const q = (s: string) => el.querySelector<HTMLElement>(s);
    return {
      fixture,
      cmp,
      el,
      trigger,
      render,
      rows,
      row,
      labels,
      open,
      tick,
      q,
      changes,
      touched,
    };
  }

  afterEach(() => document.body.replaceChildren());

  it('Escape and outside clicks mark touched only when they close the panel', () => {
    const { cmp, open, render, touched } = setup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    document.body.click();
    expect(touched).not.toHaveBeenCalled();
    open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(cmp.isOpen()).toBe(false);
    expect(touched).toHaveBeenCalledTimes(1);
    open();
    document.body.click();
    render();
    expect(cmp.isOpen()).toBe(false);
    expect(touched).toHaveBeenCalledTimes(2);
  });

  it('Tab on a row closes the panel and marks touched', () => {
    const { cmp, open, row, render, touched } = setup();
    open();
    key(row('Pan'), 'Tab');
    render();
    expect(cmp.isOpen()).toBe(false);
    expect(touched).toHaveBeenCalledOnce();
  });

  it('Enter on the trigger opens and focuses the first row; Enter again closes', async () => {
    const { cmp, trigger, rows, tick } = setup();
    trigger.focus();
    key(trigger, 'Enter');
    await tick();
    expect(cmp.isOpen()).toBe(true);
    expect(document.activeElement).toBe(rows()[0]);
    key(trigger, 'Enter');
    await tick();
    expect(cmp.isOpen()).toBe(false);
  });

  it('ArrowDown on an open trigger moves focus into the tree', async () => {
    const { trigger, open, rows, tick } = setup();
    open();
    key(trigger, 'ArrowDown');
    await tick();
    expect(document.activeElement).toBe(rows()[0]);
  });

  it('keys from a chip remove button do not open the panel', () => {
    const { cmp, q } = setup({ multiple: true, value: ['apple'] });
    key(q('.ts__chip-remove')!, 'Enter');
    expect(cmp.isOpen()).toBe(false);
  });

  it('Home and End jump to the first and last row', async () => {
    const { open, row, rows, tick } = setup();
    open();
    key(row('Verdura'), 'End');
    await tick();
    expect(document.activeElement).toBe(rows().at(-1));
    key(rows().at(-1)!, 'Home');
    await tick();
    expect(document.activeElement).toBe(rows()[0]);
  });

  it('ArrowDown in the search box focuses the first match', async () => {
    const { el, open, render, tick, row } = setup({ searchable: true });
    open();
    const search = el.querySelector<HTMLInputElement>('.ts__search')!;
    search.value = 'zanah';
    search.dispatchEvent(new Event('input'));
    render();
    key(search, 'a');
    key(search, 'ArrowDown');
    await tick();
    expect(document.activeElement).toBe(row('Verdura'));
  });

  it('a search with no matches shows the empty text', () => {
    const { el, open, render, rows, q } = setup({ searchable: true });
    open();
    const search = el.querySelector<HTMLInputElement>('.ts__search')!;
    search.value = 'zzz';
    search.dispatchEvent(new Event('input'));
    render();
    expect(rows().length).toBe(0);
    expect(q('.ts__empty')!.textContent!.trim()).toBe('Sin resultados');
  });

  it('closing clears the search', () => {
    const { cmp, el, open, render } = setup({ searchable: true });
    open();
    const search = el.querySelector<HTMLInputElement>('.ts__search')!;
    search.value = 'pan';
    search.dispatchEvent(new Event('input'));
    render();
    document.body.click();
    expect(cmp.search()).toBe('');
  });

  it('multiple: Enter toggles the row and keeps the panel open', () => {
    const { cmp, open, row, render } = setup({ multiple: true });
    open();
    key(row('Pan'), 'Enter');
    render();
    expect(cmp.value()).toEqual(['bread']);
    expect(cmp.isOpen()).toBe(true);
    key(row('Pan'), ' ');
    expect(cmp.value()).toEqual([]);
  });

  it('multiple: a partly checked parent is mixed', () => {
    const { open, row } = setup({
      multiple: true,
      value: ['lemon'],
      expanded: ['fruit', 'citrus'],
    });
    open();
    expect(row('Cítricos').getAttribute('aria-checked')).toBe('mixed');
    expect(row('Fruta').getAttribute('aria-checked')).toBe('mixed');
    expect(row('Limón').getAttribute('aria-checked')).toBe('true');
    expect(row('Pan').getAttribute('aria-checked')).toBe('false');
    expect(row('Cítricos').querySelector('.ts__check--on')).not.toBeNull();
  });

  it('chips skip ids that are not in the tree', () => {
    const { el } = setup({ multiple: true, value: ['ghost', 'pear'] });
    const chips = Array.from(el.querySelectorAll('.ts__chip')).map((c) => c.textContent!.trim());
    expect(chips).toEqual(['Pera']);
  });

  it('writeValue(null) gives [] in multiple mode and null in single mode', () => {
    const multi = setup({ multiple: true });
    multi.cmp.writeValue(null);
    expect(multi.cmp.value()).toEqual([]);
    const single = setup();
    single.cmp.writeValue(undefined);
    expect(single.cmp.value()).toBeNull();
  });

  it('a form-disabled control cannot open or remove chips', () => {
    const { cmp, trigger, render, el, changes } = setup({ multiple: true, value: ['apple'] });
    cmp.setDisabledState(true);
    render();
    expect(el.querySelector('.ts__chip-remove')).toBeNull();
    trigger.click();
    expect(cmp.isOpen()).toBe(false);
    cmp.remove('apple', new MouseEvent('click'));
    expect(cmp.value()).toEqual(['apple']);
    expect(changes).toEqual([]);
  });

  it('label, hint and error', () => {
    const { fixture, trigger, render, q } = setup({ label: 'Categoría', hint: 'Elige una' });
    expect(trigger.getAttribute('aria-labelledby')).toBe(q('.ts__label')!.id);
    expect(trigger.getAttribute('aria-label')).toBeNull();
    expect(trigger.getAttribute('aria-describedby')).toBe(q('.ts__hint')!.id);
    fixture.componentRef.setInput('errorMessage', 'Obligatoria');
    render();
    expect(q('.ts__hint')).toBeNull();
    expect(q('.ts__error')!.textContent!.trim()).toBe('Obligatoria');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(trigger.className).toContain('ts__trigger--error');
  });

  it('without a label, the placeholder names the trigger and the tree', () => {
    const { trigger, open, q } = setup({ placeholder: 'Elige categoría', size: 'sm' });
    expect(trigger.getAttribute('aria-label')).toBe('Elige categoría');
    expect(trigger.className).toContain('ts__trigger--sm');
    open();
    expect(q('[role="tree"]')!.getAttribute('aria-label')).toBe('Elige categoría');
    expect(trigger.getAttribute('aria-controls')).toBe(q('[role="tree"]')!.id);
  });
});

describe('TreeSelectComponent chip removal focus', () => {
  it('keeps focus in the field after removing a chip with its button', () => {
    const fixture = TestBed.createComponent(TreeSelectComponent);
    fixture.componentRef.setInput('nodes', NODES);
    fixture.componentRef.setInput('multiple', true);
    fixture.componentRef.setInput('value', ['apple', 'bread']);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    document.body.appendChild(el);
    const remove = el.querySelector<HTMLButtonElement>('.ts__chip-remove')!;
    remove.focus();
    remove.click();
    fixture.detectChanges();
    expect(document.activeElement).toBe(el.querySelector('[role="combobox"]'));
    el.remove();
  });
});
