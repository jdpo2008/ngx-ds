import { TestBed } from '@angular/core/testing';
import { LucideTrash as Trash } from '@lucide/angular';
import { IconButtonComponent } from './icon-button.component';

const classesOf = (x: Element | string) =>
  (typeof x === 'string' ? x.split(' ') : [...x.classList]).sort();

describe('IconButtonComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(IconButtonComponent);
    fixture.componentRef.setInput('icon', Trash);
    fixture.componentRef.setInput('ariaLabel', 'Borrar');
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('button')!;
  }

  it('is labelled and hides the icon from assistive tech', () => {
    const btn = setup();
    expect(btn.getAttribute('aria-label')).toBe('Borrar');
    expect(btn.type).toBe('button');
    expect(btn.querySelector('ngx-ds-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(classesOf(btn)).toEqual(
      classesOf('icon-btn icon-btn--solid icon-btn--md icon-btn--primary'),
    );
  });

  it('reflects variant, size, color, rounded and borderless', () => {
    const btn = setup({
      variant: 'outline',
      size: 'sm',
      color: 'danger',
      rounded: true,
      bordered: false,
    });
    expect(classesOf(btn)).toEqual(
      classesOf(
        'icon-btn icon-btn--outline icon-btn--sm icon-btn--danger icon-btn--rounded icon-btn--borderless',
      ),
    );
    expect(btn.querySelector('svg')?.getAttribute('width')).toBe('14');
  });

  it('disables the native button', () => {
    expect(setup({ disabled: true }).disabled).toBe(true);
  });
});

describe('IconButtonComponent aria-expanded', () => {
  function setup(expanded?: boolean) {
    const fixture = TestBed.createComponent(IconButtonComponent);
    fixture.componentRef.setInput('icon', Trash);
    fixture.componentRef.setInput('ariaLabel', 'Menú');
    if (expanded !== undefined) fixture.componentRef.setInput('ariaExpanded', expanded);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('button')!;
  }

  it('omits aria-expanded unless it is set', () => {
    expect(setup().hasAttribute('aria-expanded')).toBe(false);
  });

  it('reflects aria-expanded, including false', () => {
    expect(setup(true).getAttribute('aria-expanded')).toBe('true');
    expect(setup(false).getAttribute('aria-expanded')).toBe('false');
  });
});
