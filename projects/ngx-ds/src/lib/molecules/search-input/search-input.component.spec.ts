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
    cmp.searchSubmit.subscribe((q) => submitted.push(q));
    const press = (key: string) =>
      input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    return { press, submitted };
  }

  it('Enter emits the query on searchSubmit', () => {
    const { press, submitted } = setup();
    press('Enter');
    expect(submitted).toEqual(['angular']);
  });

  it('other keys emit nothing', () => {
    const { press, submitted } = setup();
    press('a');
    expect(submitted).toEqual([]);
  });
});
