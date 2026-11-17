import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PopoverComponent } from './popover.component';

@Component({
  standalone: true,
  imports: [PopoverComponent],
  template: `
    <ngx-ds-popover
      [(open)]="open"
      [disabled]="disabled()"
      (opened)="openedCount = openedCount + 1"
      (closed)="closedCount = closedCount + 1"
    >
      <span popover-trigger>Abrir</span>
      <p popover-content class="content">Contenido</p>
    </ngx-ds-popover>
    <button type="button" class="outside">fuera</button>
  `,
})
class Host {
  open = signal(false);
  disabled = signal(false);
  openedCount = 0;
  closedCount = 0;
}

describe('PopoverComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const trigger = el.querySelector<HTMLElement>('.popover__trigger')!;
    const host = fixture.componentInstance;
    const click = (target: HTMLElement) => {
      target.click();
      fixture.detectChanges();
    };
    return { fixture, el, trigger, host, click };
  }

  it('toggles the panel on trigger click and emits opened/closed', () => {
    const { el, trigger, host, click } = setup();
    expect(el.querySelector('.content')).toBeNull();
    click(trigger);
    expect(host.open()).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('[role="dialog"] .content')).not.toBeNull();
    click(trigger);
    expect(host.open()).toBe(false);
    expect(host.openedCount).toBe(1);
    expect(host.closedCount).toBe(1);
  });

  it('opens with Enter on the trigger', () => {
    const { fixture, trigger, host } = setup();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(host.open()).toBe(true);
  });

  it('does nothing when disabled', () => {
    const { fixture, trigger, host, click } = setup();
    host.disabled.set(true);
    fixture.detectChanges();
    expect(trigger.getAttribute('tabindex')).toBeNull();
    click(trigger);
    expect(host.open()).toBe(false);
  });

  it('closes with Escape', () => {
    const { fixture, trigger, host, click } = setup();
    click(trigger);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(host.open()).toBe(false);
  });

  it('closes on click outside but not inside the panel', () => {
    const { el, trigger, host, click } = setup();
    click(trigger);
    click(el.querySelector<HTMLElement>('.content')!);
    expect(host.open()).toBe(true);
    click(el.querySelector<HTMLElement>('.outside')!);
    expect(host.open()).toBe(false);
  });
});
