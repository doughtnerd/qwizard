
/**
 * Used in validator functions to indicate the error that occurred during validation for the control.
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }

  public override toString() {
    return this.message
  }
}

/**
 * Used in validator functions to indicate that the validator is not applicable to the control it's being used on.
 */
export class ValidatorArgumentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidatorError'
  }
}

/**
 * The return value of a validator function. If the validator function returns a non-null value, the control will be marked as invalid.
 * The name of the error is the key, and the value contains the error message.
 */
export type ValidationErrors = { [errorName: string]: ValidationError }

/**
 * Type predicate that checks whether or not the given value is a ValidationErrors object.
 * 
 * @param value the value to check
 * @returns Whether or not the value is a ValidationErrors object.
 * 
 * @see {@link "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates" Type Predicates}
 */
export function isValidationErrors(value: any): value is ValidationErrors {
  const values = Object.values(value)
  return values.every(error => error instanceof ValidationError)
}