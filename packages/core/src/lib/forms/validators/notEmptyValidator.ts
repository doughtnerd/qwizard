import { Maybe } from "../../utility-types"
import { AbstractControl } from "../elements"
import { isFormControl } from "../elements/FormControl"
import { ValidationError, ValidationErrors, ValidatorArgumentError } from "./errors"
import { ValidatorFn } from "./validator.types"


/**
 * Validates whether or not the value of a FormControl is an empty string.
 * 
 * @param input The control to validate
 * @returns ValidationErrors if the input is an empty string, otherwise nothing (undefined).
 */
export const notEmptyValidator: ValidatorFn = (input: AbstractControl): Maybe<ValidationErrors> => {
  if (!isFormControl(input)) {
    throw new ValidatorArgumentError('notEmpty: input is not a FormControl')
  }

  const isValid = input.control.value !== ''

  if(!isValid) {
    return {notEmpty: new ValidationError(`Input value cannot be empty`)}
  }

  return
}