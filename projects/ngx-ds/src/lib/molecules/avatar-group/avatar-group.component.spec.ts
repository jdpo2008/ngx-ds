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

describe('AvatarGroupComponent behaviour', () => {
  @Component({
    standalone: true,
    imports: [AvatarGroupComponent, AvatarComponent],
    template: `
      <ngx-ds-avatar-group [max]="max()" [size]="size()">
        @for (n of names(); track n) {
          <ngx-ds-avatar [initials]="n" />
        }
      </ngx-ds-avatar-group>
    `,
  })
  class GroupHost {
    max = signal<number | null>(2);
    size = signal<'sm' | 'lg'>('sm');
    names = signal(['AB', 'CD', 'EF', 'GH']);
  }

  function setup() {
    const fixture = TestBed.createComponent(GroupHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const shown = () =>
      Array.from(el.querySelectorAll<HTMLElement>('ngx-ds-avatar')).map(
        (a) => getComputedStyle(a).display !== 'none',
      );
    return { fixture, el, shown };
  }

  it('really hides the avatars past max, not only marks them hidden', () => {
    const { shown } = setup();
    expect(shown()).toEqual([true, true, false, false]);
  });

  it('updates the overflow count when avatars are added or max changes', () => {
    const { fixture, el, shown } = setup();
    const count = () => el.querySelector('.avatar-group__count')?.textContent?.trim() ?? null;
    expect(count()).toBe('+2');
    fixture.componentInstance.names.update((n) => [...n, 'IJ']);
    fixture.detectChanges();
    expect(count()).toBe('+3');
    fixture.componentInstance.max.set(null);
    fixture.detectChanges();
    expect(count()).toBeNull();
    expect(shown()).toEqual([true, true, true, true, true]);
  });

  it('sizes the overflow count like the avatars', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.size.set('lg');
    fixture.detectChanges();
    expect(el.querySelector('.avatar-group__count')!.classList).toContain(
      'avatar-group__count--lg',
    );
  });
});
