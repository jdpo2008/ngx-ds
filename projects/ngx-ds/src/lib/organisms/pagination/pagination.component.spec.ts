import { TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { NGX_DS_LABELS } from '../../shared/labels';

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
    expect(emitted).toEqual([1]);
  });
});

describe('PaginationComponent behaviour', () => {
  function setup(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(PaginationComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const el = fixture.nativeElement as HTMLElement;
    const emitted: number[] = [];
    cmp.pageChange.subscribe((p) => emitted.push(p));
    const buttons = () => Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
    const prevBtn = () => buttons()[0];
    const nextBtn = () => buttons()[buttons().length - 1];
    const pageBtn = (n: number) => buttons().find((b) => b.textContent!.trim() === String(n))!;
    const render = () => fixture.detectChanges();
    return { fixture, cmp, el, emitted, buttons, prevBtn, nextBtn, pageBtn, render };
  }

  it('marks the current page and moves to a clicked page', () => {
    const { cmp, el, emitted, pageBtn, render } = setup({ totalPages: 5, currentPage: 2 });
    const current = () => el.querySelector('[aria-current="page"]')!.textContent!.trim();
    expect(current()).toBe('2');
    pageBtn(4).click();
    render();
    expect(cmp.currentPage()).toBe(4);
    expect(emitted).toEqual([4]);
    expect(current()).toBe('4');
  });

  it('the arrows move one page and disable at the ends', () => {
    const { emitted, prevBtn, nextBtn, render } = setup({ totalPages: 2, currentPage: 1 });
    expect(prevBtn().disabled).toBe(true);
    expect(prevBtn().getAttribute('aria-label')).toBe(TestBed.inject(NGX_DS_LABELS).prevPage);
    nextBtn().click();
    render();
    expect(emitted).toEqual([2]);
    expect(nextBtn().disabled).toBe(true);
    expect(prevBtn().disabled).toBe(false);
  });

  it('choosing the page already shown emits nothing', () => {
    const { cmp, emitted, pageBtn } = setup({ totalPages: 5, currentPage: 3 });
    pageBtn(3).click();
    cmp.go(3);
    expect(emitted).toEqual([]);
  });

  it('next() on the last page and prev() on the first emit nothing', () => {
    const { cmp, emitted, fixture } = setup({ totalPages: 3, currentPage: 3 });
    cmp.next();
    fixture.componentRef.setInput('currentPage', 1);
    cmp.prev();
    expect(emitted).toEqual([]);
  });

  it('with no pages both arrows are disabled and the page stays at 1', () => {
    const { cmp, emitted, prevBtn, nextBtn } = setup({ totalPages: 0, currentPage: 1 });
    expect(prevBtn().disabled).toBe(true);
    expect(nextBtn().disabled).toBe(true);
    cmp.next();
    expect(cmp.currentPage()).toBe(1);
    expect(emitted).toEqual([]);
  });

  it('a current page past the end (the total shrank) disables next', () => {
    const { nextBtn } = setup({ totalPages: 3, currentPage: 5 });
    expect(nextBtn().disabled).toBe(true);
  });

  it('an ellipsis never hides a single page', () => {
    expect(setup({ totalPages: 20, currentPage: 4 }).cmp.pages()).toEqual([
      1,
      2,
      3,
      4,
      5,
      '...',
      20,
    ]);
    expect(setup({ totalPages: 20, currentPage: 17 }).cmp.pages()).toEqual([
      1,
      '...',
      16,
      17,
      18,
      19,
      20,
    ]);
  });

  it('siblings widens the window around the current page', () => {
    const { cmp } = setup({ totalPages: 20, currentPage: 10, siblings: 2 });
    expect(cmp.pages()).toEqual([1, '...', 8, 9, 10, 11, 12, '...', 20]);
  });

  it('showBoundary=false drops the first and last pages', () => {
    expect(setup({ totalPages: 20, currentPage: 10, showBoundary: false }).cmp.pages()).toEqual([
      9, 10, 11,
    ]);
    expect(setup({ totalPages: 20, currentPage: 1, showBoundary: false }).cmp.pages()).toEqual([
      1, 2,
    ]);
  });

  it('the ellipsis is hidden from assistive technology', () => {
    const { el } = setup({ totalPages: 20, currentPage: 10 });
    const dots = el.querySelectorAll('.pagination__ellipsis');
    expect(dots.length).toBe(2);
    expect(dots[0].getAttribute('aria-hidden')).toBe('true');
  });
});
