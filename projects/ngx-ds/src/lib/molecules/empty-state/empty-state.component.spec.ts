import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Inbox } from 'lucide-angular';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  @Component({
    standalone: true,
    imports: [EmptyStateComponent],
    template: `
      <ngx-ds-empty-state
        [icon]="icon"
        title="Sin datos"
        description="Prueba otro filtro"
        size="lg"
      >
        <button empty-action>Reintentar</button>
      </ngx-ds-empty-state>
    `,
  })
  class Host {
    icon = Inbox;
  }

  it('renders nothing but the wrapper by default', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.empty-state')?.className).toBe('empty-state empty-state--md');
    expect(el.querySelector('.empty-state__icon')).toBeNull();
    expect(el.querySelector('.empty-state__title')).toBeNull();
    expect(el.querySelector('.empty-state__description')).toBeNull();
  });

  it('renders icon, texts and the projected action', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.empty-state')?.classList).toContain('empty-state--lg');
    expect(el.querySelector('.empty-state__icon svg')?.getAttribute('width')).toBe('64');
    expect(el.querySelector('.empty-state__title')?.textContent).toBe('Sin datos');
    expect(el.querySelector('.empty-state__description')?.textContent).toBe('Prueba otro filtro');
    expect(el.querySelector('.empty-state__action button')?.textContent).toBe('Reintentar');
  });
});

describe('EmptyStateComponent behaviour', () => {
  function setup(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('hides the decorative icon from assistive tech', () => {
    const el = setup({ icon: Inbox, title: 'Sin datos' });
    expect(el.querySelector('.empty-state__icon')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('sizes the icon by size', () => {
    const width = (size: string) =>
      setup({ icon: Inbox, size }).querySelector('.empty-state__icon svg')!.getAttribute('width');
    expect([width('sm'), width('md'), width('lg')]).toEqual(['32', '48', '64']);
  });

  it('hides the illustration and action slots when they are empty', () => {
    const el = setup({ title: 'Nada' });
    expect(getComputedStyle(el.querySelector('.empty-state__illustration')!).display).toBe('none');
    expect(getComputedStyle(el.querySelector('.empty-state__action')!).display).toBe('none');
  });
});
