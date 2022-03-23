import { AsyncFormArrayValidatorFn, FormArrayValidatorFn } from "../validators"
import { WithValidators } from "../withValidators.type"
import { AbstractControl, AbstractControlWithValidators } from "./form.types"

export type FormArray = {
  controls: AbstractControl[]
}

export type FormArrayWithValidators = WithValidators<
  Omit<FormArray, 'controls'> & { controls : AbstractControlWithValidators[] }, 
  FormArrayValidatorFn, 
  AsyncFormArrayValidatorFn>

export function isFormArray(control: AbstractControl): control is FormArray {
  return (<FormArray> control)?.controls !== undefined && 
    (<FormArray> control)?.controls?.length !== undefined
}

export function createFormArray(
  controls: AbstractControlWithValidators[], 
  validators: FormArrayValidatorFn[] = [], 
  asyncValidators: AsyncFormArrayValidatorFn[] = []
): FormArrayWithValidators {
  return {
    controls,
    validators,
    asyncValidators
  }
}