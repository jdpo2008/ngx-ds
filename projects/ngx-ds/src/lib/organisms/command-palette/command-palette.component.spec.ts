import { TestBed } from '@angular/core/testing';
import { CommandItem, CommandPaletteComponent } from './command-palette.component';

function press(key: string, init: KeyboardEventInit = {}): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...init }));
}

describe('CommandPaletteComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(CommandPaletteComponent);
    fixture.detectChanges();
    return { fixture, cmp: fixture.componentInstance };
  }

  it('toggles open with Ctrl+K on the document', () => {
    const { cmp } = setup();
    expect(cmp.open()).toBe(false);
    press('k', { ctrlKey: true });
    expect(cmp.open()).toBe(true);
    press('k', { ctrlKey: true });
    expect(cmp.open()).toBe(false);
  });

  it('toggles with Ctrl/Cmd+K when Caps Lock or Shift makes the key uppercase', () => {
    const { cmp } = setup();
    press('K', { ctrlKey: true, shiftKey: true });
    expect(cmp.open()).toBe(true);
    press('K', { metaKey: true });
    expect(cmp.open()).toBe(false);
  });

  it('closes with Escape', () => {
    const { cmp } = setup();
    press('k', { metaKey: true });
    expect(cmp.open()).toBe(true);
    press('Escape');
    expect(cmp.open()).toBe(false);
  });

  it('respects a custom shortcut', () => {
    const { fixture, cmp } = setup();
    fixture.componentRef.setInput('openShortcut', 'p');
    press('k', { ctrlKey: true });
    expect(cmp.open()).toBe(false);
    press('p', { ctrlKey: true });
    expect(cmp.open()).toBe(true);
  });

  describe('when open', () => {
    const ITEMS: CommandItem[] = [
      { id: 'a', label: 'Alpha', category: 'Files', keywords: ['first'] },
      { id: 'b', label: 'Beta', category: 'Actions', description: 'Second item', kbd: ['⌘', 'B'] },
      { id: 'c', label: 'Gamma', category: 'Files' },
      { id: 'd', label: 'Delta', disabled: true },
    ];

    function openWith(items = ITEMS) {
      const ctx = setup();
      ctx.fixture.componentRef.setInput('items', items);
      ctx.cmp.open.set(true);
      ctx.fixture.detectChanges();
      const el = ctx.fixture.nativeElement as HTMLElement;
      const options = () => Array.from(el.querySelectorAll<HTMLButtonElement>('[role="option"]'));
      const active = () => el.querySelector('.cp__item--active')?.textContent?.trim();
      const search = (value: string) => {
        const input = el.querySelector<HTMLInputElement>('.cp__search-input')!;
        input.value = value;
        input.dispatchEvent(new Event('input'));
        ctx.fixture.detectChanges();
      };
      return { ...ctx, el, options, active, search };
    }

    it('renders the items grouped by category with headings, descriptions and shortcuts', () => {
      const { el, options } = openWith();
      expect(Array.from(el.querySelectorAll('.cp__category')).map((h) => h.textContent)).toEqual([
        'Files',
        'Actions',
      ]);
      expect(options().map((o) => o.querySelector('.cp__item-label')!.textContent)).toEqual([
        'Alpha',
        'Gamma',
        'Beta',
        'Delta',
      ]);
      expect(el.querySelector('.cp__item-desc')!.textContent).toBe('Second item');
      expect(el.querySelectorAll('.cp__item-kbd ngx-ds-kbd').length).toBe(2);
      expect(options()[3].disabled).toBe(true);
    });

    it('moves the cursor in the rendered order, clamped at both ends', () => {
      const { fixture, active } = openWith();
      expect(active()).toContain('Alpha');
      press('ArrowUp');
      fixture.detectChanges();
      expect(active()).toContain('Alpha');
      press('ArrowDown');
      fixture.detectChanges();
      // Gamma is rendered right after Alpha (same category), even though Beta comes first in `items`.
      expect(active()).toContain('Gamma');
      press('ArrowDown');
      press('ArrowDown');
      press('ArrowDown');
      fixture.detectChanges();
      // Delta is disabled, so Beta is the last reachable item.
      expect(active()).toContain('Beta');
    });

    it('skips disabled items, including a disabled first item', () => {
      const { fixture, cmp, active } = openWith([
        { id: 'x', label: 'Off', disabled: true },
        { id: 'a', label: 'Alpha' },
        { id: 'y', label: 'Off too', disabled: true },
        { id: 'b', label: 'Beta' },
      ]);
      const selected: CommandItem[] = [];
      cmp.itemSelect.subscribe((item) => selected.push(item));
      expect(active()).toBe('Alpha');
      press('ArrowDown');
      fixture.detectChanges();
      expect(active()).toBe('Beta');
      press('ArrowUp');
      press('ArrowUp');
      fixture.detectChanges();
      expect(active()).toBe('Alpha');
      press('Enter');
      expect(selected.map((i) => i.id)).toEqual(['a']);
    });

    it('scrolls the active option into view on arrow navigation', () => {
      const { fixture, options } = openWith();
      const scrolled: string[] = [];
      const original = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = function (this: Element) {
        scrolled.push(this.id);
      };
      try {
        press('ArrowDown');
        fixture.detectChanges();
        expect(scrolled).toEqual([options()[1].id]);
      } finally {
        Element.prototype.scrollIntoView = original;
      }
    });

    it('keeps the options out of the Tab order', () => {
      const { options } = openWith();
      for (const option of options()) expect(option.getAttribute('tabindex')).toBe('-1');
    });

    it('makes the hovered option the active one', () => {
      const { fixture, cmp, options, active } = openWith();
      const selected: CommandItem[] = [];
      cmp.itemSelect.subscribe((item) => selected.push(item));
      options()[2].dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
      fixture.detectChanges();
      expect(active()).toContain('Beta');
      // Hovering a disabled item leaves the cursor where it was.
      options()[3].dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
      fixture.detectChanges();
      expect(active()).toContain('Beta');
      press('Enter');
      expect(selected.map((i) => i.id)).toEqual(['b']);
    });

    it('groups the options of each category under its heading', () => {
      const { el } = openWith();
      const groups = Array.from(el.querySelectorAll('[role="listbox"] > [role="group"]'));
      expect(groups.length).toBe(2);
      const names = groups.map((g) =>
        el.querySelector(`[id="${g.getAttribute('aria-labelledby')}"]`)?.textContent?.trim(),
      );
      expect(names).toEqual(['Files', 'Actions']);
      expect(groups[0].querySelectorAll('[role="option"]').length).toBe(2);
      expect(groups[1].querySelectorAll('[role="option"]').length).toBe(1);
      // Delta has no category, so it isn't in a group.
      const delta = el.querySelector('[role="option"][aria-disabled="true"]')!;
      expect(delta.closest('[role="group"]')).toBeNull();
    });

    it('gives the search input an accessible name', () => {
      const { fixture, el } = openWith();
      const input = el.querySelector('.cp__search-input')!;
      expect(input.getAttribute('aria-label')).toBe('Buscar comandos...');
      fixture.componentRef.setInput('placeholder', 'Type a command');
      fixture.detectChanges();
      expect(input.getAttribute('aria-label')).toBe('Type a command');
    });

    it('announces the result count in a polite live region', () => {
      const { el, search } = openWith();
      const status = () => el.querySelector('[role="status"]')!;
      expect(status().getAttribute('aria-live')).toBe('polite');
      expect(status().textContent?.trim()).toBe('4 resultados');
      search('alp');
      expect(status().textContent?.trim()).toBe('1 resultado');
      search('zzz');
      expect(status().textContent?.trim()).toBe('Sin resultados para "zzz"');
    });

    it('reflects whether results show in aria-expanded, with the empty message outside the listbox', () => {
      const { el, search } = openWith();
      const input = el.querySelector('.cp__search-input')!;
      expect(input.getAttribute('aria-expanded')).toBe('true');
      search('zzz');
      expect(input.getAttribute('aria-expanded')).toBe('false');
      expect(el.querySelector('.cp__empty')!.closest('[role="listbox"]')).toBeNull();
    });

    it('points aria-activedescendant at the active option', () => {
      const { fixture, el, options } = openWith();
      press('ArrowDown');
      fixture.detectChanges();
      const input = el.querySelector('.cp__search-input')!;
      expect(input.getAttribute('aria-activedescendant')).toBe(options()[1].id);
      expect(options()[1].getAttribute('aria-selected')).toBe('true');
    });

    it('selects the active item with Enter, emits it and closes', () => {
      const { fixture, cmp } = openWith();
      const selected: CommandItem[] = [];
      cmp.itemSelect.subscribe((item) => selected.push(item));
      press('ArrowDown');
      press('Enter');
      fixture.detectChanges();
      expect(selected.map((i) => i.id)).toEqual(['c']);
      expect(cmp.open()).toBe(false);
    });

    it('selects an item on click', () => {
      const { cmp, options } = openWith();
      const selected: CommandItem[] = [];
      cmp.itemSelect.subscribe((item) => selected.push(item));
      options()[2].click();
      expect(selected.map((i) => i.id)).toEqual(['b']);
      expect(cmp.open()).toBe(false);
    });

    it('ignores disabled items', () => {
      const { cmp } = openWith();
      const selected: CommandItem[] = [];
      cmp.itemSelect.subscribe((item) => selected.push(item));
      cmp.selectItem(ITEMS[3]);
      expect(selected).toEqual([]);
      expect(cmp.open()).toBe(true);
    });

    it('filters by label, description and keywords, and resets the cursor', () => {
      const { fixture, options, active, search } = openWith();
      press('ArrowDown');
      fixture.detectChanges();
      search('second');
      expect(options().map((o) => o.id.endsWith('-b'))).toEqual([true]);
      search('FIRST');
      expect(active()).toContain('Alpha');
      expect(options().length).toBe(1);
      search('  ');
      expect(options().length).toBe(4);
    });

    it('shows the empty message and does nothing on Enter when nothing matches', () => {
      const { el, cmp, search } = openWith();
      const selected: CommandItem[] = [];
      cmp.itemSelect.subscribe((item) => selected.push(item));
      search('zzz');
      expect(el.querySelector('.cp__empty')!.textContent).toContain('zzz');
      press('Enter');
      expect(selected).toEqual([]);
      expect(cmp.open()).toBe(true);
    });

    it('closes on backdrop click and clears the query', () => {
      const { fixture, el, cmp, search } = openWith();
      search('alp');
      el.querySelector<HTMLElement>('.cp__backdrop')!.click();
      fixture.detectChanges();
      expect(cmp.open()).toBe(false);
      expect(cmp.query()).toBe('');
    });

    it('uses the placeholder input over the default label', () => {
      const { fixture, el } = openWith();
      const input = el.querySelector<HTMLInputElement>('.cp__search-input')!;
      expect(input.placeholder).toBe('Buscar comandos...');
      fixture.componentRef.setInput('placeholder', 'Type a command');
      fixture.detectChanges();
      expect(input.placeholder).toBe('Type a command');
    });

    it('ignores navigation keys while closed', () => {
      const { fixture, cmp, active } = openWith();
      cmp.open.set(false);
      press('ArrowDown');
      cmp.open.set(true);
      fixture.detectChanges();
      expect(active()).toContain('Alpha');
    });
  });

  it('stops listening after destroy', () => {
    const { fixture, cmp } = setup();
    fixture.destroy();
    press('k', { ctrlKey: true });
    expect(cmp.open()).toBe(false);
  });
});
