import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(ColorPickerComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const cmp = fixture.componentInstance;
    const range = (kind: string) => el.querySelector<HTMLInputElement>(`#${cmp.id}-${kind}`)!;
    const hex = el.querySelector<HTMLInputElement>('.cp__hex-input')!;
    const fire = (input: HTMLInputElement, value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    return { cmp, range, hex, fire };
  }

  it('updates HSL and value from a valid hex', () => {
    const { cmp, range, hex, fire } = setup();
    fire(hex, '#ff0000');
    expect(cmp.value()).toBe('#ff0000');
    expect(cmp.hue()).toBe(0);
    expect(cmp.saturation()).toBe(100);
    expect(cmp.lightness()).toBe(50);
    expect(range('light').value).toBe('50');
  });

  it('keeps the value while the hex is incomplete', () => {
    const { cmp, hex, fire } = setup();
    const before = cmp.value();
    fire(hex, '#ff');
    expect(cmp.value()).toBe(before);
    expect(cmp.hexInput()).toBe('#ff');
  });

  it('recomputes the hex when a slider moves', () => {
    const { cmp, range, hex, fire } = setup();
    fire(hex, '#ff0000');
    fire(range('hue'), '120');
    expect(cmp.value()).toBe('#00ff00');
    expect(hex.value).toBe('#00ff00');
  });

  describe('with reactive forms', () => {
    @Component({
      standalone: true,
      imports: [ColorPickerComponent, ReactiveFormsModule],
      template: `<ngx-ds-color-picker [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl('#0000ff');
    }

    it('syncs value, touched and disabled state', () => {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      const ctrl = fixture.componentInstance.ctrl;
      const el = fixture.nativeElement as HTMLElement;
      const hex = el.querySelector<HTMLInputElement>('.cp__hex-input')!;
      expect(hex.value).toBe('#0000ff');

      hex.value = '#ffffff';
      hex.dispatchEvent(new Event('input'));
      expect(ctrl.value).toBe('#ffffff');
      expect(ctrl.touched).toBe(true);

      ctrl.disable();
      fixture.detectChanges();
      expect(hex.disabled).toBe(true);
      expect(el.querySelector('.cp--disabled')).not.toBeNull();
    });
  });
});
