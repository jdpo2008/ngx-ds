import { TestBed } from '@angular/core/testing';
import { CalendarComponent } from '../organisms/calendar/calendar.component';
import { formatDayLabel, monthNames, provideNgxDsLocale, weekdayNames } from './locale';

describe('locale helpers', () => {
  it('builds capitalized Spanish month and weekday names', () => {
    expect(monthNames('es-ES')[0]).toBe('Enero');
    expect(monthNames('es-ES')[8]).toBe('Septiembre');
    expect(weekdayNames('es-ES')).toEqual(['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá']);
  });

  it('builds English names, Sunday first', () => {
    expect(monthNames('en-US')[0]).toBe('January');
    expect(weekdayNames('en-US')).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
  });

  it('formats an accessible day label', () => {
    expect(formatDayLabel(new Date(2025, 2, 15), 'es-ES')).toBe('15 de marzo de 2025');
    expect(formatDayLabel(new Date(2025, 2, 15), 'en-US')).toBe('March 15, 2025');
  });
});

describe('provideNgxDsLocale', () => {
  it('defaults components to es-ES', () => {
    const fixture = TestBed.createComponent(CalendarComponent);
    fixture.componentInstance.value.set(new Date(2025, 2, 15));
    fixture.detectChanges();
    expect(fixture.componentInstance.title()).toBe('Marzo 2025');
    expect(fixture.componentInstance.weekdays[0]).toBe('Lu');
  });

  it('switches components to the provided locale', () => {
    TestBed.configureTestingModule({ providers: [provideNgxDsLocale('en-US')] });
    const fixture = TestBed.createComponent(CalendarComponent);
    fixture.componentInstance.value.set(new Date(2025, 2, 15));
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    expect(cmp.title()).toBe('March 2025');
    expect(cmp.weekdays).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
    expect(cmp.dayLabel(new Date(2025, 2, 15))).toBe('March 15, 2025');
  });
});
