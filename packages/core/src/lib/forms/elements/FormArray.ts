import { AsyncFormArrayValidatorFn, FormArrayValidatorFn } from "../validators"
import { WithValidators } from "../withValidators.type"
import { AbstractControl, AbstractControlWithValidators } from "./form.types"

/**
 * Type of form element that contains an array of form controls.
 * 
 * Useful when you have a form that has elements that you can add and remove.
 */
export type FormArray = {
  controls: AbstractControl[]
}

/**
 * Type of form element that contains an array of form controls with validators and asyncValidators arrays added.
 * 
 * @see FormArray
 */
export type FormArrayWithValidators = WithValidators<
  Omit<FormArray, 'controls'> & { controls : AbstractControlWithValidators[] }, 
  FormArrayValidatorFn, 
  AsyncFormArrayValidatorFn>

/**
 * Type Predicate that checks whether or not a given AbstractControl is a FormArray.
 * 
 * @see {@link "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates" Type Predicates}
 */
export function isFormArray(control: AbstractControl): control is FormArray {
  return (<FormArray> control)?.controls !== undefined && 
    (<FormArray> control)?.controls?.length !== undefined
}

/**
 * Constructor function for a FormArrayWithValidators object.
 * 
 * @param controls Array of controls that will be contained in the FormArray.
 * @param validators The validators that will be applied to the FormArray **NOT** the individual controls.
 * @param asyncValidators The async validators that will be applied to the FormArray **NOT** the individual controls.
 * 
 * @returns FormArrayWithValidators
 */
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