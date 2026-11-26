import { TestBed } from '@angular/core/testing';
import { LucideHome as Home } from '@lucide/angular';
import { NGX_DS_LABELS_EN, provideNgxDsLabels } from '../../shared/labels';
import { BreadcrumbComponent, BreadcrumbItem } from './breadcrumb.component';

const ITEMS: BreadcrumbItem[] = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'Proyectos' },
  { label: 'ngx-ds', href: '/p/ngx-ds' },
  { label: 'Ajustes' },
];

describe('BreadcrumbComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.componentRef.setInput('items', ITEMS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const crumbs = Array.from(el.querySelectorAll<HTMLElement>('.breadcrumb__crumb'));
    return { cmp: fixture.componentInstance, el, crumbs };
  }

  it('renders links, buttons and the current page', () => {
    const { el, crumbs } = setup();
    const nav = el.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Ruta de navegación');
    expect(nav.classList).toContain('breadcrumb--md');
    expect(crumbs.map((c) => c.tagName)).toEqual(['A', 'BUTTON', 'A', 'SPAN']);
    expect(crumbs[0].getAttribute('href')).toBe('/');
    expect(crumbs[0].querySelector('svg')?.getAttribute('width')).toBe('14');
    expect(crumbs[3].getAttribute('aria-current')).toBe('page');
    expect(crumbs[3].textContent?.trim()).toBe('Ajustes');
    expect(el.querySelectorAll('.breadcrumb__separator').length).toBe(3);
  });

  it('emits itemClick for links and buttons', () => {
    const { cmp, crumbs } = setup();
    const spy = vi.fn();
    cmp.itemClick.subscribe(spy);
    crumbs[1].click();
    expect(spy).toHaveBeenCalledWith(ITEMS[1]);
  });

  it('collapses to first + ellipsis + last items when maxItems is set', () => {
    const { cmp, crumbs } = setup({ maxItems: 3 });
    expect(crumbs.map((c) => c.textContent?.trim())).toEqual(['Inicio', '…', 'ngx-ds', 'Ajustes']);
    const spy = vi.fn();
    cmp.itemClick.subscribe(spy);
    crumbs[1].click();
    expect(spy).not.toHaveBeenCalled();
    expect(crumbs[1].classList).toContain('breadcrumb__crumb--ellipsis');
  });

  it('supports a text separator and sized icons', () => {
    const { el, crumbs } = setup({ separator: '/', size: 'lg' });
    const sep = el.querySelector('.breadcrumb__separator')!;
    expect(sep.textContent?.trim()).toBe('/');
    expect(sep.querySelector('svg')).toBeNull();
    expect(crumbs[0].querySelector('svg')?.getAttribute('width')).toBe('16');
  });

  it('uses the English landmark label when provided', () => {
    TestBed.configureTestingModule({ providers: [provideNgxDsLabels(NGX_DS_LABELS_EN)] });
    expect(setup().el.querySelector('nav')?.getAttribute('aria-label')).toBe('Breadcrumb');
  });
});

describe('BreadcrumbComponent behaviour', () => {
  function render(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.componentRef.setInput('items', ITEMS);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      el,
      labels: () =>
        Array.from(el.querySelectorAll('.breadcrumb__crumb')).map((c) => c.textContent?.trim()),
    };
  }

  it('maxItems 1 still marks the real current page, not the ellipsis', () => {
    const { el, labels } = render({ maxItems: 1 });
    expect(labels()).toEqual(['…', 'Ajustes']);
    expect(el.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('Ajustes');
  });

  it('maxItems 2 keeps the first and the current page', () => {
    expect(render({ maxItems: 2 }).labels()).toEqual(['Inicio', '…', 'Ajustes']);
  });

  it('a string separator is drawn between crumbs but not after the last', () => {
    const { el } = render({ separator: '/' });
    const seps = Array.from(el.querySelectorAll('.breadcrumb__separator'));
    expect(seps.length).toBe(ITEMS.length - 1);
    expect(seps.every((s) => s.textContent?.trim() === '/')).toBe(true);
  });

  it('a disabled item does not emit itemClick', () => {
    const { fixture, el } = render({
      items: [{ label: 'A' }, { label: 'B', disabled: true }, { label: 'C' }],
    });
    const spy = vi.fn();
    fixture.componentInstance.itemClick.subscribe(spy);
    el.querySelectorAll<HTMLElement>('.breadcrumb__crumb').forEach((c) => c.click());
    expect(spy.mock.calls.map((c) => c[0].label)).toEqual(['A']);
  });
});
