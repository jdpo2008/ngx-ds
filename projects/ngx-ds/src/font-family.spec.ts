import { Type } from '@angular/core';
import * as api from './public-api';

// Every public component sets the library font in its own styles, so it renders in Poppins
// (or --ngx-primary-font-family) even inside an app whose body uses another font. 1.2.1 fixed
// twelve components that had none; this keeps new ones from shipping without it.
//
// Most set it on :host. Some set it on their root element instead (a <button> does not
// inherit the font), so any rule of the component counts.

/** Wrappers that render only projected content, which inherits the font of their parent. */
const EXEMPT = new Set(['IconComponent', 'StepComponent', 'TabComponent']);

const LIBRARY_FONT = /font-family\s*:\s*var\(\s*--ngx-primary-font-family\b/;

const components = Object.entries(api)
  .filter(([, value]) => typeof value === 'function' && 'ɵcmp' in value)
  .map(
    ([name, value]) =>
      [name, (value as Type<unknown> & { ɵcmp: { styles: string[] } }).ɵcmp.styles] as const,
  );

describe('component font-family', () => {
  it('finds the public components', () => {
    expect(components.length).toBeGreaterThan(50);
  });

  it.each(components.filter(([name]) => !EXEMPT.has(name)))(
    '%s sets the library font',
    (_name, styles) => {
      expect(styles.join('\n')).toMatch(LIBRARY_FONT);
    },
  );

  it('exempt names are still public components', () => {
    const names = new Set(components.map(([name]) => name));
    for (const name of EXEMPT) expect(names.has(name)).toBe(true);
  });
});
