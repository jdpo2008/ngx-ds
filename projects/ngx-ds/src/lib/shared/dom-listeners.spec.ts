import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { setupClickOutside } from './click-outside';
import { setupEscapeClose } from './escape-close';

@Component({
  selector: 'ngx-test-host',
  standalone: true,
  template: '<button id="inside">inside</button>',
})
class HostComponent {
  outside = 0;
  escapes = 0;
  constructor() {
    setupClickOutside(() => this.outside++);
    setupEscapeClose(() => this.escapes++);
  }
}

describe('setupClickOutside / setupEscapeClose', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    return fixture;
  }

  it('fires only for clicks outside the host', () => {
    const fixture = setup();
    (fixture.nativeElement.querySelector('#inside') as HTMLElement).click();
    expect(fixture.componentInstance.outside).toBe(0);
    document.body.click();
    expect(fixture.componentInstance.outside).toBe(1);
  });

  it('fires on Escape but not on other keys', () => {
    const fixture = setup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(fixture.componentInstance.escapes).toBe(1);
  });

  it('removes listeners on destroy', () => {
    const fixture = setup();
    const host = fixture.componentInstance;
    fixture.destroy();
    document.body.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(host.outside).toBe(0);
    expect(host.escapes).toBe(0);
  });
});
