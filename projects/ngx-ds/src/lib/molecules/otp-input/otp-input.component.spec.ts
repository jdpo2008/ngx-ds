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

@Component({
  standalone: true,
  imports: [OtpInputComponent],
  template: `<ngx-ds-otp-input
    [length]="4"
    [type]="type"
    [masked]="masked"
    [(value)]="value"
    (complete)="completed.push($event)"
  />`,
})
class InteractionHost {
  type: 'numeric' | 'alphanumeric' = 'numeric';
  masked = false;
  value = '';
  completed: string[] = [];
}

describe('OtpInputComponent interaction', () => {
  function mount(init: Partial<InteractionHost> = {}) {
    const fixture = TestBed.createComponent(InteractionHost);
    Object.assign(fixture.componentInstance, init);
    fixture.detectChanges();
    const boxes = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('input'),
    ) as HTMLInputElement[];
    const key = (i: number, k: string) => {
      boxes[i].dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
      fixture.detectChanges();
    };
    const paste = (i: number, text: string) => {
      const event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent;
      Object.defineProperty(event, 'clipboardData', { value: { getData: () => text } });
      boxes[i].dispatchEvent(event);
      fixture.detectChanges();
      return event;
    };
    return { fixture, host: fixture.componentInstance, boxes, key, paste };
  }

  it('drops non-digits in numeric mode and moves focus forward', () => {
    const { fixture, host, boxes } = mount();
    type(boxes[0], 'a');
    fixture.detectChanges();
    expect(boxes[0].value).toBe('');
    expect(host.value).toBe('');
    type(boxes[0], '7');
    fixture.detectChanges();
    expect(host.value).toBe('7');
    expect(document.activeElement).toBe(boxes[1]);
  });

  it('keeps letters upper-cased in alphanumeric mode, and only the last typed character', () => {
    const { fixture, host, boxes } = mount({ type: 'alphanumeric' });
    type(boxes[0], 'x-');
    type(boxes[1], 'ab');
    fixture.detectChanges();
    expect(boxes[0].value).toBe('X');
    expect(boxes[1].value).toBe('B');
    expect(host.value).toBe('XB');
  });

  it('emits complete once every box is filled', () => {
    const { fixture, host, boxes } = mount();
    ['1', '2', '3'].forEach((c, i) => type(boxes[i], c));
    expect(host.completed).toEqual([]);
    type(boxes[3], '4');
    fixture.detectChanges();
    expect(host.completed).toEqual(['1234']);
    expect(document.activeElement).toBe(boxes[3]);
  });

  it('Backspace clears a filled box, then moves back from an empty one', () => {
    const { host, boxes, key } = mount({ value: '12' });
    boxes[1].focus();
    key(1, 'Backspace');
    expect(host.value).toBe('1');
    expect(boxes[1].value).toBe('');
    expect(document.activeElement).toBe(boxes[1]);
    key(1, 'Backspace');
    expect(document.activeElement).toBe(boxes[0]);
  });

  it('Backspace on the first empty box stays put', () => {
    const { boxes, key } = mount();
    boxes[0].focus();
    key(0, 'Backspace');
    expect(document.activeElement).toBe(boxes[0]);
  });

  it('moves with the arrow keys, stopping at both ends', () => {
    const { boxes, key } = mount();
    boxes[0].focus();
    key(0, 'ArrowLeft');
    expect(document.activeElement).toBe(boxes[0]);
    key(0, 'ArrowRight');
    expect(document.activeElement).toBe(boxes[1]);
    boxes[3].focus();
    key(3, 'ArrowRight');
    expect(document.activeElement).toBe(boxes[3]);
    key(3, 'ArrowLeft');
    expect(document.activeElement).toBe(boxes[2]);
  });

  it('fills every box on paste, ignoring separators, and completes', () => {
    const { host, boxes, paste } = mount();
    const event = paste(0, '12-34');
    expect(event.defaultPrevented).toBe(true);
    expect(boxes.map((b) => b.value)).toEqual(['1', '2', '3', '4']);
    expect(host.value).toBe('1234');
    expect(host.completed).toEqual(['1234']);
    expect(document.activeElement).toBe(boxes[3]);
  });

  it('fills only the pasted characters and focuses the next empty box', () => {
    const { host, boxes, paste } = mount({ type: 'alphanumeric' });
    paste(2, 'ab');
    expect(boxes.map((b) => b.value)).toEqual(['A', 'B', '', '']);
    expect(host.value).toBe('AB');
    expect(host.completed).toEqual([]);
    expect(document.activeElement).toBe(boxes[2]);
  });

  it('selects the box content on focus and renders password boxes when masked', () => {
    const { boxes } = mount({ masked: true, value: '5' });
    expect(boxes[0].type).toBe('password');
    const select = vi.spyOn(boxes[0], 'select');
    boxes[0].dispatchEvent(new FocusEvent('focus'));
    expect(select).toHaveBeenCalled();
  });
});

describe('OtpInputComponent with a number written by a form', () => {
  it('shows it as text', () => {
    const fixture = TestBed.createComponent(OtpInputComponent);
    fixture.componentRef.setInput('length', 7);
    fixture.detectChanges();
    fixture.componentInstance.writeValue(5551234 as unknown as string);
    fixture.detectChanges();
    const boxes = (fixture.nativeElement as HTMLElement).querySelectorAll('input');
    expect(Array.from(boxes, (b) => b.value).join('')).toBe('5551234');
  });
});
