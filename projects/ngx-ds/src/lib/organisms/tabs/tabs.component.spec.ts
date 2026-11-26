import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LucideStar as Star } from '@lucide/angular';
import { IconInput } from '../../atoms/icon/icon.types';
import { TabsComponent, TabsSize, TabsVariant } from './tabs.component';
import { TabContentDirective } from './tab-content.directive';
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

describe('TabsComponent behaviour', () => {
  @Component({
    selector: 'ngx-test-tabs-config',
    standalone: true,
    imports: [TabsComponent, TabComponent, TabContentDirective],
    template: `
      <ngx-ds-tabs [(active)]="active" [variant]="variant" [size]="size" [fullWidth]="fullWidth">
        <ngx-ds-tab label="Uno" [disabled]="firstDisabled" [icon]="icon">uno</ngx-ds-tab>
        <ngx-ds-tab label="Lazy" [lazy]="true">
          <ng-template ngxDsTabContent><span class="lazy-body">lazy</span></ng-template>
        </ngx-ds-tab>
        <ngx-ds-tab label="Plantilla">
          <ng-template ngxDsTabContent><span class="tpl-body">tpl</span></ng-template>
        </ngx-ds-tab>
        <ngx-ds-tab label="Lazy sin plantilla" [lazy]="true">
          <span class="plain-body">plain</span>
        </ngx-ds-tab>
        @if (withFifth) {
          <ngx-ds-tab label="Quinta">quinta</ngx-ds-tab>
        }
      </ngx-ds-tabs>
    `,
  })
  class ConfigHost {
    active = 0;
    variant: TabsVariant = 'line';
    size: TabsSize = 'md';
    fullWidth = false;
    firstDisabled = false;
    icon: IconInput | undefined = undefined;
    withFifth = false;
  }

  function setup(init: Partial<ConfigHost> = {}) {
    const fixture = TestBed.createComponent(ConfigHost);
    Object.assign(fixture.componentInstance, init);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const host = fixture.componentInstance;
    const tabs = () => Array.from(el.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = () => Array.from(el.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    const visible = () => panels().filter((p) => !p.hidden);
    const render = () => fixture.detectChanges();
    return { fixture, host, el, tabs, panels, visible, render };
  }

  it('a click selects the tab and updates [(active)]', () => {
    const { host, tabs, visible, render } = setup();
    tabs()[2].click();
    render();
    expect(host.active).toBe(2);
    expect(tabs()[2].getAttribute('aria-selected')).toBe('true');
    expect(tabs()[2].getAttribute('tabindex')).toBe('0');
    expect(tabs()[0].getAttribute('tabindex')).toBe('-1');
    expect(visible().length).toBe(1);
    expect(visible()[0].textContent).toContain('tpl');
  });

  it('a lazy tab renders its template on first activation and keeps it', () => {
    const { el, tabs, render } = setup();
    expect(el.querySelector('.lazy-body')).toBeNull();
    tabs()[1].click();
    render();
    expect(el.querySelector('.lazy-body')).not.toBeNull();
    tabs()[0].click();
    render();
    expect(el.querySelector('.lazy-body')).not.toBeNull();
  });

  it('a non-lazy tab with a template renders it right away', () => {
    const { el } = setup();
    expect(el.querySelector('.tpl-body')).not.toBeNull();
  });

  it('a lazy tab without a template shows its projected content', () => {
    const { tabs, visible, render } = setup();
    tabs()[3].click();
    render();
    expect(visible()[0].querySelector('.plain-body')).not.toBeNull();
  });

  it('an active index on a disabled tab falls back to the first enabled one', () => {
    const { tabs, visible } = setup({ firstDisabled: true });
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs()[1].getAttribute('tabindex')).toBe('0');
    expect(visible().length).toBe(1);
    expect(visible()[0].id).toBe(tabs()[1].getAttribute('aria-controls'));
  });

  it('an active index past the last tab falls back to the first enabled one', () => {
    const { fixture, host, tabs, visible, render } = setup({ withFifth: true, active: 4 });
    expect(tabs()[4].getAttribute('aria-selected')).toBe('true');
    host.withFifth = false;
    // Zoneless: a plain field change doesn't mark the host view dirty.
    fixture.componentRef.changeDetectorRef.markForCheck();
    render();
    expect(tabs().length).toBe(4);
    expect(tabs()[0].getAttribute('tabindex')).toBe('0');
    expect(visible().length).toBe(1);
  });

  it('arrow keys from a fallback tab move from it', () => {
    const { host, tabs, render } = setup({ firstDisabled: true });
    tabs()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    render();
    expect(host.active).toBe(2);
    expect(document.activeElement).toBe(tabs()[2]);
  });

  it('other keys are left alone', () => {
    const { host, tabs } = setup();
    const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true });
    tabs()[0].dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(host.active).toBe(0);
  });

  it('variant, size and fullWidth set the nav classes', () => {
    const { el } = setup({ variant: 'pill', size: 'lg', fullWidth: true });
    const nav = el.querySelector('[role="tablist"]')!;
    expect(nav.className).toContain('tabs__nav--pill');
    expect(nav.className).toContain('tabs__nav--lg');
    expect(nav.className).toContain('tabs__nav--full');
  });

  it('renders the tab icon', () => {
    const { tabs } = setup({ icon: Star });
    expect(tabs()[0].querySelector('ngx-ds-icon')).not.toBeNull();
    expect(tabs()[1].querySelector('ngx-ds-icon')).toBeNull();
  });
});
