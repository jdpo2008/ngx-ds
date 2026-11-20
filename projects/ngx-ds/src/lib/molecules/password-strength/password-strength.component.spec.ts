import { TestBed } from '@angular/core/testing';
import { PasswordStrengthComponent } from './password-strength.component';

describe('PasswordStrengthComponent', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(PasswordStrengthComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const meter = el.querySelector('[role="meter"]')!;
    return { fixture, cmp: fixture.componentInstance, el, meter };
  }

  it('scores an empty password as none and hides the label', () => {
    const { cmp, el, meter } = setup();
    expect(cmp.score()).toBe(0);
    expect(cmp.strengthLevel()).toBe('none');
    expect(meter.getAttribute('aria-valuenow')).toBe('0');
    expect(el.querySelector('.psm__label')).toBeNull();
  });

  it('scores a password that meets one of four criteria as weak', () => {
    const { cmp, el } = setup({ password: 'abc' });
    expect(cmp.score()).toBe(1);
    expect(el.querySelector('.psm__label--weak')).not.toBeNull();
  });

  it('scores a password that meets every criterion as strong', () => {
    const { cmp, el, meter } = setup({ password: 'Abcdefg1' });
    expect(cmp.score()).toBe(4);
    expect(meter.getAttribute('aria-valuenow')).toBe('4');
    expect(el.querySelector('.psm__label--strong')).not.toBeNull();
  });

  it('lists requirements and marks the met ones', () => {
    const { el } = setup({ password: 'abc', showRequirements: true, requireSpecial: true });
    const reqs = Array.from(el.querySelectorAll('.psm__req'));
    expect(reqs.length).toBe(5);
    const met = reqs.filter((r) => r.classList.contains('psm__req--met'));
    expect(met.length).toBe(1);
  });

  it('adds a max length criterion when maxLength is set', () => {
    const { cmp } = setup({ password: 'Abcdefg1', maxLength: 6 });
    expect(cmp.requirements().length).toBe(5);
    expect(cmp.score()).toBe(3);
  });
});

describe('PasswordStrengthComponent behaviour', () => {
  function render(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(PasswordStrengthComponent);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, el, meter: el.querySelector('[role="meter"]')! };
  }

  it('announces the strength as text, not only as a number', () => {
    const { el, meter } = render({ password: 'Abcdefg1' });
    expect(meter.getAttribute('aria-valuenow')).toBe('4');
    expect(meter.getAttribute('aria-valuetext')).toBe(
      el.querySelector('.psm__label')!.textContent!.trim(),
    );
    expect(meter.getAttribute('aria-valuetext')).toBeTruthy();
  });

  it('an empty password has a clean label without a dangling separator', () => {
    const { meter } = render({ password: '' });
    expect(meter.getAttribute('aria-label')).not.toMatch(/:\s*$/);
  });

  it('fills as many bars as the score', () => {
    const { el } = render({ password: 'abc' });
    const filled = Array.from(el.querySelectorAll('.psm__bar')).filter(
      (b) => !b.classList.contains('psm__bar--empty'),
    );
    expect(filled.length).toBe(1);
  });

  it('lists only the active requirements and marks the met ones', () => {
    const { el } = render({
      password: 'abc!',
      showRequirements: true,
      requireUppercase: false,
      requireNumbers: false,
      requireSpecial: true,
    });
    const reqs = Array.from(el.querySelectorAll('.psm__req'));
    expect(reqs.length).toBe(3);
    expect(reqs.map((r) => r.classList.contains('psm__req--met'))).toEqual([false, true, true]);
  });
});
