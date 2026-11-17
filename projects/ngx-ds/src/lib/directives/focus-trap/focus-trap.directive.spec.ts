import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FocusTrapDirective } from './focus-trap.directive';

@Component({
  standalone: true,
  imports: [FocusTrapDirective],
  template: `
    <button id="outside">Fuera</button>
    @if (open()) {
      <div ngxFocusTrap tabindex="-1" id="trap">
        @if (withButtons()) {
          <button id="first">Primero</button>
          <button id="disabled" disabled>Deshabilitado</button>
          @if (withAutofocus()) {
            <!-- eslint-disable-next-line @angular-eslint/template/no-autofocus -->
            <input id="auto" autofocus />
          }
          <a id="last" href="#">Último</a>
        }
      </div>
    }
  `,
})
class HostComponent {
  readonly open = signal(false);
  readonly withButtons = signal(true);
  readonly withAutofocus = signal(false);
}

describe('FocusTrapDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const active = () => document.activeElement as HTMLElement;

  const pressTab = (shiftKey = false) => {
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey,
      bubbles: true,
      cancelable: true,
    });
    active().dispatchEvent(event);
    return event;
  };

  const openTrap = () => {
    host.open.set(true);
    fixture.detectChanges();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    el('outside').focus();
  });

  afterEach(() => {
    fixture.destroy();
    fixture.nativeElement.remove();
  });

  describe('initial focus', () => {
    it('focuses the first focusable element', () => {
      openTrap();
      expect(active().id).toBe('first');
    });

    it('prefers an [autofocus] element', () => {
      host.withAutofocus.set(true);
      openTrap();
      expect(active().id).toBe('auto');
    });

    it('focuses the host when there is nothing focusable', () => {
      host.withButtons.set(false);
      openTrap();
      expect(active().id).toBe('trap');
    });
  });

  describe('Tab cycling', () => {
    beforeEach(() => openTrap());

    it('wraps from the last element to the first', () => {
      el('last').focus();
      const event = pressTab();
      expect(event.defaultPrevented).toBe(true);
      expect(active().id).toBe('first');
    });

    it('wraps from the first element to the last with Shift+Tab', () => {
      const event = pressTab(true);
      expect(event.defaultPrevented).toBe(true);
      expect(active().id).toBe('last');
    });

    it('lets the browser handle Tab between inner elements', () => {
      const event = pressTab();
      expect(event.defaultPrevented).toBe(false);
      expect(active().id).toBe('first');
    });

    it('ignores keys other than Tab', () => {
      el('last').focus();
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      el('last').dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
      expect(active().id).toBe('last');
    });

    it('skips disabled elements when wrapping', () => {
      el('last').focus();
      pressTab();
      pressTab(true);
      expect(active().id).toBe('last');
    });
  });

  it('wraps from the host to the last element with Shift+Tab', () => {
    openTrap();
    el('trap').focus();
    pressTab(true);
    expect(active().id).toBe('last');
  });

  it('keeps focus on the host when there is nothing focusable', () => {
    host.withButtons.set(false);
    openTrap();
    const event = pressTab();
    expect(event.defaultPrevented).toBe(true);
    expect(active().id).toBe('trap');
  });

  it('picks up elements added after init', () => {
    openTrap();
    host.withAutofocus.set(true);
    fixture.detectChanges();
    el('last').focus();
    pressTab();
    expect(active().id).toBe('first');
    pressTab(true);
    expect(active().id).toBe('last');
  });

  describe('restore focus', () => {
    it('returns focus to the previously focused element on destroy', () => {
      openTrap();
      expect(active().id).toBe('first');
      host.open.set(false);
      fixture.detectChanges();
      expect(active().id).toBe('outside');
    });

    it('does not throw when the previous element was removed', () => {
      openTrap();
      el('outside').remove();
      host.open.set(false);
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });
});
