import { TestBed } from '@angular/core/testing';
import { DividerComponent } from './divider.component';

const classesOf = (x: Element | string) =>
  (typeof x === 'string' ? x.split(' ') : [...x.classList]).sort();

describe('DividerComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(DividerComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { el, root: el.querySelector<HTMLElement>('[role="separator"]')! };
  }

  it('renders a horizontal solid separator by default', () => {
    const { el, root } = setup();
    expect(classesOf(root)).toEqual(classesOf('divider divider--horizontal divider--solid'));
    expect(el.querySelector('.divider__label')).toBeNull();
  });

  it('renders the label with its alignment modifier', () => {
    const { el, root } = setup({ label: 'O', align: 'start', variant: 'dashed' });
    expect(el.querySelector('.divider__label')?.textContent).toBe('O');
    expect(classesOf(root)).toEqual(
      classesOf(
        'divider divider--horizontal divider--dashed divider--labeled divider--label-start',
      ),
    );
  });

  it('does not render the label when vertical', () => {
    const { el } = setup({ label: 'O', orientation: 'vertical' });
    expect(el.querySelector('.divider__label')).toBeNull();
  });

  it('applies a custom border color', () => {
    const { root } = setup({ color: 'red' });
    expect(root.style.borderColor).toBe('red');
  });
});
