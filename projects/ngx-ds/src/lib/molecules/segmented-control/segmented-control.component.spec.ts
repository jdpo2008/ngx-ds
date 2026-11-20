import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SegmentedControlComponent, SegmentOption } from './segmented-control.component';

const OPTIONS: SegmentOption[] = [
  { label: 'Día', value: 'day' },
  { label: 'Semana', value: 'week' },
  { label: 'Mes', value: 'month', disabled: true },
];

describe('SegmentedControlComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SegmentedControlComponent);
    fixture.componentRef.setInput('options', OPTIONS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.segmented__option'));
    return { fixture, cmp: fixture.componentInstance, buttons };
  }

  it('marks the selected option as pressed', () => {
    const { fixture, cmp, buttons } = setup({ value: 'day' });
    expect(buttons()[0].getAttribute('aria-pressed')).toBe('true');
    buttons()[1].click();
    fixture.detectChanges();
    expect(cmp.value()).toBe('week');
    expect(buttons()[1].classList).toContain('segmented__option--active');
    expect(buttons()[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('does not select a disabled option', () => {
    const { cmp, buttons } = setup({ value: 'day' });
    expect(buttons()[2].disabled).toBe(true);
    cmp.select(OPTIONS[2]);
    expect(cmp.value()).toBe('day');
  });

  describe('with reactive forms', () => {
    @Component({
      standalone: true,
      imports: [SegmentedControlComponent, ReactiveFormsModule],
      template: `<ngx-ds-segmented-control [options]="options" [formControl]="ctrl" />`,
    })
    class Host {
      options = OPTIONS;
      ctrl = new FormControl<string | number | null>('week');
    }

    it('syncs the value and honours FormControl.disable()', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const ctrl = fixture.componentInstance.ctrl;
      const el = fixture.nativeElement as HTMLElement;
      const buttons = () =>
        Array.from(el.querySelectorAll<HTMLButtonElement>('.segmented__option'));
      expect(buttons()[1].getAttribute('aria-pressed')).toBe('true');

      buttons()[0].click();
      expect(ctrl.value).toBe('day');
      expect(ctrl.touched).toBe(true);

      ctrl.disable();
      fixture.detectChanges();
      expect(buttons().every((b) => b.disabled)).toBe(true);
      const seg = fixture.debugElement.children[0].componentInstance as SegmentedControlComponent;
      seg.select(OPTIONS[1]);
      expect(ctrl.value).toBe('day');
    });
  });
});

describe('SegmentedControlComponent behaviour', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SegmentedControlComponent);
    fixture.componentRef.setInput('options', OPTIONS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    const cmp = fixture.componentInstance;
    const changes: (string | number | null)[] = [];
    const touched = vi.fn();
    cmp.registerOnChange((v) => changes.push(v));
    cmp.registerOnTouched(touched);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const group = el.querySelector<HTMLElement>('.segmented')!;
    const buttons = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.segmented__option'));
    const pressed = () => buttons().map((b) => b.getAttribute('aria-pressed'));
    const render = () => fixture.detectChanges();
    return { fixture, cmp, group, buttons, pressed, render, changes, touched };
  }

  it('size, fullWidth and disabled set the classes', () => {
    const { fixture, group, render } = setup({ size: 'sm', fullWidth: true });
    expect(group.className).toContain('segmented--sm');
    expect(group.className).toContain('segmented--full');
    fixture.componentRef.setInput('disabled', true);
    render();
    expect(group.className).toContain('segmented--disabled');
  });

  it('the disabled input disables every option', () => {
    const { cmp, buttons, changes } = setup({ value: 'day', disabled: true });
    expect(buttons().every((b) => b.disabled)).toBe(true);
    cmp.select(OPTIONS[1]);
    expect(cmp.value()).toBe('day');
    expect(changes).toEqual([]);
  });

  it('a click reports the value to the form', () => {
    const { buttons, changes, touched } = setup();
    buttons()[1].click();
    expect(changes).toEqual(['week']);
    expect(touched).toHaveBeenCalled();
  });

  it('choosing the option already selected reports nothing', () => {
    const { buttons, changes } = setup({ value: 'week' });
    buttons()[1].click();
    expect(changes).toEqual([]);
  });

  it('focus leaving the group marks it touched', () => {
    const { buttons, touched } = setup();
    buttons()[0].dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(touched).toHaveBeenCalledOnce();
  });

  it('writeValue presses the matching option; an unknown value presses none', () => {
    const { cmp, pressed, render } = setup();
    expect(pressed()).toEqual(['false', 'false', 'false']);
    cmp.writeValue('week');
    render();
    expect(pressed()).toEqual(['false', 'true', 'false']);
    cmp.writeValue('year');
    render();
    expect(pressed()).toEqual(['false', 'false', 'false']);
  });

  it('a disabled option is marked and cannot be clicked', () => {
    const { buttons, changes } = setup();
    expect(buttons()[2].classList).toContain('segmented__option--disabled');
    buttons()[2].click();
    expect(changes).toEqual([]);
  });
});
