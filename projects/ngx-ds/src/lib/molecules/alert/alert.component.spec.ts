import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NGX_DS_LABELS_EN, provideNgxDsLabels } from '../../shared/labels';
import { AlertComponent, AlertType, AlertVariant } from './alert.component';

const classesOf = (x: Element | string) =>
  (typeof x === 'string' ? x.split(' ') : [...x.classList]).sort();

describe('AlertComponent', () => {
  @Component({
    standalone: true,
    imports: [AlertComponent],
    template: `
      <ngx-ds-alert
        [title]="title()"
        [type]="type()"
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
    type = signal<AlertType>('info');
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

  it('renders the projected message with role alert and default classes', () => {
    const { el } = setup();
    const alert = el.querySelector('[role="alert"]')!;
    expect(classesOf(alert)).toEqual(classesOf('alert alert--info alert--soft'));
    expect(el.querySelector('.alert__message')?.textContent?.trim()).toBe('Algo ha ocurrido');
    expect(el.querySelector('.alert__title')).toBeNull();
    expect(el.querySelector('ngx-ds-icon.alert__icon')).not.toBeNull();
    expect(el.querySelector('.alert__close')).toBeNull();
  });

  it('reflects title, type and variant and can hide the icon', () => {
    const { el } = setup((h) => {
      h.title.set('Error');
      h.type.set('danger');
      h.variant.set('outline');
      h.showIcon.set(false);
    });
    const alert = el.querySelector('[role="alert"]')!;
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
    expect(el.querySelector('[role="alert"]')).toBeNull();
  });

  it('uses the English close label when provided', () => {
    TestBed.configureTestingModule({ providers: [provideNgxDsLabels(NGX_DS_LABELS_EN)] });
    const { el } = setup((h) => h.dismissible.set(true));
    expect(el.querySelector('.alert__close')?.getAttribute('aria-label')).toBe('Close alert');
  });
});
