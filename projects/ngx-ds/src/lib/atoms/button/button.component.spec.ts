import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ArrowRight, LucideIconData, Plus } from 'lucide-angular';
import { ButtonComponent, ButtonSize } from './button.component';

const classesOf = (x: Element | string) =>
  (typeof x === 'string' ? x.split(' ') : [...x.classList]).sort();

describe('ButtonComponent', () => {
  @Component({
    standalone: true,
    imports: [ButtonComponent],
    template: `
      <ngx-ds-button
        [size]="size()"
        [loading]="loading()"
        [disabled]="disabled()"
        [iconLeft]="iconLeft()"
        [iconRight]="iconRight()"
        type="submit"
        (click)="clicks = clicks + 1"
        >Guardar</ngx-ds-button
      >
    `,
  })
  class Host {
    size = signal<ButtonSize>('md');
    loading = signal(false);
    disabled = signal(false);
    iconLeft = signal<LucideIconData | undefined>(undefined);
    iconRight = signal<LucideIconData | undefined>(undefined);
    clicks = 0;
  }

  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const btn = el.querySelector('button')!;
    return { fixture, host: fixture.componentInstance, el, btn };
  }

  it('projects the label and applies type and classes', () => {
    const { btn } = setup();
    expect(btn.textContent?.trim()).toBe('Guardar');
    expect(btn.type).toBe('submit');
    expect(classesOf(btn)).toEqual(classesOf('btn btn--solid btn--md btn--primary'));
  });

  it('renders left and right icons sized by the button size', () => {
    const { fixture, host, el } = setup();
    host.iconLeft.set(Plus);
    host.iconRight.set(ArrowRight);
    host.size.set('lg');
    fixture.detectChanges();
    const icons = el.querySelectorAll('ngx-ds-icon.btn__icon');
    expect(icons.length).toBe(2);
    expect(icons[0].querySelector('svg')?.getAttribute('width')).toBe('20');
  });

  it('shows a spinner, hides icons and disables itself while loading', () => {
    const { fixture, host, el, btn } = setup();
    host.iconLeft.set(Plus);
    host.iconRight.set(ArrowRight);
    host.loading.set(true);
    fixture.detectChanges();
    expect(el.querySelector('ngx-ds-spinner')).not.toBeNull();
    expect(el.querySelector('ngx-ds-icon')).toBeNull();
    expect(btn.disabled).toBe(true);
    expect(btn.classList).toContain('btn--loading');
  });

  it('does not fire clicks while disabled', () => {
    const { fixture, host, btn } = setup();
    btn.click();
    expect(host.clicks).toBe(1);
    host.disabled.set(true);
    fixture.detectChanges();
    expect(btn.disabled).toBe(true);
    btn.click();
    expect(host.clicks).toBe(1);
  });
});

describe('ButtonComponent busy state', () => {
  it('marks itself busy only while loading', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.detectChanges();
    const btn = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(btn.hasAttribute('aria-busy')).toBe(false);

    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(btn.getAttribute('aria-busy')).toBe('true');
  });
});
