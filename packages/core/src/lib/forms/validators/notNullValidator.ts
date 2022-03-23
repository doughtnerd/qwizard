import { Maybe } from "../../utility-types"
import { FormControl, isFormControl } from "../elements/FormControl"
import { ValidationError, ValidationErrors, ValidatorArgumentError } from "./errors"
import { ValidatorFn } from "./validator.types"


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