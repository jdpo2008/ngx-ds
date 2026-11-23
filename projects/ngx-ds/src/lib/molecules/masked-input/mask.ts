/**
 * Mask tokens: `9` digit, `a` letter, `A` letter shown in upper case, `*` letter or digit.
 * Any other character in the mask is a literal that is inserted automatically.
 */
const TOKENS: Record<string, RegExp> = {
  '9': /\d/,
  a: /\p{L}/u,
  A: /\p{L}/u,
  '*': /[\p{L}\d]/u,
};

const ACCEPTABLE = /[\p{L}\d]/u;

export function isMaskToken(char: string): boolean {
  return char in TOKENS;
}

export interface MaskResult {
  /** Text shown in the field, literals included. */
  masked: string;
  /** Accepted characters only, without literals. */
  raw: string;
}

/**
 * Keeps the letters and digits a user typed or pasted. The text is read along the mask,
 * so a literal found where the mask puts it, even a digit (`+34 `, `/20`), is skipped
 * instead of being read as input. Literals the text leaves out are not required.
 */
export function extractRaw(text: string, mask: string): string {
  const slots = [...mask];
  let j = 0;
  let raw = '';
  for (const char of text) {
    if (j < slots.length && !isMaskToken(slots[j]) && slots[j] === char) {
      j++;
      continue;
    }
    if (!ACCEPTABLE.test(char)) continue;
    while (j < slots.length && !isMaskToken(slots[j])) j++;
    raw += char;
    j++;
  }
  return raw;
}

/**
 * Fits `raw` into `mask`. Characters that don't match their slot are dropped, and
 * literals are only written when a character follows them, so deleting stays natural.
 */
export function applyMask(raw: string, mask: string): MaskResult {
  const chars = [...raw];
  let masked = '';
  let clean = '';
  let pending = '';
  let i = 0;

  for (const slot of mask) {
    if (i >= chars.length) break;
    const pattern = TOKENS[slot];
    if (!pattern) {
      pending += slot;
      continue;
    }
    while (i < chars.length && !pattern.test(chars[i])) i++;
    if (i >= chars.length) break;
    const char = slot === 'A' ? chars[i].toUpperCase() : chars[i];
    i++;
    masked += pending + char;
    pending = '';
    clean += char;
  }

  return { masked, raw: clean };
}

/** Caret position right after the `count`-th accepted character of `masked`. */
export function caretAfter(masked: string, mask: string, count: number): number {
  if (count <= 0) return 0;
  let seen = 0;
  for (let k = 0; k < masked.length; k++) {
    if (isMaskToken(mask[k]) && ++seen === count) return k + 1;
  }
  return masked.length;
}

/** Number of characters the mask accepts. */
export function tokenCount(mask: string): number {
  return [...mask].filter(isMaskToken).length;
}

/** Placeholder that shows the shape of the mask, e.g. `(___) ___-____`. */
export function maskGuide(mask: string, slotChar = '_'): string {
  return [...mask].map((char) => (isMaskToken(char) ? slotChar : char)).join('');
}
