import {
  DOCUMENT,
  DestroyRef,
  EnvironmentProviders,
  Provider,
  inject,
  isDevMode,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { NGX_DS_LABELS_EN, NGX_DS_LABELS_ES, NgxDsLabels, provideNgxDsLabels } from './labels';
import { provideNgxDsLocale } from './locale';
import { applyPrimaryColor, contrastRatio, createPrimaryPalette } from './theme-colors';

/** `'system'` follows the OS setting (`prefers-color-scheme`) and updates when it changes. */
export type NgxDsTheme = 'light' | 'dark' | 'system';

export interface NgxDsConfig {
  /** BCP 47 locale for dates and numbers. Default `'es-ES'`. */
  locale?: string;
  /**
   * Label overrides. Keys you omit come from the English set when `locale` starts
   * with `en`, and from the Spanish set otherwise.
   */
  labels?: Partial<NgxDsLabels>;
  /** Sets `data-theme` on `<html>`. Omit it to manage the theme yourself. */
  theme?: NgxDsTheme;
  /**
   * Brand colours. `primary` (`#rgb` / `#rrggbb`) replaces the default indigo: it becomes
   * `--primary-600` and the rest of the `--primary-*` scale is generated from it, for the
   * light and the dark theme. Change it later with `applyPrimaryColor()`.
   */
  colors?: { primary?: string };
}

/**
 * Configures ngx-ds in one call:
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideNgxDs({ locale: 'en-US', theme: 'system', colors: { primary: '#0d9488' } }),
 *   ],
 * });
 * ```
 */
export function provideNgxDs(config: NgxDsConfig = {}): EnvironmentProviders {
  const { locale, labels, theme, colors } = config;
  const providers: (Provider | EnvironmentProviders)[] = [];

  if (locale) providers.push(provideNgxDsLocale(locale));
  if (locale || labels) {
    const base = locale?.toLowerCase().startsWith('en') ? NGX_DS_LABELS_EN : NGX_DS_LABELS_ES;
    providers.push(provideNgxDsLabels(labels ?? {}, base));
  }
  if (theme) providers.push(provideAppInitializer(() => applyTheme(theme)));
  const primary = colors?.primary;
  if (primary) providers.push(provideAppInitializer(() => applyPrimary(primary)));

  return makeEnvironmentProviders(providers);
}

function applyTheme(theme: NgxDsTheme): void {
  const doc = inject(DOCUMENT);
  const root = doc.documentElement;
  if (theme !== 'system') {
    root.setAttribute('data-theme', theme);
    return;
  }

  // matchMedia is missing during SSR; the browser applies the theme on hydration.
  const query = doc.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
  if (!query) return;
  const sync = () => root.setAttribute('data-theme', query.matches ? 'dark' : 'light');
  sync();
  query.addEventListener('change', sync);
  inject(DestroyRef).onDestroy(() => query.removeEventListener('change', sync));
}

function applyPrimary(color: string): void {
  applyPrimaryColor(color, inject(DOCUMENT));
  if (!isDevMode()) return;
  const fill = createPrimaryPalette(color).light[600];
  const ratio = contrastRatio(fill, '#ffffff');
  if (ratio < 4.5) {
    console.warn(
      `ngx-ds: white text on the primary colour ${fill} has a contrast of ${ratio.toFixed(2)}:1, ` +
        'below the 4.5:1 WCAG AA minimum. Use a darker colour.',
    );
  }
}
