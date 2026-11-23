import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NGX_DS_LABELS_EN, provideNgxDsLabels } from '../../shared/labels';
import { AlertColor, AlertComponent, AlertVariant } from './alert.component';

const classesOf = (x: Element | string) =>
  (typeof x === 'string' ? x.split(' ') : [...x.classList]).sort();

describe('AlertComponent', () => {
  @Component({
    standalone: true,
    imports: [AlertComponent],
    template: `
      <ngx-ds-alert
        [title]="title()"
        [color]="color()"
        [variant]="variant()"
        [showIcon]="showIcon()"
        [dismissible]="dismissible()"
        (dismissed)="dismissed = dismissed + 1"
        >Algo ha ocurrido</ngx-ds-alert
      >
    `,
  })
  class Host {
    title = signal('');
    color = signal<AlertColor>('info');
    variant = signal<AlertVariant>('soft');
    showIcon = signal(true);
    dismissible = signal(false);
    dismissed = 0;
  }

  function setup(configure?: (h: Host) => void) {
    const fixture = TestBed.createComponent(Host);
    configure?.(fixture.componentInstance);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, host: fixture.componentInstance, el };
  }

  it('renders the projected message as a status with default classes', () => {
    const { el } = setup();
    const alert = el.querySelector('[role="status"]')!;
    expect(classesOf(alert)).toEqual(classesOf('alert alert--info alert--soft'));
    expect(el.querySelector('.alert__message')?.textContent?.trim()).toBe('Algo ha ocurrido');
    expect(el.querySelector('.alert__title')).toBeNull();
    expect(el.querySelector('ngx-ds-icon.alert__icon')).not.toBeNull();
    expect(el.querySelector('.alert__close')).toBeNull();
  });

  it('reflects title, color and variant and can hide the icon', () => {
    const { el } = setup((h) => {
      h.title.set('Error');
      h.color.set('danger');
      h.variant.set('outline');
      h.showIcon.set(false);
    });
    const alert = el.querySelector('.alert')!;
    expect(classesOf(alert)).toEqual(classesOf('alert alert--danger alert--outline'));
    expect(el.querySelector('.alert__title')?.textContent).toBe('Error');
    expect(el.querySelector('.alert__icon')).toBeNull();
  });

  it('closes and emits dismissed from the labelled close button', () => {
    const { fixture, host, el } = setup((h) => h.dismissible.set(true));
    const btn = el.querySelector<HTMLButtonElement>('.alert__close')!;
    expect(btn.getAttribute('aria-label')).toBe('Cerrar alerta');
    btn.click();
    fixture.detectChanges();
    expect(host.dismissed).toBe(1);
    expect(el.querySelector('.alert')).toBeNull();
  });

  it('uses the English close label when provided', () => {
    TestBed.configureTestingModule({ providers: [provideNgxDsLabels(NGX_DS_LABELS_EN)] });
    const { el } = setup((h) => h.dismissible.set(true));
    expect(el.querySelector('.alert__close')?.getAttribute('aria-label')).toBe('Close alert');
  });
});

describe('AlertComponent behaviour', () => {
  it('closing removes the alert and emits once', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const spy = vi.fn();
    fixture.componentInstance.dismissed.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.alert__close')!.click();
    fixture.detectChanges();
    expect(el.querySelector('.alert')).toBeNull();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('is not dismissible by default and shows the color icon', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.componentRef.setInput('color', 'danger');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.alert__close')).toBeNull();
    expect(el.querySelector('.alert__icon')?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('AlertComponent live region', () => {
  it('interrupts only for warning and danger; info and success are polite', () => {
    const roles = (['info', 'success', 'warning', 'danger'] as AlertColor[]).map((color) => {
      const fixture = TestBed.createComponent(AlertComponent);
      fixture.componentRef.setInput('color', color);
      fixture.detectChanges();
      const box = (fixture.nativeElement as HTMLElement).querySelector('.alert')!;
      return box.getAttribute('role');
    });
    expect(roles).toEqual(['status', 'status', 'alert', 'alert']);
  });
});
