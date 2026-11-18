// Runtime primary colour: builds the --primary-* scale from one brand colour.
//
// The scale is computed in OKLCH. The brand colour is step 600 (the one behind
// --fill-primary) and the other steps keep the lightness/chroma ladder of the
// default indigo palette, so a brand colour of #4f46e5 reproduces the defaults.

/** Steps of `--primary-*` the components read, in the light and in the dark theme. */
export const PRIMARY_STEPS = [50, 100, 200, 300, 400, 500, 600, 700] as const;
export type PrimaryStep = (typeof PRIMARY_STEPS)[number];

/** `--primary-*` values as hex colours, for the light and the dark theme. */
export interface PrimaryPalette {
  light: Record<PrimaryStep, string>;
  /** Only the steps the dark theme overrides (the rest are shared with light). */
  dark: Partial<Record<PrimaryStep, string>>;
}

type Lch = [l: number, c: number, h: number];

// Lightness and chroma of each step of the reference ladder (Tailwind indigo in
// OKLCH), relative to step 600: lighter steps as a share of the way to white,
// darker ones as a share of the lightness of 600.
const L600 = 0.511;
const C600 = 0.262;
const LADDER: Record<number, [l: number, c: number]> = {
  50: [0.962, 0.018],
  100: [0.93, 0.034],
  200: [0.87, 0.065],
  300: [0.785, 0.115],
  400: [0.673, 0.182],
  500: [0.585, 0.233],
  600: [L600, C600],
  700: [0.457, 0.24],
  800: [0.398, 0.195],
  900: [0.359, 0.144],
  950: [0.257, 0.09],
};

// The dark theme uses deep shades for the soft backgrounds (50–200) and lighter
// ones for the accents (500–700), same as _themes.scss.
const DARK_MAP: Partial<Record<PrimaryStep, number>> = {
  50: 950,
  100: 900,
  200: 800,
  500: 400,
  600: 500,
  700: 300,
};

/** Parses `#rgb` or `#rrggbb`. Returns `null` for anything else. */
export function parseHex(color: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return null;
  const hex = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function rgbToOklch([r, g, b]: [number, number, number]): Lch {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(a, bb), (Math.atan2(bb, a) * 180) / Math.PI];
}

/** Linear sRGB of an OKLCH colour; may fall outside [0, 1]. */
function oklchToLinear([L, C, H]: Lch): [number, number, number] {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb: number[]) => rgb.every((c) => c >= -1e-4 && c <= 1 + 1e-4);

/** Hex of an OKLCH colour, lowering the chroma until it fits in sRGB. */
function oklchToHex([L, C, H]: Lch): string {
  let lo = 0;
  let hi = C;
  if (!inGamut(oklchToLinear([L, C, H]))) {
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinear([L, mid, H]))) lo = mid;
      else hi = mid;
    }
    C = lo;
  }
  return (
    '#' +
    oklchToLinear([L, C, H])
      .map((c) => Math.round(Math.min(1, Math.max(0, fromLinear(c))) * 255))
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('')
  );
}

/** WCAG 2 contrast ratio between two hex colours. */
export function contrastRatio(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = (parseHex(hex) ?? [0, 0, 0]).map(toLinear);
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/**
 * Builds the `--primary-*` scale from a brand colour (`#rgb` / `#rrggbb`), which
 * becomes step 600 in the light theme. Throws on an invalid colour.
 */
export function createPrimaryPalette(color: string): PrimaryPalette {
  const rgb = parseHex(color);
  if (!rgb) throw new Error(`ngx-ds: invalid primary colour "${color}", use #rgb or #rrggbb.`);
  const [l, c, h] = rgbToOklch(rgb);
  const exact =
    '#' +
    rgb
      .map((v) =>
        Math.round(v * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('');

  const step = (n: number): string => {
    if (n === 600) return exact;
    const [refL, refC] = LADDER[n];
    const L = refL > L600 ? l + ((refL - L600) / (1 - L600)) * (1 - l) : (refL / L600) * l;
    return oklchToHex([L, (refC / C600) * c, h]);
  };

  const light = Object.fromEntries(PRIMARY_STEPS.map((n) => [n, step(n)])) as Record<
    PrimaryStep,
    string
  >;
  const dark = Object.fromEntries(
    Object.entries(DARK_MAP).map(([n, ref]) => [n, step(ref!)]),
  ) as PrimaryPalette['dark'];
  return { light, dark };
}

/** CSS that sets the palette on `:root`, with the dark overrides for `data-theme="dark"` / `.dark`. */
export function primaryPaletteCss({ light, dark }: PrimaryPalette): string {
  const decls = (steps: Partial<Record<PrimaryStep, string>>) =>
    Object.entries(steps)
      .map(([n, hex]) => `--primary-${n}:${hex};`)
      .join('');
  return `:root{${decls(light)}}:root[data-theme='dark'],.dark{${decls(dark)}}`;
}

const STYLE_ID = 'ngx-ds-primary';

/**
 * Applies a brand colour as the primary colour of every ngx-ds component, at runtime.
 * Call it again to change it, or with `null` to go back to the default indigo.
 *
 * The styles are not in a cascade layer, so they win over the tokens in `ngx-ds.scss`.
 */
export function applyPrimaryColor(color: string | null, doc: Document = document): void {
  doc.getElementById(STYLE_ID)?.remove();
  if (color === null) return;
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = primaryPaletteCss(createPrimaryPalette(color));
  doc.head.appendChild(style);
}
