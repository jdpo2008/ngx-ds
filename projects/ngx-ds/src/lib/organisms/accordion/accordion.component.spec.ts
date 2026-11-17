import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AccordionComponent } from './accordion.component';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  standalone: true,
  imports: [AccordionComponent, AccordionItemComponent],
  template: `
    <ngx-ds-accordion [multiple]="multiple()">
      <ngx-ds-accordion-item label="Uno">A</ngx-ds-accordion-item>
      <ngx-ds-accordion-item label="Dos">B</ngx-ds-accordion-item>
      <ngx-ds-accordion-item label="Tres" [disabled]="true">C</ngx-ds-accordion-item>
    </ngx-ds-accordion>
  `,
})
class Host {
  multiple = signal(false);
}

describe('AccordionComponent', () => {
  function setup(multiple = false) {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.multiple.set(multiple);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const triggers = Array.from(el.querySelectorAll<HTMLButtonElement>('.accordion-item__trigger'));
    const click = (i: number) => {
      triggers[i].click();
      fixture.detectChanges();
    };
    const expanded = () => triggers.map((t) => t.getAttribute('aria-expanded'));
    return { el, triggers, click, expanded };
  }

  it('starts with every item collapsed', () => {
    const { expanded } = setup();
    expect(expanded()).toEqual(['false', 'false', 'false']);
  });

  it('toggles an item open and closed', () => {
    const { el, click, expanded } = setup();
    click(0);
    expect(expanded()[0]).toBe('true');
    expect(el.querySelector('.accordion-item--open')).not.toBeNull();
    click(0);
    expect(expanded()[0]).toBe('false');
  });

  it('closes siblings in single mode', () => {
    const { click, expanded } = setup();
    click(0);
    click(1);
    expect(expanded()).toEqual(['false', 'true', 'false']);
  });

  it('keeps several items open when multiple is set', () => {
    const { click, expanded } = setup(true);
    click(0);
    click(1);
    expect(expanded()).toEqual(['true', 'true', 'false']);
  });

  it('does not open a disabled item', () => {
    const { triggers, click, expanded } = setup();
    expect(triggers[2].disabled).toBe(true);
    click(2);
    expect(expanded()[2]).toBe('false');
  });
});
