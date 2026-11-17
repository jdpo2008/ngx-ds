import { TestBed } from '@angular/core/testing';
import { CommandPaletteComponent } from './command-palette.component';

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

  it('stops listening after destroy', () => {
    const { fixture, cmp } = setup();
    fixture.destroy();
    press('k', { ctrlKey: true });
    expect(cmp.open()).toBe(false);
  });
});
