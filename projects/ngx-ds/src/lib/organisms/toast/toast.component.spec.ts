import { TestBed } from '@angular/core/testing';
import { ToastrService } from '../../services/toast.service';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(ToastComponent);
    const service = TestBed.inject(ToastrService);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const render = () => fixture.detectChanges();
    return { service, el, render };
  }

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    TestBed.inject(ToastrService).clear();
    vi.useRealTimers();
  });

  it('renders nothing without toasts', () => {
    const { el } = setup();
    expect(el.querySelector('.toast-container')).toBeNull();
  });

  it('renders a toast with title, message, type class and progress bar', () => {
    const { service, el, render } = setup();
    service.success('Guardado', 'Listo');
    render();
    const toast = el.querySelector('.toast-container--top-right .toast')!;
    expect(toast.classList).toContain('toast--success');
    expect(toast.querySelector('.toast__title')?.textContent).toContain('Listo');
    expect(toast.querySelector('.toast__message')?.textContent).toContain('Guardado');
    expect(toast.querySelector('.toast__progress')).not.toBeNull();
    // Icon color comes from the theme tokens in SCSS, not an inline style.
    expect(toast.querySelector<HTMLElement>('.toast__icon')!.style.color).toBe('');
  });

  it('groups toasts by position', () => {
    const { service, el, render } = setup();
    service.show({ message: 'a', position: 'bottom-left' });
    service.show({ message: 'b', position: 'bottom-left' });
    service.show({ message: 'c', position: 'top-left' });
    render();
    expect(el.querySelectorAll('.toast-container--bottom-left .toast').length).toBe(2);
    expect(el.querySelectorAll('.toast-container--top-left .toast').length).toBe(1);
    expect(el.querySelector('.toast-container--top-right')).toBeNull();
  });

  it('removes a toast with the close button', () => {
    const { service, el, render } = setup();
    service.danger('Fallo');
    render();
    el.querySelector<HTMLElement>('.toast__close')!.click();
    render();
    expect(service.toasts().length).toBe(0);
    expect(el.querySelector('.toast')).toBeNull();
  });

  it('auto-removes a toast after its duration', () => {
    const { service, el, render } = setup();
    service.info('Hola', undefined, 1000);
    render();
    vi.advanceTimersByTime(999);
    render();
    expect(el.querySelector('.toast')).not.toBeNull();
    vi.advanceTimersByTime(1);
    render();
    expect(el.querySelector('.toast')).toBeNull();
  });
});

describe('ToastComponent behaviour', () => {
  function setup() {
    const fixture = TestBed.createComponent(ToastComponent);
    const service = TestBed.inject(ToastrService);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const render = () => fixture.detectChanges();
    return { service, el, render };
  }

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    TestBed.inject(ToastrService).clear();
    vi.useRealTimers();
  });

  it('duration 0 keeps the toast until it is closed, without a progress bar', () => {
    const { service, el, render } = setup();
    service.show({ message: 'Sin conexión', duration: 0 });
    render();
    vi.advanceTimersByTime(60_000);
    render();
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].duration).toBe(0);
    expect(el.querySelector('.toast__progress')).toBeNull();
  });

  it('defaults to info, top-right and 5 seconds', () => {
    const { service } = setup();
    service.show({ message: 'x' });
    const [toast] = service.toasts();
    expect([toast.type, toast.position, toast.duration]).toEqual(['info', 'top-right', 5000]);
  });

  it('announces errors as alerts and the rest as status', () => {
    const { service, el, render } = setup();
    service.danger('Fallo');
    service.success('Bien');
    render();
    const [danger, success] = Array.from(el.querySelectorAll('.toast'));
    expect(danger.getAttribute('role')).toBe('alert');
    expect(success.getAttribute('role')).toBe('status');
  });

  it('show returns an id that remove accepts; the other toasts stay', () => {
    const { service } = setup();
    const a = service.info('a');
    service.info('b');
    expect(a).not.toBe(service.toasts()[1].id);
    service.remove(a);
    expect(service.toasts().map((t) => t.message)).toEqual(['b']);
  });

  it('clear removes every toast', () => {
    const { service, el, render } = setup();
    service.info('a');
    service.warning('b');
    render();
    service.clear();
    render();
    expect(el.querySelector('.toast')).toBeNull();
  });
});
