import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';
import { TimelineItemComponent } from './timeline-item.component';

@Component({
  standalone: true,
  imports: [TimelineComponent, TimelineItemComponent],
  template: `
    <ngx-ds-timeline [variant]="variant()">
      <ngx-ds-timeline-item title="Creado" status="completed" />
      <ngx-ds-timeline-item title="Enviado" status="pending" />
    </ngx-ds-timeline>
  `,
})
class Host {
  variant = signal<'default' | 'compact'>('default');
}

describe('TimelineComponent', () => {
  it('applies the variant class and projects items', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const list = el.querySelector('ol')!;
    expect(list.className).toBe('timeline timeline--default');
    expect(list.querySelectorAll('ngx-ds-timeline-item').length).toBe(2);
    expect(list.textContent).toContain('Creado');

    fixture.componentInstance.variant.set('compact');
    fixture.detectChanges();
    expect(list.className).toBe('timeline timeline--compact');
  });
});
