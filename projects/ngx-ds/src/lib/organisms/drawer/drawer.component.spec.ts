import { TestBed } from '@angular/core/testing';
import { DrawerComponent } from './drawer.component';

describe('DrawerComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(DrawerComponent);
    for (const [k, v] of Object.entries({ open: true, ...inputs })) {
      fixture.componentRef.setInput(k, v);
    }
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    let closed = 0;
    cmp.closed.subscribe(() => closed++);
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, cmp, el, closedCount: () => closed };
  }

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('renders the title', () => {
    const { el } = setup({ title: 'Filtros' });
    expect(el.querySelector('.drawer__title')?.textContent).toContain('Filtros');
  });

  it('falls back to the i18n drawer label without a title', () => {
    const { el } = setup();
    expect(el.querySelector('[role="dialog"]')!.getAttribute('aria-label')).toBe('Panel lateral');
  });

  it('locks body scroll while open and restores it on destroy', () => {
    const { fixture } = setup();
    expect(document.body.style.overflow).toBe('hidden');
    fixture.destroy();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on overlay click but not on panel click', () => {
    const { fixture, cmp, el, closedCount } = setup();
    el.querySelector<HTMLElement>('[role="dialog"]')!.click();
    expect(cmp.open()).toBe(true);
    el.querySelector<HTMLElement>('.drawer-overlay')!.click();
    fixture.detectChanges();
    expect(cmp.open()).toBe(false);
    expect(closedCount()).toBe(1);
    expect(el.querySelector('[role="dialog"]')).toBeNull();
  });

  it('ignores overlay clicks when closeOnBackdrop is false', () => {
    const { cmp, el } = setup({ closeOnBackdrop: false });
    el.querySelector<HTMLElement>('.drawer-overlay')!.click();
    expect(cmp.open()).toBe(true);
  });

  it('closes with Escape', () => {
    const { cmp, closedCount } = setup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(cmp.open()).toBe(false);
    expect(closedCount()).toBe(1);
  });

  it('closes with the close button', () => {
    const { cmp, el } = setup();
    el.querySelector<HTMLElement>('.drawer__close button')!.click();
    expect(cmp.open()).toBe(false);
  });

  it('hides the close button when dismissible is false', () => {
    const { el } = setup({ dismissible: false });
    expect(el.querySelector('.drawer__close')).toBeNull();
  });
});

describe('DrawerComponent behaviour', () => {
  afterEach(() => {
    document.body.style.overflow = '';
  });

  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(DrawerComponent);
    for (const [k, v] of Object.entries({ open: true, ...inputs })) {
      fixture.componentRef.setInput(k, v);
    }
    fixture.detectChanges();
    return { fixture, cmp: fixture.componentInstance, el: fixture.nativeElement as HTMLElement };
  }

  it('names the dialog by its visible title', () => {
    const { el } = setup({ title: 'Filtros' });
    const dialog = el.querySelector('[role="dialog"]')!;
    const title = el.querySelector('.drawer__title')!;
    expect(title.id).toBeTruthy();
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(dialog.hasAttribute('aria-label')).toBe(false);
  });

  it('ignores Escape when closeOnEscape is false', () => {
    const { cmp } = setup({ closeOnEscape: false });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(cmp.open()).toBe(true);
  });

  it('applies side and size classes', () => {
    const { el } = setup({ side: 'left', size: 'lg' });
    const cls = el.querySelector('[role="dialog"]')!.classList;
    expect(cls).toContain('drawer--left');
    expect(cls).toContain('drawer--lg');
  });

  it('renders nothing while closed', () => {
    const { el } = setup({ open: false });
    expect(el.querySelector('.drawer-overlay')).toBeNull();
  });
});
