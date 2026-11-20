import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConfirmationComponent } from './confirmation.component';
import { ConfirmationService } from '../../services/confirmation.service';
import { NGX_DS_LABELS } from '../../shared/labels';
import { ModalComponent } from '../modal/modal.component';

describe('ConfirmationComponent', () => {
  function setup(closeOnBackdrop?: boolean) {
    const fixture = TestBed.createComponent(ConfirmationComponent);
    if (closeOnBackdrop !== undefined)
      fixture.componentRef.setInput('closeOnBackdrop', closeOnBackdrop);
    const service = TestBed.inject(ConfirmationService);
    const result = service.confirm({ title: 't', message: 'm' });
    fixture.detectChanges();
    return { fixture, service, result };
  }

  it('cancels on backdrop click by default', async () => {
    const { fixture, service, result } = setup();
    fixture.componentInstance.onBackdropClick();
    await expect(result).resolves.toBe(false);
    expect(service.state().isOpen).toBe(false);
  });

  it('stays open on backdrop click when closeOnBackdrop is false', () => {
    const { fixture, service } = setup(false);
    fixture.componentInstance.onBackdropClick();
    expect(service.state().isOpen).toBe(true);
  });

  it('cancels on Escape', async () => {
    const { result } = setup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await expect(result).resolves.toBe(false);
  });
});

describe('ConfirmationComponent behaviour', () => {
  function setup() {
    const fixture = TestBed.createComponent(ConfirmationComponent);
    fixture.detectChanges();
    const service = TestBed.inject(ConfirmationService);
    const el = fixture.nativeElement as HTMLElement;
    const render = () => fixture.detectChanges();
    const buttons = () => Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
    return { fixture, service, el, render, buttons };
  }

  it('shows title, message and the default button texts', () => {
    const { service, el, render, buttons } = setup();
    const labels = TestBed.inject(NGX_DS_LABELS);
    service.confirm({ title: 'Borrar', message: '¿Seguro?' });
    render();
    const dialog = el.querySelector('[role="dialog"]')!;
    const title = el.querySelector('.confirmation-modal__title')!;
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(title.textContent).toBe('Borrar');
    expect(el.querySelector('.confirmation-modal__message')!.textContent).toBe('¿Seguro?');
    expect(buttons().map((b) => b.textContent!.trim())).toEqual([labels.cancel, labels.confirm]);
  });

  it('custom texts and the danger type are applied', () => {
    const { service, el, render, buttons } = setup();
    service.confirm({
      title: 't',
      message: 'm',
      type: 'danger',
      confirmText: 'Borrar',
      cancelText: 'Volver',
    });
    render();
    expect(el.querySelector('.confirmation-modal--danger')).not.toBeNull();
    expect(buttons().map((b) => b.textContent!.trim())).toEqual(['Volver', 'Borrar']);
  });

  it('the confirm button resolves true and closes', async () => {
    const { service, el, render, buttons } = setup();
    const result = service.confirm({ title: 't', message: 'm' });
    render();
    buttons()[1].click();
    render();
    await expect(result).resolves.toBe(true);
    expect(el.querySelector('[role="dialog"]')).toBeNull();
  });

  it('the cancel button resolves false', async () => {
    const { service, render, buttons } = setup();
    const result = service.confirm({ title: 't', message: 'm' });
    render();
    buttons()[0].click();
    await expect(result).resolves.toBe(false);
  });

  it('a second confirm() resolves the first one as cancelled', async () => {
    const { service } = setup();
    const first = service.confirm({ title: 'a', message: 'a' });
    const second = service.confirm({ title: 'b', message: 'b' });
    await expect(first).resolves.toBe(false);
    expect(service.state().title).toBe('b');
    service.handleConfirm();
    await expect(second).resolves.toBe(true);
  });

  it('close() resolves the pending confirm as cancelled', async () => {
    const { service } = setup();
    const result = service.confirm({ title: 't', message: 'm' });
    service.close();
    await expect(result).resolves.toBe(false);
  });
});

@Component({
  standalone: true,
  imports: [ModalComponent, ConfirmationComponent],
  template: `
    <ngx-ds-modal [(open)]="modalOpen" title="Editar" />
    <ngx-ds-confirmation />
  `,
})
class OverModalHost {
  modalOpen = signal(true);
}

describe('ConfirmationComponent over a modal', () => {
  afterEach(() => (document.body.style.overflow = ''));

  it('locks the page scroll while open and restores it after', async () => {
    const fixture = TestBed.createComponent(ConfirmationComponent);
    fixture.detectChanges();
    const service = TestBed.inject(ConfirmationService);
    const result = service.confirm({ title: 't', message: 'm' });
    fixture.detectChanges();
    expect(document.body.style.overflow).toBe('hidden');
    service.handleCancel();
    fixture.detectChanges();
    await result;
    expect(document.body.style.overflow).toBe('');
  });

  it('Escape cancels the confirmation and leaves the modal open', async () => {
    const fixture = TestBed.createComponent(OverModalHost);
    fixture.detectChanges();
    const service = TestBed.inject(ConfirmationService);
    const result = service.confirm({ title: 't', message: 'm' });
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    await expect(result).resolves.toBe(false);
    expect(fixture.componentInstance.modalOpen()).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
  });
});
