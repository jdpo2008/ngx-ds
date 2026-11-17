import { TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ModalComponent);
    fixture.componentRef.setInput('open', true);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    let closed = 0;
    cmp.closed.subscribe(() => closed++);
    return { fixture, cmp, closedCount: () => closed };
  }

  it('renders a dialog and locks body scroll while open', () => {
    const { fixture } = setup({ title: 'Hola' });
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.getAttribute('aria-label')).toBe('Hola');
    expect(document.body.style.overflow).toBe('hidden');
    fixture.destroy();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on backdrop click only when the overlay itself is clicked', () => {
    const { fixture, cmp, closedCount } = setup();
    (fixture.nativeElement.querySelector('.modal__body') as HTMLElement).click();
    expect(cmp.open()).toBe(true);
    (fixture.nativeElement.querySelector('.modal-overlay') as HTMLElement).click();
    expect(cmp.open()).toBe(false);
    expect(closedCount()).toBe(1);
  });

  it('respects closeOnBackdrop=false', () => {
    const { cmp } = setup({ closeOnBackdrop: false });
    cmp.onBackdropClick();
    expect(cmp.open()).toBe(true);
  });

  it('closes on Escape unless closeOnEscape=false', () => {
    const a = setup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(a.cmp.open()).toBe(false);

    const b = setup({ closeOnEscape: false });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(b.cmp.open()).toBe(true);
  });
});
