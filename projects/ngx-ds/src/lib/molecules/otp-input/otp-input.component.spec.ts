import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OtpInputComponent } from './otp-input.component';

@Component({
  standalone: true,
  imports: [OtpInputComponent, ReactiveFormsModule],
  template: `<ngx-ds-otp-input [length]="4" [formControl]="control" />`,
})
class Host {
  control = new FormControl('12', { nonNullable: true });
}

function setup() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  const boxes = Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll('input'),
  ) as HTMLInputElement[];
  return { fixture, host: fixture.componentInstance, boxes };
}

function type(box: HTMLInputElement, char: string): void {
  box.value = char;
  box.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('OtpInputComponent forms integration', () => {
  it('renders the initial control value in the boxes', () => {
    const { boxes } = setup();
    expect(boxes.map((b) => b.value)).toEqual(['1', '2', '', '']);
  });

  it('reflects values written to the control', () => {
    const { fixture, host, boxes } = setup();
    host.control.setValue('9876');
    fixture.detectChanges();
    expect(boxes.map((b) => b.value)).toEqual(['9', '8', '7', '6']);
  });

  it('updates the control when the user types', () => {
    const { fixture, host, boxes } = setup();
    type(boxes[2], '3');
    fixture.detectChanges();
    expect(host.control.value).toBe('123');
    expect(host.control.dirty).toBe(true);
  });

  it('marks the control as touched on blur', () => {
    const { host, boxes } = setup();
    boxes[0].dispatchEvent(new Event('blur'));
    expect(host.control.touched).toBe(true);
  });

  it('disables every box when the control is disabled', () => {
    const { fixture, host, boxes } = setup();
    host.control.disable();
    fixture.detectChanges();
    expect(boxes.every((b) => b.disabled)).toBe(true);
  });
});
