import { AsyncFormGroupValidatorFn, FormGroupValidatorFn } from "../validators"
import { WithValidators } from "../withValidators.type"
import { AbstractControl, AbstractControlWithValidators } from "./form.types"

export type FormGroup = {
  controls: {
    [key: string | number | symbol]: AbstractControl
  }
}

export type FormGroupWithValidators = WithValidators<
  Omit<FormGroup, 'controls'> & { controls : { [key: string]: AbstractControlWithValidators }}, 
  FormGroupValidatorFn, 
  AsyncFormGroupValidatorFn
>

export function isFormGroup(control: AbstractControl): control is FormGroup {
  return (<FormGroup> control)?.controls !== undefined && 
    // eslint-disable-next-line no-prototype-builtins
    (<FormGroup> control)?.controls?.hasOwnProperty('length') === false
}

export function createFormGroup(
  controls: { [key: string]: AbstractControlWithValidators }, 
  validators: FormGroupValidatorFn[] = [], 
  asyncValidators: AsyncFormGroupValidatorFn[] = []
): FormGroupWithValidators {
  return {
    validators,
    asyncValidators,
    controls
  }
}