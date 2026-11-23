import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ChevronRight, User } from 'lucide-angular';
import { MenuButtonComponent } from './menu-button.component';

const classesOf = (x: Element | string) =>
  (typeof x === 'string' ? x.split(' ') : [...x.classList]).sort();

describe('MenuButtonComponent', () => {
  @Component({
    standalone: true,
    imports: [MenuButtonComponent],
    template: `
      <ngx-ds-menu-button
        [iconLeft]="user"
        [iconRight]="chevron"
        color="danger"
        size="lg"
        [fullWidth]="true"
        [disabled]="disabled"
        >Perfil</ngx-ds-menu-button
      >
    `,
  })
  class Host {
    user = User;
    chevron = ChevronRight;
    disabled = false;
  }

  function setup(disabled = false) {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.disabled = disabled;
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('button')!;
  }

  it('renders label, both icons and the modifier classes', () => {
    const btn = setup();
    expect(btn.textContent?.trim()).toBe('Perfil');
    expect(classesOf(btn)).toEqual(
      classesOf('menu-btn menu-btn--lg menu-btn--danger menu-btn--full'),
    );
    const icons = btn.querySelectorAll('ngx-ds-icon.menu-btn__icon');
    expect(icons.length).toBe(2);
    expect(icons[0].querySelector('svg')?.getAttribute('width')).toBe('18');
  });

  it('disables the native button', () => {
    expect(setup(true).disabled).toBe(true);
  });
});

describe('MenuButtonComponent behaviour', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(MenuButtonComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('button')!;
  }

  it('defaults to a non-submitting md default button without icons', () => {
    const btn = setup();
    expect(btn.type).toBe('button');
    expect(classesOf(btn)).toEqual(classesOf('menu-btn menu-btn--md menu-btn--default'));
    expect(btn.querySelector('ngx-ds-icon')).toBeNull();
    expect(btn.hasAttribute('disabled')).toBe(false);
  });

  it('passes the button type through', () => {
    expect(setup({ type: 'submit' }).type).toBe('submit');
  });

  it('sizes the icons with the button', () => {
    const btn = setup({ iconLeft: User, size: 'sm' });
    const icon = btn.querySelector('ngx-ds-icon')!;
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.querySelector('svg')?.getAttribute('width')).toBe('14');
  });
});
