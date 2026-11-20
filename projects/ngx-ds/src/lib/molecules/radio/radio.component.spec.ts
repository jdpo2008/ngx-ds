import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioComponent, RadioValue } from './radio.component';

@Component({
  standalone: true,
  imports: [RadioComponent],
  template: `
    @for (v of ['a', 'b']; track v) {
      <ngx-ds-radio
        name="t"
        [value]="v"
        [checked]="selected() === v"
        [disabled]="disabled()"
        (valueSelect)="selected.set($any($event))"
      />
    }
  `,
})
class ControlledHost {
  selected = signal('a');
  disabled = signal(false);
}

@Component({
  standalone: true,
  imports: [RadioComponent, FormsModule],
  template: `
    @for (v of ['a', 'b']; track v) {
      <ngx-ds-radio name="f" [value]="v" [(ngModel)]="choice" />
    }
  `,
})
class FormsHost {
  choice = 'b';
}

const radios = (el: HTMLElement) => Array.from(el.querySelectorAll('input[type="radio"]'));
const checkedState = (el: HTMLElement) =>
  Array.from(el.querySelectorAll('label')).map((l) => l.classList.contains('radio--checked'));

describe('RadioComponent', () => {
  it('[checked] drives the state and valueSelect emits the selected value', () => {
    const fixture = TestBed.createComponent(ControlledHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(checkedState(el)).toEqual([true, false]);

    (radios(el)[1] as HTMLInputElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected()).toBe('b');
    expect(checkedState(el)).toEqual([false, true]);
  });

  it('valueSelect emits the value, not the native change Event', () => {
    const fixture = TestBed.createComponent(RadioComponent);
    fixture.componentRef.setInput('value', 7);
    fixture.detectChanges();
    const emitted: unknown[] = [];
    fixture.componentInstance.valueSelect.subscribe((v) => emitted.push(v));
    (radios(fixture.nativeElement)[0] as HTMLInputElement).click();
    expect(emitted).toEqual([7]);
  });

  it('the disabled input disables the native radio and blocks selection', () => {
    const fixture = TestBed.createComponent(ControlledHost);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const second = radios(el)[1] as HTMLInputElement;
    expect(second.disabled).toBe(true);
    expect(el.querySelector('label')?.classList.contains('radio--disabled')).toBe(true);
    second.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected()).toBe('a');
  });

  it('works as a group with ngModel', async () => {
    const fixture = TestBed.createComponent(FormsHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(checkedState(el)).toEqual([false, true]);

    (radios(el)[0] as HTMLInputElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.choice).toBe('a');
    expect(checkedState(el)).toEqual([true, false]);
  });
});

@Component({
  standalone: true,
  imports: [RadioComponent, ReactiveFormsModule],
  template: `
    @for (v of values; track v) {
      <ngx-ds-radio name="rf" [value]="v" [label]="'Opción ' + v" [formControl]="control" />
    }
  `,
})
class ReactiveHost {
  values: RadioValue[] = [1, 2, 3];
  control = new FormControl<RadioValue | null>(1);
}

@Component({
  standalone: true,
  imports: [RadioComponent],
  template: `
    <ngx-ds-radio name="free" value="x" />
    <ngx-ds-radio name="free" value="y" />
    <ngx-ds-radio name="other" value="z" />
  `,
})
class UncontrolledHost {}

@Component({
  standalone: true,
  imports: [RadioComponent],
  template: `
    @for (v of ['a', 'b']; track v) {
      <ngx-ds-radio name="locked" [value]="v" [checked]="v === 'a'" />
    }
  `,
})
class LockedHost {}

describe('RadioComponent behaviour', () => {
  afterEach(() => document.body.replaceChildren());

  function mount<T>(type: new () => T) {
    const fixture = TestBed.createComponent(type);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    const el = fixture.nativeElement as HTMLElement;
    const inputs = () => radios(el) as HTMLInputElement[];
    return { fixture, el, inputs, render: () => fixture.detectChanges() };
  }

  it('a reactive form group moves the checked state to the clicked radio', () => {
    const { fixture, el, inputs, render } = mount(ReactiveHost);
    expect(checkedState(el)).toEqual([true, false, false]);
    inputs()[1].click();
    render();
    expect(fixture.componentInstance.control.value).toBe(2);
    expect(checkedState(el)).toEqual([false, true, false]);
    expect(inputs().map((i) => i.checked)).toEqual([false, true, false]);
  });

  it('a reactive form value set in code checks the matching radio', () => {
    const { fixture, el, render } = mount(ReactiveHost);
    fixture.componentInstance.control.setValue(3);
    render();
    expect(checkedState(el)).toEqual([false, false, true]);
  });

  it('a disabled reactive control disables every radio', () => {
    const { fixture, el, inputs, render } = mount(ReactiveHost);
    fixture.componentInstance.control.disable();
    render();
    expect(inputs().every((i) => i.disabled)).toBe(true);
    expect(el.querySelector('label')!.className).toContain('radio--disabled');
  });

  it('radios without forms or [checked] keep one checked per name', () => {
    const { el, inputs, render } = mount(UncontrolledHost);
    inputs()[2].click();
    inputs()[0].click();
    render();
    expect(checkedState(el)).toEqual([true, false, true]);
    inputs()[1].click();
    render();
    expect(checkedState(el)).toEqual([false, true, true]);
  });

  it('with [checked], a click the parent ignores does not leave the native radio checked', () => {
    const { el, inputs, render } = mount(LockedHost);
    inputs()[1].click();
    render();
    expect(checkedState(el)).toEqual([true, false]);
    expect(inputs().map((i) => i.checked)).toEqual([true, false]);
  });

  it('marks touched on blur', () => {
    const fixture = TestBed.createComponent(RadioComponent);
    fixture.componentRef.setInput('value', 'a');
    const touched = vi.fn();
    fixture.componentInstance.registerOnTouched(touched);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector('input')!.dispatchEvent(new Event('blur'));
    expect(touched).toHaveBeenCalledOnce();
  });

  it('size, color and label position', () => {
    const fixture = TestBed.createComponent(RadioComponent);
    fixture.componentRef.setInput('value', 'a');
    fixture.componentRef.setInput('label', 'A');
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('color', 'warning');
    fixture.componentRef.setInput('labelPosition', 'left');
    fixture.detectChanges();
    const label = (fixture.nativeElement as HTMLElement).querySelector('label')!;
    expect(label.className).toContain('radio--lg');
    expect(label.className).toContain('radio--warning');
    const children = Array.from(label.children).map((c) => c.className);
    expect(children.indexOf('radio__label')).toBeLessThan(children.indexOf('radio__circle'));
  });
});
