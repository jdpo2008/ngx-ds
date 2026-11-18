import { ApplicationInitStatus, DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NGX_DS_LABELS, NGX_DS_LABELS_EN, NGX_DS_LABELS_ES } from './labels';
import { NGX_DS_LOCALE } from './locale';
import { NgxDsConfig, provideNgxDs } from './provide';

async function setup(config?: NgxDsConfig) {
  TestBed.configureTestingModule({ providers: [provideNgxDs(config)] });
  await TestBed.inject(ApplicationInitStatus).donePromise;
  return {
    locale: TestBed.inject(NGX_DS_LOCALE),
    labels: TestBed.inject(NGX_DS_LABELS),
    html: TestBed.inject(DOCUMENT).documentElement,
  };
}

function mockColorScheme(dark: boolean) {
  const listeners = new Set<() => void>();
  const query = {
    matches: dark,
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
  };
  window.matchMedia = () => query as unknown as MediaQueryList;
  return {
    listeners,
    set(value: boolean) {
      query.matches = value;
      listeners.forEach((fn) => fn());
    },
  };
}

describe('provideNgxDs', () => {
  const matchMedia = window.matchMedia;

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    window.matchMedia = matchMedia;
  });

  it('keeps the defaults when called without options', async () => {
    const { locale, labels, html } = await setup();
    expect(locale).toBe('es-ES');
    expect(labels).toBe(NGX_DS_LABELS_ES);
    expect(html.hasAttribute('data-theme')).toBe(false);
  });

  it('sets the locale and picks English labels for an en-* locale', async () => {
    const { locale, labels } = await setup({ locale: 'en-US' });
    expect(locale).toBe('en-US');
    expect(labels).toEqual(NGX_DS_LABELS_EN);
  });

  it('keeps Spanish labels for other locales', async () => {
    const { labels } = await setup({ locale: 'es-MX' });
    expect(labels).toEqual(NGX_DS_LABELS_ES);
  });

  it('merges label overrides over the locale set', async () => {
    const { labels } = await setup({ locale: 'en-GB', labels: { close: 'Dismiss' } });
    expect(labels.close).toBe('Dismiss');
    expect(labels.cancel).toBe(NGX_DS_LABELS_EN.cancel);
  });

  it('merges label overrides over Spanish without a locale', async () => {
    const { locale, labels } = await setup({ labels: { close: 'Fermer' } });
    expect(locale).toBe('es-ES');
    expect(labels.close).toBe('Fermer');
    expect(labels.cancel).toBe(NGX_DS_LABELS_ES.cancel);
  });

  it('sets a fixed theme on <html>', async () => {
    const { html } = await setup({ theme: 'dark' });
    expect(html.getAttribute('data-theme')).toBe('dark');
  });

  it('follows the system theme and stops on destroy', async () => {
    const scheme = mockColorScheme(true);
    const { html } = await setup({ theme: 'system' });
    expect(html.getAttribute('data-theme')).toBe('dark');

    scheme.set(false);
    expect(html.getAttribute('data-theme')).toBe('light');

    TestBed.resetTestingModule();
    expect(scheme.listeners.size).toBe(0);
  });

  it('leaves the theme alone for system when matchMedia is missing', async () => {
    window.matchMedia = undefined as unknown as typeof window.matchMedia;
    const { html } = await setup({ theme: 'system' });
    expect(html.hasAttribute('data-theme')).toBe(false);
  });
});
