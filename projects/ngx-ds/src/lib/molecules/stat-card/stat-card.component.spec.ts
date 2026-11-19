import { TestBed } from '@angular/core/testing';
import { Users } from 'lucide-angular';
import { StatCardComponent } from './stat-card.component';

describe('StatCardComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(StatCardComponent);
    fixture.componentRef.setInput('label', 'Usuarios');
    fixture.componentRef.setInput('value', '1.240');
    for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, el, cmp: fixture.componentInstance };
  }

  it('renders label and value without change or icon by default', () => {
    const { el } = setup();
    expect(el.querySelector('.stat__label')?.textContent).toContain('Usuarios');
    expect(el.querySelector('.stat__value')?.textContent).toContain('1.240');
    expect(el.querySelector('.stat__change')).toBeNull();
    expect(el.querySelector('.stat__icon')).toBeNull();
  });

  it('shows a positive increase with screen reader text', () => {
    const { el } = setup({ delta: 12.5, deltaLabel: 'vs. mes anterior' });
    const delta = el.querySelector('.stat__delta')!;
    expect(delta.classList).toContain('stat__delta--positive');
    expect(delta.textContent).toContain('+12.5%');
    expect(delta.querySelector('.stat__sr')?.textContent).toBe('Aumento');
    expect(el.querySelector('.stat__delta-label')?.textContent).toContain('vs. mes anterior');
  });

  it('shows a decrease as negative, or positive with invertTrend', () => {
    const { el, fixture } = setup({ delta: -3 });
    const delta = () => el.querySelector('.stat__delta')!;
    expect(delta().classList).toContain('stat__delta--negative');
    expect(delta().textContent).toContain('−3%');
    expect(delta().querySelector('.stat__sr')?.textContent).toBe('Descenso');

    fixture.componentRef.setInput('invertTrend', true);
    fixture.detectChanges();
    expect(delta().classList).toContain('stat__delta--positive');
  });

  it('treats zero as neutral and rounds to one decimal', () => {
    const { cmp, fixture } = setup({ delta: 0 });
    expect(cmp.sentiment()).toBe('neutral');
    expect(cmp.trendText()).toBe('Sin cambios');
    fixture.componentRef.setInput('delta', 4.04999);
    expect(cmp.deltaText()).toBe('+4%');
  });

  it('renders the icon hidden from assistive technology', () => {
    const { el } = setup({ icon: Users });
    expect(el.querySelector('.stat__icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows placeholders while loading', () => {
    const { el } = setup({ loading: true, delta: 5 });
    expect(el.querySelector('.stat')?.getAttribute('aria-busy')).toBe('true');
    expect(el.querySelectorAll('.stat__skeleton').length).toBe(2);
    expect(el.querySelector('.stat__value')).toBeNull();
    expect(el.querySelector('.stat__delta')).toBeNull();
  });
});
