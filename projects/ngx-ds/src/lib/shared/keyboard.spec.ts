import { isActivationKey } from './keyboard';

describe('isActivationKey', () => {
  it('accepts Enter and Space', () => {
    expect(isActivationKey(new KeyboardEvent('keydown', { key: 'Enter' }))).toBe(true);
    expect(isActivationKey(new KeyboardEvent('keydown', { key: ' ' }))).toBe(true);
  });

  it('rejects other keys', () => {
    for (const key of ['Escape', 'Tab', 'ArrowDown', 'a']) {
      expect(isActivationKey(new KeyboardEvent('keydown', { key }))).toBe(false);
    }
  });
});
