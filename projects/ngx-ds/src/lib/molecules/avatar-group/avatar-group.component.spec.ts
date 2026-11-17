import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AvatarComponent } from '../../atoms/avatar';
import { AvatarGroupComponent } from './avatar-group.component';

describe('AvatarGroupComponent', () => {
  @Component({
    standalone: true,
    imports: [AvatarGroupComponent, AvatarComponent],
    template: `
      <ngx-ds-avatar-group [max]="max()" size="sm" spacing="-1rem">
        @for (n of names; track n) {
          <ngx-ds-avatar [initials]="n" />
        }
      </ngx-ds-avatar-group>
    `,
  })
  class Host {
    max = signal<number | null>(null);
    names = ['AB', 'CD', 'EF', 'GH'];
  }

  function setup(max: number | null) {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.max.set(max);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, el, avatars: Array.from(el.querySelectorAll('ngx-ds-avatar')) };
  }

  it('shows every avatar and no counter without max', () => {
    const { el, avatars } = setup(null);
    expect(avatars.filter((a) => a.hasAttribute('hidden')).length).toBe(0);
    expect(el.querySelector('.avatar-group__count')).toBeNull();
  });

  it('hides the overflow and shows a +N counter sized like the group', () => {
    const { el, avatars } = setup(2);
    expect(avatars.map((a) => a.hasAttribute('hidden'))).toEqual([false, false, true, true]);
    const count = el.querySelector('.avatar-group__count')!;
    expect(count.textContent).toBe('+2');
    expect(count.classList).toContain('avatar-group__count--sm');
  });

  it('applies the overlap spacing as a CSS variable', () => {
    const { el } = setup(null);
    const group = el.querySelector<HTMLElement>('.avatar-group')!;
    expect(group.style.getPropertyValue('--ag-overlap')).toBe('-1rem');
  });

  it('shows hidden avatars again when max grows', () => {
    const { fixture, el, avatars } = setup(1);
    fixture.componentInstance.max.set(10);
    fixture.detectChanges();
    expect(avatars.some((a) => a.hasAttribute('hidden'))).toBe(false);
    expect(el.querySelector('.avatar-group__count')).toBeNull();
  });
});
