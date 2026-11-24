import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { DrawerComponent } from '../drawer/drawer.component';
import { PopoverComponent } from '../popover/popover.component';
import { TableComponent } from '../table/table.component';
import { DatepickerComponent } from '../../molecules/datepicker/datepicker.component';
import { SelectComponent } from '../../molecules/select/select.component';
import { NGX_DS_LABELS } from '../../shared/labels';

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

@Component({
  standalone: true,
  imports: [ModalComponent, DrawerComponent],
  template: `
    <ngx-ds-drawer [(open)]="drawerOpen" title="Filtros" />
    <ngx-ds-modal [(open)]="modalOpen" title="Confirmar" />
  `,
})
class StackHost {
  drawerOpen = signal(false);
  modalOpen = signal(false);
}

@Component({
  standalone: true,
  imports: [
    ModalComponent,
    DrawerComponent,
    DatepickerComponent,
    PopoverComponent,
    SelectComponent,
    TableComponent,
  ],
  template: `
    <ngx-ds-modal [(open)]="modalOpen" title="Editar">
      <ngx-ds-datepicker />
      <ngx-ds-popover [(open)]="popoverOpen">
        <button popover-trigger type="button">Más</button>
        <div popover-content>
          <ngx-ds-select [options]="options" />
        </div>
      </ngx-ds-popover>
    </ngx-ds-modal>
    <ngx-ds-drawer [(open)]="drawerOpen" title="Filtros">
      <ngx-ds-table [columns]="columns" [columnToggle]="true" />
    </ngx-ds-drawer>
  `,
})
class PanelHost {
  modalOpen = signal(true);
  popoverOpen = signal(false);
  drawerOpen = signal(false);
  options = [{ value: 'a', label: 'A' }];
  columns = [{ key: 'name', label: 'Nombre' }];
  readonly datepicker = viewChild.required(DatepickerComponent);
  readonly select = viewChild.required(SelectComponent);
  readonly table = viewChild.required(TableComponent);
}

describe('ModalComponent behaviour', () => {
  afterEach(() => (document.body.style.overflow = ''));

  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ModalComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    const el = fixture.nativeElement as HTMLElement;
    let closed = 0;
    cmp.closed.subscribe(() => closed++);
    const render = () => fixture.detectChanges();
    return { fixture, cmp, el, render, closedCount: () => closed };
  }

  it('renders nothing while closed', () => {
    const { el } = setup();
    expect(el.querySelector('[role="dialog"]')).toBeNull();
  });

  it('a closed modal leaves the page scroll alone', () => {
    document.body.style.overflow = 'scroll';
    setup();
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('closing restores the overflow the page had before', () => {
    document.body.style.overflow = 'scroll';
    const { fixture, render } = setup({ open: true });
    expect(document.body.style.overflow).toBe('hidden');
    fixture.componentRef.setInput('open', false);
    render();
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('the close button closes and emits closed; dismissible=false hides it', () => {
    const { el, cmp, closedCount } = setup({ open: true });
    el.querySelector<HTMLButtonElement>('.modal__close button')!.click();
    expect(cmp.open()).toBe(false);
    expect(closedCount()).toBe(1);

    const other = setup({ open: true, dismissible: false });
    expect(other.el.querySelector('.modal__close')).toBeNull();
  });

  it('size sets the panel class and the label falls back to the i18n string', () => {
    const { el } = setup({ open: true, size: 'xl' });
    const dialog = el.querySelector('[role="dialog"]')!;
    expect(dialog.className).toContain('modal--xl');
    expect(dialog.getAttribute('aria-label')).toBe(TestBed.inject(NGX_DS_LABELS).dialog);
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  describe('stacked over a drawer', () => {
    function stack() {
      const fixture = TestBed.createComponent(StackHost);
      const host = fixture.componentInstance;
      const render = () => fixture.detectChanges();
      host.drawerOpen.set(true);
      render();
      host.modalOpen.set(true);
      render();
      return { host, render };
    }

    it('closing the modal keeps the page locked while the drawer is open', () => {
      const { host, render } = stack();
      host.modalOpen.set(false);
      render();
      expect(document.body.style.overflow).toBe('hidden');
      host.drawerOpen.set(false);
      render();
      expect(document.body.style.overflow).toBe('');
    });

    it('Escape closes only the topmost overlay', () => {
      const { host, render } = stack();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      render();
      expect(host.modalOpen()).toBe(false);
      expect(host.drawerOpen()).toBe(true);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      render();
      expect(host.drawerOpen()).toBe(false);
    });
  });

  describe('with a panel open inside', () => {
    function panels() {
      const fixture = TestBed.createComponent(PanelHost);
      const host = fixture.componentInstance;
      const render = () => fixture.detectChanges();
      render();
      return { host, render };
    }

    const escape = () =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    it('the first Escape closes the open datepicker, the next one the modal', () => {
      const { host, render } = panels();
      host.datepicker().togglePanel();
      render();
      expect(host.datepicker().isOpen()).toBe(true);

      escape();
      render();
      expect(host.datepicker().isOpen()).toBe(false);
      expect(host.modalOpen()).toBe(true);

      escape();
      render();
      expect(host.modalOpen()).toBe(false);
    });

    it('a select inside a popover inside the modal closes one Escape at a time', () => {
      const { host, render } = panels();
      host.popoverOpen.set(true);
      render();
      host.select().togglePanel();
      render();

      escape();
      render();
      expect(host.select().isOpen()).toBe(false);
      expect(host.popoverOpen()).toBe(true);
      expect(host.modalOpen()).toBe(true);

      escape();
      render();
      expect(host.popoverOpen()).toBe(false);
      expect(host.modalOpen()).toBe(true);

      escape();
      render();
      expect(host.modalOpen()).toBe(false);
    });

    it("the table's column menu inside a drawer takes the first Escape", () => {
      const { host, render } = panels();
      host.modalOpen.set(false);
      host.drawerOpen.set(true);
      render();
      host.table().toggleColumnMenu(new Event('click'));
      render();
      expect(host.table().isColumnMenuOpen()).toBe(true);

      escape();
      render();
      expect(host.table().isColumnMenuOpen()).toBe(false);
      expect(host.drawerOpen()).toBe(true);

      escape();
      render();
      expect(host.drawerOpen()).toBe(false);
    });
  });
});
