import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;
  let component: BadgeComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
  });

  describe('displayText', () => {
    it('shows the label when no count is set', () => {
      fixture.componentRef.setInput('label', 'Nuevo');
      expect(component.displayText()).toBe('Nuevo');
    });

    it('shows the count instead of the label', () => {
      fixture.componentRef.setInput('label', 'Nuevo');
      fixture.componentRef.setInput('count', 5);
      expect(component.displayText()).toBe('5');
    });

    it('caps the count at max with a "+" suffix', () => {
      fixture.componentRef.setInput('count', 150);
      expect(component.displayText()).toBe('99+');

      fixture.componentRef.setInput('max', 9);
      fixture.componentRef.setInput('count', 10);
      expect(component.displayText()).toBe('9+');
    });

    it('shows count 0', () => {
      fixture.componentRef.setInput('count', 0);
      expect(component.displayText()).toBe('0');
    });

    it('is empty in dot mode', () => {
      fixture.componentRef.setInput('count', 3);
      fixture.componentRef.setInput('dot', true);
      expect(component.displayText()).toBe('');
    });
  });

  describe('hostClasses', () => {
    it('uses the defaults', () => {
      expect(component.hostClasses()).toBe(
        'badge badge--md badge--primary badge--solid badge--rounded',
      );
    });

    it('reflects size, color, variant, rounded and dot', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.componentRef.setInput('color', 'danger');
      fixture.componentRef.setInput('variant', 'outline');
      fixture.componentRef.setInput('rounded', false);
      fixture.componentRef.setInput('dot', true);
      expect(component.hostClasses()).toBe(
        'badge badge--sm badge--danger badge--outline badge--dot',
      );
    });
  });
});
