import { FieldErrors, fieldErrorText, fieldHasError } from './field-error';

const errors = [
  { kind: 'required' },
  { kind: 'min', message: 'Too small' },
] as unknown as FieldErrors;

describe('field-error helpers', () => {
  it('hides Signal Forms errors until the field is touched', () => {
    expect(fieldHasError('', errors, false)).toBe(false);
    expect(fieldErrorText('', errors, false)).toBe('');
  });

  it('shows the first error that has a message once touched', () => {
    expect(fieldHasError('', errors, true)).toBe(true);
    expect(fieldErrorText('', errors, true)).toBe('Too small');
  });

  it('gives priority to an explicit errorMessage', () => {
    expect(fieldHasError('Custom', [], false)).toBe(true);
    expect(fieldErrorText('Custom', errors, true)).toBe('Custom');
  });

  it('has no error without errors', () => {
    expect(fieldHasError('', [], true)).toBe(false);
    expect(fieldErrorText('', [], true)).toBe('');
  });
});
