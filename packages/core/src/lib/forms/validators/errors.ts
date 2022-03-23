export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }

  public override toString() {
    return this.message
  }
}

export class ValidatorArgumentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidatorError'
  }
}

export type ValidationErrors = { [errorName: string]: ValidationError }

export function isValidationErrors(value: any): value is ValidationErrors {
  const values = Object.values(value)
  return values.every(error => error instanceof ValidationError)
}