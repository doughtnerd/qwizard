import { Maybe } from "../../utility-types"
import { FormControl, isFormControl } from "../elements/FormControl"
import { ValidationError, ValidationErrors, ValidatorArgumentError } from "./errors"
import { ValidatorFn } from "./validator.types"

/**
 * Validates whether or not the value of a FormControl is null.
 * 
 * @param input The control to validate
 * @returns ValidationErrors if the input is null, otherwise nothing (undefined).
 */
export const notNullValidator: ValidatorFn = (input: FormControl): Maybe<ValidationErrors> => {
  if (!isFormControl(input)) {
    throw new ValidatorArgumentError('notNull: input is not a FormControl')
  }

  const isValid = input.control.value !== null

  if(!isValid) {
    return {notNull: new ValidationError(`Input value cannot be null`)}
  }

  return
}