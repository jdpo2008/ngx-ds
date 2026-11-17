import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RadioComponent } from './radio.component';

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
