import { TestBed } from '@angular/core/testing';
import { ButtonGroupComponent } from './button-group.component';

describe('ButtonGroupComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ButtonGroupComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('[role="group"]')!;
  }

  it('renders a group without aria-label by default', () => {
    const group = setup();
    expect(group.className).toBe('btn-group');
    expect(group.hasAttribute('aria-label')).toBe(false);
  });

  it('applies aria-label and the full-width modifier', () => {
    const group = setup({ ariaLabel: 'Acciones', fullWidth: true });
    expect(group.getAttribute('aria-label')).toBe('Acciones');
    expect(group.classList).toContain('btn-group--full-width');
  });
});
