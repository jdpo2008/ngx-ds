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
