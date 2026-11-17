import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from './confirmation.service';

describe('ConfirmationService', () => {
  let service: ConfirmationService;

  beforeEach(() => {
    service = TestBed.inject(ConfirmationService);
  });

  it('starts closed', () => {
    expect(service.state().isOpen).toBe(false);
  });

  it('opens with defaults for optional fields', () => {
    void service.confirm({ title: 'Borrar', message: '¿Seguro?' });
    expect(service.state()).toEqual({
      isOpen: true,
      title: 'Borrar',
      message: '¿Seguro?',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      type: 'info',
    });
  });

  it('resolves true and closes on confirm', async () => {
    const result = service.confirm({ title: 't', message: 'm', type: 'danger' });
    service.handleConfirm();
    await expect(result).resolves.toBe(true);
    expect(service.state().isOpen).toBe(false);
  });

  it('resolves false and closes on cancel', async () => {
    const result = service.confirm({ title: 't', message: 'm' });
    service.handleCancel();
    await expect(result).resolves.toBe(false);
    expect(service.state().isOpen).toBe(false);
  });
});
