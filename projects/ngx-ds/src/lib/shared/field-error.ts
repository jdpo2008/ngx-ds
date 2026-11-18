import type { ValidationError } from '@angular/forms/signals';

/** Errors that Signal Forms' `[formField]` passes to a control's `errors` input. */
export type FieldErrors = readonly ValidationError.WithOptionalFieldTree[];

/**
 * Whether a control shows its error state: always with an explicit `errorMessage`,
 * and for Signal Forms errors only once the field is touched.
 */
export function fieldHasError(explicit: string, errors: FieldErrors, touched: boolean): boolean {
  return explicit.length > 0 || (touched && errors.length > 0);
}

/**
 * The message to show under a control: the explicit `errorMessage` wins; otherwise the
 * first Signal Forms error that has a `message`, once the field is touched.
 */
export function fieldErrorText(explicit: string, errors: FieldErrors, touched: boolean): string {
  if (explicit) return explicit;
  if (!touched) return '';
  return errors.find((e) => e.message)?.message ?? '';
}
