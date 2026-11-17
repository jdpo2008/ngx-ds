import { InjectionToken, Provider } from '@angular/core';

/**
 * BCP 47 locale used by ngx-ds for month/weekday names and date/number formatting.
 * Defaults to `'es-ES'`. Override it app-wide with {@link provideNgxDsLocale}.
 */
export const NGX_DS_LOCALE = new InjectionToken<string>('NGX_DS_LOCALE', {
  providedIn: 'root',
  factory: () => 'es-ES',
});

/** Sets the locale used by every ngx-ds component, e.g. `provideNgxDsLocale('en-US')`. */
export function provideNgxDsLocale(locale: string): Provider {
  return { provide: NGX_DS_LOCALE, useValue: locale };
}

const capitalize = (s: string, locale: string) =>
  s.charAt(0).toLocaleUpperCase(locale) + s.slice(1);

/** Twelve capitalized month names, January first (`'Enero'`, `'Febrero'`, …). */
export function monthNames(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { month: 'long' });
  return Array.from({ length: 12 }, (_, m) => capitalize(fmt.format(new Date(2024, m, 1)), locale));
}

/** Seven two-letter weekday labels, Sunday first (`'Do'`, `'Lu'`, …). */
export function weekdayNames(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  // 7 Jan 2024 is a Sunday.
  return Array.from({ length: 7 }, (_, d) =>
    capitalize(fmt.format(new Date(2024, 0, 7 + d)).slice(0, 2), locale),
  );
}

/** Full date for screen readers, e.g. `'15 de marzo de 2025'`. */
export function formatDayLabel(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}
