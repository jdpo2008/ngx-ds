import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from '../../atoms/button/button.component';
import { ButtonGroupComponent } from './button-group.component';

describe('ButtonGroupComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ButtonGroupComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('[role="group"]')!;
  }

  it('renders a group without aria-label by default', () => {
    const group = setup();
    expect(group.className).toBe('btn-group');
    expect(group.hasAttribute('aria-label')).toBe(false);
  });

  it('applies aria-label and the full-width modifier', () => {
    const group = setup({ ariaLabel: 'Acciones', fullWidth: true });
    expect(group.getAttribute('aria-label')).toBe('Acciones');
    expect(group.classList).toContain('btn-group--full-width');
  });
});

describe('ButtonGroupComponent behaviour', () => {
  @Component({
    standalone: true,
    imports: [ButtonGroupComponent, ButtonComponent],
    template: `<ngx-ds-button-group [fullWidth]="full()">
      <ngx-ds-button>Uno</ngx-ds-button>
      <ngx-ds-button>Dos</ngx-ds-button>
    </ngx-ds-button-group>`,
  })
  class GroupHost {
    full = signal(false);
  }

  it('full width makes the component itself a block, not only its inner row', () => {
    const fixture = TestBed.createComponent(GroupHost);
    fixture.detectChanges();
    const host = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      'ngx-ds-button-group',
    )!;
    expect(getComputedStyle(host).display).toBe('inline-block');
    fixture.componentInstance.full.set(true);
    fixture.detectChanges();
    expect(getComputedStyle(host).display).toBe('block');
  });

  it('projects the buttons in order inside the group', () => {
    const fixture = TestBed.createComponent(GroupHost);
    fixture.detectChanges();
    const group = (fixture.nativeElement as HTMLElement).querySelector('[role="group"]')!;
    expect(Array.from(group.querySelectorAll('button')).map((b) => b.textContent?.trim())).toEqual([
      'Uno',
      'Dos',
    ]);
  });
});

describe('ButtonGroupComponent corners', () => {
  @Component({
    standalone: true,
    imports: [ButtonGroupComponent, ButtonComponent],
    template: `<ngx-ds-button-group>
      <ngx-ds-button [rounded]="true">Uno</ngx-ds-button>
      <ngx-ds-button [rounded]="true">Dos</ngx-ds-button>
      <ngx-ds-button [rounded]="true">Tres</ngx-ds-button>
    </ngx-ds-button-group>`,
  })
  class RoundedHost {}

  it('squares only the inner corners, so rounded buttons keep their outer shape', () => {
    const fixture = TestBed.createComponent(RoundedHost);
    fixture.detectChanges();
    const [first, middle, last] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.btn'),
    ).map((b) => getComputedStyle(b));
    // jsdom keeps the button's shorthand unexpanded: '' means the group left the corner alone.
    expect(['', '9999px']).toContain(first.borderTopLeftRadius);
    expect(first.borderTopRightRadius).toBe('0px');
    expect(middle.borderTopLeftRadius).toBe('0px');
    expect(middle.borderBottomRightRadius).toBe('0px');
    expect(['', '9999px']).toContain(last.borderBottomRightRadius);
    expect(last.borderBottomLeftRadius).toBe('0px');
  });
});
