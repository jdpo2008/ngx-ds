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

describe('TimelineItemComponent behaviour', () => {
  @Component({
    standalone: true,
    imports: [TimelineComponent, TimelineItemComponent],
    template: `
      <ngx-ds-timeline>
        <ngx-ds-timeline-item title="Creado" time="10:00" description="Listo" status="completed">
          <a href="#">Ver</a>
        </ngx-ds-timeline-item>
        <ngx-ds-timeline-item title="Enviado" [status]="status()" />
        <ngx-ds-timeline-item title="Entregado" />
      </ngx-ds-timeline>
    `,
  })
  class StatusHost {
    status = signal<'active' | 'error'>('active');
  }

  function setup() {
    const fixture = TestBed.createComponent(StatusHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const items = Array.from(el.querySelectorAll<HTMLElement>('ngx-ds-timeline-item'));
    return { fixture, el, items };
  }

  it('renders time, title, description and projected content', () => {
    const { items } = setup();
    expect(items[0].querySelector('.timeline-item__time')?.textContent).toBe('10:00');
    expect(items[0].querySelector('.timeline-item__description')?.textContent).toBe('Listo');
    expect(items[0].querySelector('.timeline-item__content a')).not.toBeNull();
    expect(items[2].querySelector('.timeline-item__time')).toBeNull();
    expect(items[2].querySelector('.timeline-item__dot--pending')).not.toBeNull();
  });

  it('marks only the active item as the current step', () => {
    const { fixture, items } = setup();
    expect(items.map((i) => i.getAttribute('aria-current'))).toEqual([null, 'step', null]);
    fixture.componentInstance.status.set('error');
    fixture.detectChanges();
    expect(items[1].hasAttribute('aria-current')).toBe(false);
    expect(items[1].querySelector('.timeline-item__dot--error')).not.toBeNull();
  });

  it('draws the connector line on every item except the last', () => {
    const { items } = setup();
    const lineDisplay = (i: HTMLElement) =>
      getComputedStyle(i.querySelector('.timeline-item__line')!).display;
    expect(items.map(lineDisplay)).toEqual(['block', 'block', 'none']);
  });

  it('the compact variant tightens every row but the last', () => {
    @Component({
      standalone: true,
      imports: [TimelineComponent, TimelineItemComponent],
      template: `
        <ngx-ds-timeline [variant]="variant()">
          <ngx-ds-timeline-item title="A" />
          <ngx-ds-timeline-item title="B" />
        </ngx-ds-timeline>
      `,
    })
    class VariantHost {
      variant = signal<'default' | 'compact'>('default');
    }

    const fixture = TestBed.createComponent(VariantHost);
    fixture.detectChanges();
    const rows = () =>
      Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.timeline-item'),
      );
    const padding = () => rows().map((r) => getComputedStyle(r).paddingBottom);
    expect(padding()).toEqual(['1.5rem', '0px']);
    fixture.componentInstance.variant.set('compact');
    fixture.detectChanges();
    expect(padding()).toEqual(['0.75rem', '0px']);
  });
});
