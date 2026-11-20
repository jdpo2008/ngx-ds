import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

const classesOf = (x: Element | string) =>
  (typeof x === 'string' ? x.split(' ') : [...x.classList]).sort();

describe('CardComponent', () => {
  @Component({
    standalone: true,
    imports: [CardComponent],
    template: `
      <ngx-ds-card shadow="lg" padding="none" [bordered]="false" [hoverable]="true">
        <h3 card-header>Título</h3>
        <p>Contenido</p>
        <button card-footer>OK</button>
      </ngx-ds-card>
    `,
  })
  class Host {}

  it('uses the default classes', () => {
    const fixture = TestBed.createComponent(CardComponent);
    fixture.detectChanges();
    const card = (fixture.nativeElement as HTMLElement).querySelector('.card')!;
    expect(classesOf(card)).toEqual(classesOf('card card--shadow-sm card--pad-md card--bordered'));
  });

  it('projects header, body and footer and reflects the modifiers', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(classesOf(el.querySelector('.card')!)).toEqual(
      classesOf('card card--shadow-lg card--pad-none card--hoverable'),
    );
    expect(el.querySelector('.card__header h3')?.textContent).toBe('Título');
    expect(el.querySelector('.card__body p')?.textContent).toBe('Contenido');
    expect(el.querySelector('.card__footer button')?.textContent).toBe('OK');
  });
});

describe('CardComponent behaviour', () => {
  @Component({
    standalone: true,
    imports: [CardComponent],
    template: `<ngx-ds-card><p>Solo cuerpo</p></ngx-ds-card>`,
  })
  class BodyOnlyHost {}

  it('hides the header and footer when nothing is projected into them', () => {
    const fixture = TestBed.createComponent(BodyOnlyHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(getComputedStyle(el.querySelector('.card__header')!).display).toBe('none');
    expect(getComputedStyle(el.querySelector('.card__footer')!).display).toBe('none');
    expect(getComputedStyle(el.querySelector('.card__body')!).display).not.toBe('none');
  });

  it('updates the modifiers when the inputs change', () => {
    const fixture = TestBed.createComponent(CardComponent);
    fixture.componentRef.setInput('shadow', 'none');
    fixture.componentRef.setInput('padding', 'lg');
    fixture.componentRef.setInput('bordered', false);
    fixture.detectChanges();
    const card = (fixture.nativeElement as HTMLElement).querySelector('.card')!;
    expect(card.classList).toContain('card--shadow-none');
    expect(card.classList).toContain('card--pad-lg');
    expect(card.classList).not.toContain('card--bordered');
  });
});
