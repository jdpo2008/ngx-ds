import { TestBed } from '@angular/core/testing';
import { ToastrService } from './toast.service';

describe('ToastrService', () => {
  let service: ToastrService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(ToastrService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds a toast with defaults', () => {
    const id = service.show({ message: 'Hola' });
    const [toast] = service.toasts();
    expect(toast.id).toBe(id);
    expect(toast.type).toBe('info');
    expect(toast.duration).toBe(5000);
    expect(toast.position).toBe('top-right');
  });

  it('typed helpers set the type and title', () => {
    service.success('ok', 'Hecho');
    service.danger('ko');
    service.warning('cuidado');
    service.info('dato');
    expect(service.toasts().map((t) => t.type)).toEqual(['success', 'danger', 'warning', 'info']);
    expect(service.toasts()[0].title).toBe('Hecho');
  });

  it('removes a toast automatically after its duration', () => {
    service.show({ message: 'temporal', duration: 1000 });
    expect(service.toasts()).toHaveLength(1);
    vi.advanceTimersByTime(999);
    expect(service.toasts()).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(service.toasts()).toHaveLength(0);
  });

  it('remove() deletes only the given toast', () => {
    const a = service.show({ message: 'a' });
    service.show({ message: 'b' });
    service.remove(a);
    expect(service.toasts().map((t) => t.message)).toEqual(['b']);
  });

  it('clear() deletes every toast', () => {
    service.show({ message: 'a' });
    service.show({ message: 'b' });
    service.clear();
    expect(service.toasts()).toEqual([]);
  });
});
