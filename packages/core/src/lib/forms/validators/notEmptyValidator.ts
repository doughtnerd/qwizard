import { Maybe } from "../../utility-types"
import { AbstractControl } from "../elements"
import { isFormControl } from "../elements/FormControl"
import { ValidationError, ValidationErrors, ValidatorArgumentError } from "./errors"
import { ValidatorFn } from "./validator.types"


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