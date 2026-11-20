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
      expect(ctrl.touched).toBe(false);
      hex.dispatchEvent(new Event('blur'));
      expect(ctrl.touched).toBe(true);

      ctrl.disable();
      fixture.detectChanges();
      expect(hex.disabled).toBe(true);
      expect(el.querySelector('.cp--disabled')).not.toBeNull();
    });
  });
});

describe('ColorPickerComponent behaviour', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ColorPickerComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const cmp = fixture.componentInstance;
    const range = (kind: string) => el.querySelector<HTMLInputElement>(`#${cmp.id}-${kind}`)!;
    const hex = el.querySelector<HTMLInputElement>('.cp__hex-input')!;
    const preview = el.querySelector<HTMLElement>('.cp__preview')!;
    const render = () => fixture.detectChanges();
    const fire = (input: HTMLInputElement, value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      render();
    };
    return { fixture, cmp, el, range, hex, preview, render, fire };
  }

  it('the value input sets the sliders, the hex field and the preview', () => {
    const { range, hex, preview } = setup({ value: '#ff0000' });
    expect([range('hue').value, range('sat').value, range('light').value]).toEqual([
      '0',
      '100',
      '50',
    ]);
    expect(hex.value).toBe('#ff0000');
    expect(preview.style.background).toContain('rgb(255, 0, 0)');
  });

  it('changing the value input later moves the sliders', () => {
    const { fixture, range, hex, render } = setup();
    fixture.componentRef.setInput('value', '#00ff00');
    render();
    expect(range('hue').value).toBe('120');
    expect(hex.value).toBe('#00ff00');
  });

  it('a typed hex is kept as typed, not rounded through HSL', () => {
    const { cmp, hex, fire } = setup();
    fire(hex, '#123456');
    expect(cmp.value()).toBe('#123456');
    expect(hex.value).toBe('#123456');
  });

  it('a short or upper-case hex is stored in the long lower-case form', () => {
    const { cmp, hex, fire } = setup();
    fire(hex, '#F00');
    expect(cmp.value()).toBe('#ff0000');
    expect(cmp.hue()).toBe(0);
  });

  it('writeValue accepts a short hex and null falls back to the default', () => {
    const { cmp, render } = setup();
    cmp.writeValue('#0f0');
    render();
    expect(cmp.value()).toBe('#00ff00');
    expect(cmp.hue()).toBe(120);
    cmp.writeValue(null);
    expect(cmp.value()).toBe('#6366f1');
  });

  it('the label names the group and disabled disables every field', () => {
    const { el, cmp, fixture, render } = setup({ label: 'Color de marca' });
    const group = el.querySelector('[role="group"]')!;
    expect(group.getAttribute('aria-labelledby')).toBe(`${cmp.id}-label`);
    expect(el.querySelector(`#${cmp.id}-label`)!.textContent).toBe('Color de marca');
    fixture.componentRef.setInput('disabled', true);
    render();
    expect(Array.from(el.querySelectorAll('input')).every((i) => i.disabled)).toBe(true);
  });

  it('the hex field keeps what is typed and shows the normalized value on blur', () => {
    const { hex, fire, render } = setup();
    fire(hex, '#F00');
    expect(hex.value).toBe('#F00');
    hex.dispatchEvent(new Event('blur'));
    render();
    expect(hex.value).toBe('#ff0000');
  });

  it('an invalid value falls back to the default colour', () => {
    const { fixture, cmp, hex, render } = setup();
    fixture.componentRef.setInput('value', 'red');
    render();
    expect(cmp.hexValue()).toBe('#6366f1');
    expect(hex.value).toBe('#6366f1');
  });

  it('moving the hue at 0 % saturation keeps the hue', () => {
    const { cmp, range, fire } = setup({ value: '#808080' });
    fire(range('hue'), '200');
    expect(cmp.value()).toBe('#808080');
    expect(range('hue').value).toBe('200');
  });
});
