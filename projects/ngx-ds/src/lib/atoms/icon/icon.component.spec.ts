import { TestBed } from '@angular/core/testing';
import { LucideCheck } from '@lucide/angular';
import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('icon', LucideCheck);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('svg')!;
  }

  it('renders the svg at the default size', () => {
    const svg = setup();
    expect(svg).not.toBeNull();
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
  });

  it('applies size, color and stroke width', () => {
    const svg = setup({ size: 16, color: 'red', strokeWidth: 3 });
    expect(svg.getAttribute('width')).toBe('16');
    expect(svg.getAttribute('stroke')).toBe('red');
    expect(svg.getAttribute('stroke-width')).toBe('3');
  });
});

describe('IconComponent icon shapes', () => {
  function render(icon: unknown) {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('icon', icon);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('svg')!;
  }

  it('accepts an @lucide/angular icon component', () => {
    expect(render(LucideCheck).querySelector('path')).not.toBeNull();
  });

  it('accepts the icon data object', () => {
    expect(render(LucideCheck.icon).querySelector('path')).not.toBeNull();
  });

  it('accepts a lucide-angular icon array (deprecated)', () => {
    const svg = render([['circle', { cx: 12, cy: 12, r: 4 }]]);
    expect(svg.querySelector('circle')?.getAttribute('r')).toBe('4');
  });
});

describe('IconComponent accessibility', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('icon', LucideCheck);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('is decorative by default', () => {
    const host = setup();
    expect(host.getAttribute('role')).toBeNull();
    expect(host.getAttribute('aria-label')).toBeNull();
    expect(host.getAttribute('aria-hidden')).toBe('true');
  });

  it('a label turns it into a named image', () => {
    const host = setup({ label: 'Completado' });
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toBe('Completado');
    expect(host.getAttribute('aria-hidden')).toBeNull();
  });
});
