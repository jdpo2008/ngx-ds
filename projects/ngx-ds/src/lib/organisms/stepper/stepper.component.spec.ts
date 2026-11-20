import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StepComponent, StepperComponent } from './index';

@Component({
  standalone: true,
  imports: [StepperComponent, StepComponent],
  template: `
    <ngx-ds-stepper
      [(active)]="active"
      [clickable]="clickable()"
      (stepChange)="changes.push($event)"
    >
      <ngx-ds-step label="Cuenta"><p class="c0">0</p></ngx-ds-step>
      <ngx-ds-step label="Perfil"><p class="c1">1</p></ngx-ds-step>
      <ngx-ds-step label="Confirmar"><p class="c2">2</p></ngx-ds-step>
    </ngx-ds-stepper>
  `,
})
class Host {
  active = signal(0);
  clickable = signal(false);
  changes: number[] = [];
  readonly stepper = viewChild.required(StepperComponent);
}

describe('StepperComponent', () => {
  function setup(clickable = false) {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.clickable.set(clickable);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const el = fixture.nativeElement as HTMLElement;
    const steps = () => Array.from(el.querySelectorAll<HTMLElement>('ngx-ds-step'));
    const bubbles = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.stepper__bubble'));
    const run = (fn: () => void) => {
      fn();
      fixture.detectChanges();
    };
    return { host, el, steps, bubbles, run };
  }

  it('shows only the active step and marks it as current', () => {
    const { steps, bubbles } = setup();
    expect(steps().map((s) => s.hasAttribute('hidden'))).toEqual([false, true, true]);
    expect(bubbles()[0].getAttribute('aria-current')).toBe('step');
  });

  it('advances and goes back within bounds', () => {
    const { host, steps, el, run } = setup();
    run(() => host.stepper().next());
    expect(host.active()).toBe(1);
    expect(steps()[1].hasAttribute('hidden')).toBe(false);
    expect(el.querySelector('.stepper__item.is-completed')).not.toBeNull();
    run(() => host.stepper().next());
    run(() => host.stepper().next());
    expect(host.active()).toBe(2);
    run(() => host.stepper().previous());
    run(() => host.stepper().previous());
    run(() => host.stepper().previous());
    expect(host.active()).toBe(0);
    expect(host.changes).toEqual([1, 2, 1, 0]);
  });

  it('disables bubbles and ignores goTo when not clickable', () => {
    const { host, bubbles, run } = setup();
    expect(bubbles().every((b) => b.disabled)).toBe(true);
    run(() => host.stepper().goTo(2));
    expect(host.active()).toBe(0);
  });

  it('jumps to a step from its bubble when clickable', () => {
    const { host, bubbles, run } = setup(true);
    run(() => bubbles()[2].click());
    expect(host.active()).toBe(2);
    expect(host.changes).toEqual([2]);
  });
});

describe('StepperComponent behaviour', () => {
  function setup(clickable = true) {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.clickable.set(clickable);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const el = fixture.nativeElement as HTMLElement;
    const steps = () => Array.from(el.querySelectorAll<HTMLElement>('ngx-ds-step'));
    const bubbles = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.stepper__bubble'));
    const run = (fn: () => void) => {
      fn();
      fixture.detectChanges();
    };
    return { fixture, host, el, steps, bubbles, run };
  }

  it('clicking the current step emits nothing', () => {
    const { host, bubbles, run } = setup();
    run(() => bubbles()[0].click());
    expect(host.changes).toEqual([]);
  });

  it('goTo ignores an index outside the steps', () => {
    const { host, steps, run } = setup();
    run(() => host.stepper().goTo(5));
    run(() => host.stepper().goTo(-1));
    expect(host.active()).toBe(0);
    expect(host.changes).toEqual([]);
    expect(steps()[0].hasAttribute('hidden')).toBe(false);
  });

  it('completed steps show a check and the line before the active step is done', () => {
    const { host, el, run } = setup();
    run(() => host.active.set(2));
    const items = Array.from(el.querySelectorAll('.stepper__item'));
    expect(items.map((i) => i.classList.contains('is-completed'))).toEqual([true, true, false]);
    expect(items[0].querySelector('ngx-ds-icon')).not.toBeNull();
    expect(items[2].querySelector('.stepper__bubble')!.textContent!.trim()).toBe('3');
  });

  it('labels each bubble with its number and step label', () => {
    const { bubbles } = setup();
    expect(bubbles().map((b) => b.getAttribute('aria-label'))).toEqual([
      '1. Cuenta',
      '2. Perfil',
      '3. Confirmar',
    ]);
  });

  it('canGoNext and canGoPrev follow the active step', () => {
    const { host, run } = setup();
    expect(host.stepper().canGoPrev()).toBe(false);
    expect(host.stepper().canGoNext()).toBe(true);
    run(() => host.active.set(2));
    expect(host.stepper().canGoPrev()).toBe(true);
    expect(host.stepper().canGoNext()).toBe(false);
  });
});
