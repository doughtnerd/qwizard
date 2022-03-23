import { Maybe } from "../../utility-types"
import { FormControl, isFormControl } from "../elements/FormControl"
import { ValidationError, ValidationErrors, ValidatorArgumentError } from "./errors"
import { ValidatorFn } from "./validator.types"


export function regexValidator(regex: RegExp): ValidatorFn {
  return (input: FormControl): Maybe<ValidationErrors> => {
    if (!isFormControl(input)) {
      throw new ValidatorArgumentError('regex: input is not a FormControl')
    }
    
    const isValid = regex.test(input.control.value)

    if(!isValid) {
      return { regex: new ValidationError(`Input value must match the pattern ${regex}. Value was ${input.control.value}`) }
    }

    return
  }
}