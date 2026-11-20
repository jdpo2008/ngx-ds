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

describe('ChipGroupComponent behaviour', () => {
  const ITEMS: ChipItem[] = [
    { value: 'a', label: 'Angular' },
    { value: 'v', label: 'Vue' },
    { value: 's', label: 'Svelte' },
  ];

  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ChipGroupComponent);
    fixture.componentRef.setInput('chips', ITEMS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const cmp = fixture.componentInstance;
    const labels = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.chip__label'));
    const click = (b: HTMLElement) => {
      b.click();
      fixture.detectChanges();
    };
    return { fixture, cmp, el, labels, click };
  }

  it('multiple selection adds and removes values in click order', () => {
    const { cmp, labels, click } = setup();
    click(labels()[2]);
    click(labels()[0]);
    expect(cmp.selected()).toEqual(['s', 'a']);
    click(labels()[2]);
    expect(cmp.selected()).toEqual(['a']);
  });

  it('single selection replaces the value and a second click clears it', () => {
    const { cmp, labels, click } = setup({ multiple: false });
    click(labels()[0]);
    click(labels()[1]);
    expect(cmp.selected()).toEqual(['v']);
    click(labels()[1]);
    expect(cmp.selected()).toEqual([]);
  });

  it('selectable=false ignores clicks and drops aria-pressed', () => {
    const { cmp, labels, click } = setup({ selectable: false });
    click(labels()[0]);
    expect(cmp.selected()).toEqual([]);
    expect(labels()[0].hasAttribute('aria-pressed')).toBe(false);
  });

  it('removing a selected chip also drops it from the selection', () => {
    const { cmp, el, labels, click } = setup({ removable: true, selected: ['a', 'v'] });
    const changes: unknown[] = [];
    cmp.registerOnChange((v) => changes.push(v));
    click(el.querySelectorAll<HTMLButtonElement>('.chip__remove')[0]);
    expect(cmp.selected()).toEqual(['v']);
    expect(changes).toEqual([['v']]);
    expect(labels().map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'true', 'false']);
  });

  it('removing an unselected chip leaves the selection alone', () => {
    const { cmp, el, click } = setup({ removable: true, selected: ['v'] });
    const changes: unknown[] = [];
    cmp.registerOnChange((v) => changes.push(v));
    click(el.querySelectorAll<HTMLButtonElement>('.chip__remove')[0]);
    expect(cmp.selected()).toEqual(['v']);
    expect(changes).toEqual([]);
  });

  it('works as a form control: value in, value out, disabled', () => {
    const { cmp, el, labels, click, fixture } = setup();
    const changes: unknown[] = [];
    let touched = 0;
    cmp.registerOnChange((v) => changes.push(v));
    cmp.registerOnTouched(() => touched++);
    cmp.writeValue(['v']);
    fixture.detectChanges();
    expect(labels()[1].getAttribute('aria-pressed')).toBe('true');
    click(labels()[0]);
    expect(changes).toEqual([['v', 'a']]);
    expect(touched).toBe(1);
    cmp.writeValue(null);
    cmp.setDisabledState(true);
    fixture.detectChanges();
    expect(cmp.selected()).toEqual([]);
    expect(labels().every((b) => b.disabled)).toBe(true);
    expect(el.querySelectorAll('.chip--disabled').length).toBe(3);
  });
});
