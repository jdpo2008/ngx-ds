import { TestBed } from '@angular/core/testing';
import { Check } from 'lucide-angular';
import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('icon', Check);
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
