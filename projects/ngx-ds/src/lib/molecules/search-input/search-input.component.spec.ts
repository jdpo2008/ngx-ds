import { TestBed } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent outputs', () => {
  function setup() {
    const fixture = TestBed.createComponent(SearchInputComponent);
    fixture.componentRef.setInput('value', 'angular');
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    const submitted: string[] = [];
    const legacy: string[] = [];
    cmp.searchSubmit.subscribe((q) => submitted.push(q));
    cmp.search.subscribe((q) => legacy.push(q));
    const press = (key: string) =>
      input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    return { press, submitted, legacy };
  }

  it('Enter emits the query on searchSubmit', () => {
    const { press, submitted } = setup();
    press('Enter');
    expect(submitted).toEqual(['angular']);
  });

  it('keeps emitting the deprecated search alias with the same value', () => {
    const { press, legacy } = setup();
    press('Enter');
    expect(legacy).toEqual(['angular']);
  });

  it('other keys emit nothing', () => {
    const { press, submitted, legacy } = setup();
    press('a');
    expect(submitted).toEqual([]);
    expect(legacy).toEqual([]);
  });
});
