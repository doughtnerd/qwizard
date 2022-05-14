import { Maybe } from "../../utility-types"
import { FormArray, isFormArray } from "../elements/FormArray"
import { FormControl, isFormControl } from "../elements/FormControl"
import { ValidationError, ValidationErrors, ValidatorArgumentError } from "./errors"
import { ValidatorFn } from "./validator.types"

/**
 * When used with a FormArray, validates the size of the array.
 * When used with a FormControl, validates the length of the control's value.
 * 
 * @param maxLength The maximum length of the FormControl value OR the maximum length of controls on the FormArray.
 * @returns A validator function that applies the above validation rules.
 */
export function maxLengthValidator(maxLength: number): ValidatorFn {
  return (input: FormControl | FormArray): Maybe<ValidationErrors> => {
    if (!isFormControl(input) && !isFormArray(input)) {
      throw new ValidatorArgumentError('maxLength: input is not a FormControl or a FormArray')
    }
    
    if(isFormControl(input)) {
      const isValid = input.control.value.length <= maxLength
      if(!isValid) {
        return { maxLength: new ValidationError(`Input value must be at most ${maxLength} characters long. Input value was ${input.control.value}`) }
      }
    }

    if(isFormArray(input)) {
      const isValid = input.controls.length <= maxLength
      if(!isValid) {
        return { maxLength: new ValidationError(`Must be at most ${maxLength} elements long`) }
      }
    }

    return
  }
}