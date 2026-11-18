import {
  applyPrimaryColor,
  contrastRatio,
  createPrimaryPalette,
  parseHex,
  primaryPaletteCss,
} from './theme-colors';

/** Largest per-channel difference between two hex colours, 0–255. */
function distance(a: string, b: string): number {
  const [x, y] = [parseHex(a)!, parseHex(b)!];
  return Math.max(...x.map((v, i) => Math.abs(v - y[i]) * 255));
}

// Default indigo tokens (_tokens.scss and _themes.scss).
const INDIGO_LIGHT = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
};
const INDIGO_DARK = {
  50: '#1e1b4b',
  100: '#312e81',
  200: '#3730a3',
  500: '#818cf8',
  600: '#6366f1',
  700: '#a5b4fc',
};

describe('theme-colors', () => {
  it('parses #rgb and #rrggbb and rejects anything else', () => {
    expect(parseHex('#fff')).toEqual([1, 1, 1]);
    expect(parseHex('#000000')).toEqual([0, 0, 0]);
    expect(parseHex('rgb(0,0,0)')).toBeNull();
    expect(parseHex('#12345')).toBeNull();
  });

  it('keeps the brand colour as step 600', () => {
    expect(createPrimaryPalette('#0D9488').light[600]).toBe('#0d9488');
    expect(createPrimaryPalette('#f00').light[600]).toBe('#ff0000');
  });

  it('reproduces the default indigo scale from #4f46e5', () => {
    const { light, dark } = createPrimaryPalette('#4f46e5');
    for (const [step, hex] of Object.entries(INDIGO_LIGHT)) {
      expect(distance(light[+step as keyof typeof light], hex), `light ${step}`).toBeLessThan(14);
    }
    for (const [step, hex] of Object.entries(INDIGO_DARK)) {
      expect(distance(dark[+step as keyof typeof dark]!, hex), `dark ${step}`).toBeLessThan(14);
    }
  });

  it('goes from light to dark in order', () => {
    const lum = (hex: string) => contrastRatio(hex, '#000000');
    const { light } = createPrimaryPalette('#0d9488');
    const steps = Object.values(light).map(lum);
    expect([...steps].sort((a, b) => b - a)).toEqual(steps);
  });

  it('throws on an invalid colour', () => {
    expect(() => createPrimaryPalette('teal')).toThrow(/invalid primary colour/);
  });

  it('computes WCAG contrast', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#4f46e5', '#ffffff')).toBeGreaterThan(4.5);
  });

  it('writes light and dark rules', () => {
    const css = primaryPaletteCss(createPrimaryPalette('#0d9488'));
    expect(css).toContain(':root{--primary-50:');
    expect(css).toContain('--primary-600:#0d9488;');
    expect(css).toContain(":root[data-theme='dark'],.dark{");
  });

  describe('applyPrimaryColor', () => {
    afterEach(() => applyPrimaryColor(null));

    it('adds one style element, replaces it, and removes it with null', () => {
      applyPrimaryColor('#0d9488');
      applyPrimaryColor('#e11d48');
      const styles = document.querySelectorAll('#ngx-ds-primary');
      expect(styles.length).toBe(1);
      expect(styles[0].textContent).toContain('--primary-600:#e11d48;');

      applyPrimaryColor(null);
      expect(document.getElementById('ngx-ds-primary')).toBeNull();
    });

    it('overrides the --primary-* custom properties', () => {
      applyPrimaryColor('#0d9488');
      const value = getComputedStyle(document.documentElement).getPropertyValue('--primary-600');
      expect(value.trim()).toBe('#0d9488');
    });
  });
});
