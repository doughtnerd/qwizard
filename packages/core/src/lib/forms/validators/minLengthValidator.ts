import { Maybe } from "../../utility-types"
import { isFormArray } from "../elements/FormArray"
import { FormControl, isFormControl } from "../elements/FormControl"
import { ValidationError, ValidationErrors, ValidatorArgumentError } from "./errors"
import { ValidatorFn } from "./validator.types"


export function minLengthValidator(minLength: number): ValidatorFn {
  return (input: FormControl): Maybe<ValidationErrors> => {
    if (!isFormControl(input) && !isFormArray(input)) {
      throw new ValidatorArgumentError('minLength: input is not a FormControl or a FormArray')
    }
    
    if(isFormControl(input)) {
      const isValid = input.control.value?.length >= minLength
      if(!isValid) {
        return { minLength: new ValidationError(`Input value must be at least ${minLength} characters long. Input value was ${input.control.value}`) }
      }
    }

    if(isFormArray(input)) {
      const isValid = input.controls.length >= minLength
      if(!isValid) {
        return { minLength: new ValidationError(`Must be at most ${minLength} elements long`) }
      }
    }

    return
  }
}