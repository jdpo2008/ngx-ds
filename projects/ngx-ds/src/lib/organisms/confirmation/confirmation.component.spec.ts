import { TestBed } from '@angular/core/testing';
import { ConfirmationComponent } from './confirmation.component';
import { ConfirmationService } from '../../services/confirmation.service';

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
