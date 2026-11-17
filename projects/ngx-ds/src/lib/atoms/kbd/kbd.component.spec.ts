import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { KbdComponent } from './kbd.component';

const classesOf = (x: Element | string) =>
  (typeof x === 'string' ? x.split(' ') : [...x.classList]).sort();

describe('KbdComponent', () => {
  @Component({
    standalone: true,
    imports: [KbdComponent],
    template: `<ngx-ds-kbd size="sm">Ctrl</ngx-ds-kbd>`,
  })
  class Host {}

  it('projects the key inside a <kbd> with the size class', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const kbd = (fixture.nativeElement as HTMLElement).querySelector('kbd')!;
    expect(kbd.textContent).toBe('Ctrl');
    expect(classesOf(kbd)).toEqual(classesOf('kbd kbd--sm'));
  });
});
