import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RatingComponent } from './rating.component';

describe('RatingComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(RatingComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const stars = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.rating__star'));
    const filled = () => stars().filter((s) => s.classList.contains('rating__star--filled')).length;
    return { fixture, cmp: fixture.componentInstance, el, stars, filled };
  }

  it('renders max stars with translated labels', () => {
    const { stars } = setup({ max: 3 });
    expect(stars().length).toBe(3);
    expect(stars()[0].getAttribute('aria-label')).toBe('1 estrella');
    expect(stars()[2].getAttribute('aria-label')).toBe('3 estrellas');
  });

  it('sets the value on click and resets it when clicking the same star', () => {
    const { fixture, cmp, stars, filled } = setup();
    stars()[2].click();
    fixture.detectChanges();
    expect(cmp.value()).toBe(3);
    expect(filled()).toBe(3);
    stars()[2].click();
    fixture.detectChanges();
    expect(cmp.value()).toBe(0);
  });

  it('previews on hover and restores on mouseleave', () => {
    const { fixture, el, stars, filled } = setup({ value: 1 });
    stars()[3].dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(filled()).toBe(4);
    el.querySelector('.rating')!.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();
    expect(filled()).toBe(1);
  });

  it('ignores clicks when readonly', () => {
    const { cmp, stars } = setup({ value: 2, readonly: true });
    expect(stars()[0].disabled).toBe(true);
    cmp.onClick(4);
    expect(cmp.value()).toBe(2);
  });

  describe('with reactive forms', () => {
    @Component({
      standalone: true,
      imports: [RatingComponent, ReactiveFormsModule],
      template: `<ngx-ds-rating [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl(2);
    }

    it('syncs the value and honours FormControl.disable()', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const ctrl = fixture.componentInstance.ctrl;
      const el = fixture.nativeElement as HTMLElement;
      const stars = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.rating__star'));
      expect(el.querySelectorAll('.rating__star--filled').length).toBe(2);

      stars()[4].click();
      expect(ctrl.value).toBe(5);
      expect(ctrl.touched).toBe(true);

      ctrl.disable();
      fixture.detectChanges();
      expect(el.querySelector('.rating--disabled')).not.toBeNull();
      expect(stars().every((s) => s.disabled)).toBe(true);
      const rating = fixture.debugElement.children[0].componentInstance as RatingComponent;
      rating.onClick(1);
      expect(ctrl.value).toBe(5);
    });
  });
});
