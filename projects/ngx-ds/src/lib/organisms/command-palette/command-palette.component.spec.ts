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
      expect(active()).toContain('Delta');
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
