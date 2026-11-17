import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';
import { TabComponent } from './tab.component';

@Component({
  selector: 'ngx-test-tabs-host',
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: `
    <ngx-ds-tabs [(active)]="active">
      <ngx-ds-tab label="Uno">uno</ngx-ds-tab>
      <ngx-ds-tab label="Dos" [disabled]="true">dos</ngx-ds-tab>
      <ngx-ds-tab label="Tres">tres</ngx-ds-tab>
    </ngx-ds-tabs>
  `,
})
class HostComponent {
  active = 0;
}

describe('TabsComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const tabs = () => Array.from(el.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = () => Array.from(el.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    const key = (key: string) => {
      tabs()[fixture.componentInstance.active].dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true }),
      );
      fixture.detectChanges();
    };
    return { fixture, tabs, panels, key };
  }

  it('wires tab/panel ARIA and shows only the active panel', () => {
    const { tabs, panels } = setup();
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs()[0].getAttribute('aria-controls')).toBe(panels()[0].id);
    expect(panels()[0].getAttribute('aria-labelledby')).toBe(tabs()[0].id);
    expect(panels()[0].hidden).toBe(false);
    expect(panels()[2].hidden).toBe(true);
  });

  it('skips disabled tabs with arrow keys and wraps around', () => {
    const { fixture, key } = setup();
    key('ArrowRight');
    expect(fixture.componentInstance.active).toBe(2);
    key('ArrowRight');
    expect(fixture.componentInstance.active).toBe(0);
    key('ArrowLeft');
    expect(fixture.componentInstance.active).toBe(2);
    key('Home');
    expect(fixture.componentInstance.active).toBe(0);
    key('End');
    expect(fixture.componentInstance.active).toBe(2);
  });

  it('does not activate a disabled tab on click', () => {
    const { fixture, tabs } = setup();
    tabs()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active).toBe(0);
  });
});
