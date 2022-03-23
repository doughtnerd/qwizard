import { maxLengthValidator } from './maxLengthValidator';
import { minLengthValidator } from './minLengthValidator';
import { notEmptyValidator } from './notEmptyValidator';
import { notNullValidator } from './notNullValidator';
import { regexValidator } from './regexValidator';

export const Validators = {
  notEmpty: notEmptyValidator,
  notNull: notNullValidator,
  minLength(minLength: number) {
    return minLengthValidator(minLength)
  },
  maxLength(maxLength: number) {
    return maxLengthValidator(maxLength)
  },
  regex(regex: RegExp) {
    return regexValidator(regex)
  }
}

export * from './validator.types'
export * from './async-validator.types'
export * from './errors'
export * from './validate'

