import { AsyncFormGroupValidatorFn, FormGroupValidatorFn } from "../validators"
import { WithValidators } from "../withValidators.type"
import { AbstractControl, AbstractControlWithValidators } from "./form.types"

/**
 * Type of form element that contains named 'sub' form elements
 * 
 * Useful when you want to create nested forms or want to group form elements together on a single object.
 */
export type FormGroup = {
  controls: {
    [key: string | number | symbol]: AbstractControl
  }
}

/**
 * Type of form element that contains named 'sub' form elements with validators and asyncValidators arrays added.
 * 
 * @see FormGroup
 */
export type FormGroupWithValidators = WithValidators<
  Omit<FormGroup, 'controls'> & { controls : { [key: string]: AbstractControlWithValidators }}, 
  FormGroupValidatorFn, 
  AsyncFormGroupValidatorFn
>

/**
 * Type Predicate that checks whether or not a given AbstractControl is a FormGroup.
 * 
 * @see {@link "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates" Type Predicates}
 */
export function isFormGroup(control: AbstractControl): control is FormGroup {
  return (<FormGroup> control)?.controls !== undefined && 
    // eslint-disable-next-line no-prototype-builtins
    (<FormGroup> control)?.controls?.hasOwnProperty('length') === false
}

/**
 * Constructor function for a FormGroupWithValidators object.
 * 
 * @param controls Object of controls that will be contained in the FormGroup.
 * @param validators The validators that will be applied to the FormGroup **NOT** the individual controls.
 * @param asyncValidators The async validators that will be applied to the FormGroup **NOT** the individual controls.
 * 
 * @returns FormGroupWithValidators
 */
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