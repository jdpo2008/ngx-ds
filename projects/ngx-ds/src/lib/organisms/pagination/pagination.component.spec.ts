import { TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  function setup(totalPages: number, currentPage = 1) {
    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('totalPages', totalPages);
    fixture.componentRef.setInput('currentPage', currentPage);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('lists every page when there are 7 or fewer', () => {
    expect(setup(5).pages()).toEqual([1, 2, 3, 4, 5]);
    expect(setup(0).pages()).toEqual([]);
  });

  it('collapses with ellipses around the current page', () => {
    expect(setup(20, 10).pages()).toEqual([1, '...', 9, 10, 11, '...', 20]);
    expect(setup(20, 1).pages()).toEqual([1, 2, '...', 20]);
    expect(setup(20, 20).pages()).toEqual([1, '...', 19, 20]);
  });

  it('clamps navigation and emits pageChange', () => {
    const cmp = setup(3, 3);
    const emitted: number[] = [];
    cmp.pageChange.subscribe((p) => emitted.push(p));
    cmp.next();
    expect(cmp.currentPage()).toBe(3);
    cmp.go(1);
    cmp.prev();
    expect(cmp.currentPage()).toBe(1);
    cmp.go('...');
    expect(emitted).toEqual([3, 1, 1]);
  });
});
