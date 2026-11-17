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
