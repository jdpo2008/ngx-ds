import { TestBed } from '@angular/core/testing';
import { ChipGroupComponent, ChipItem } from './chip-group.component';

const CHIPS: ChipItem[] = [
  { value: 'a', label: 'Angular' },
  { value: 'r', label: 'React', disabled: true },
];

describe('ChipGroupComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ChipGroupComponent);
    fixture.componentRef.setInput('chips', CHIPS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, cmp: fixture.componentInstance, el };
  }

  it('renders the remove control as a sibling button, not nested', () => {
    const { el } = setup({ removable: true });
    const remove = el.querySelector('.chip__remove') as HTMLElement;
    expect(remove.tagName).toBe('BUTTON');
    expect(remove.getAttribute('aria-label')).toBe('Quitar Angular');
    expect(remove.closest('.chip__label')).toBeNull();
    expect(el.querySelector('button button')).toBeNull();
  });

  it('removing a chip emits removed without toggling it', () => {
    const { cmp, el } = setup({ removable: true, selectable: true });
    const removed: ChipItem[] = [];
    cmp.removed.subscribe((c) => removed.push(c));
    (el.querySelector('.chip__remove') as HTMLElement).click();
    expect(removed).toEqual([CHIPS[0]]);
    expect(cmp.selected()).toEqual([]);
  });

  it('toggles selection and reflects it in aria-pressed', () => {
    const { fixture, el } = setup({ selectable: true });
    const label = el.querySelector('.chip__label') as HTMLButtonElement;
    expect(label.getAttribute('aria-pressed')).toBe('false');
    label.click();
    fixture.detectChanges();
    expect(label.getAttribute('aria-pressed')).toBe('true');
  });

  it('disables both controls of a disabled chip', () => {
    const { el } = setup({ removable: true });
    const [, react] = Array.from(el.querySelectorAll('.chip'));
    expect((react.querySelector('.chip__label') as HTMLButtonElement).disabled).toBe(true);
    expect((react.querySelector('.chip__remove') as HTMLButtonElement).disabled).toBe(true);
  });
});
