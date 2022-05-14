import { Nothing } from "../../utility-types";
import { AsyncFormControlValidatorFn, FormControlValidatorFn } from "../validators";
import { WithValidators } from "../withValidators.type";
import { AbstractControl } from "./form.types";

/**
 * Type of form element that contains a single form control.
 * 
 * Used when you only have a single **leaf** input.
 */
type FormControlValue = FormControl['control']['value'] | Nothing

export type FormControl = {
  control: { value: any }
}

/**
 * Type of form element that contains a single form control. with validators and asyncValidators arrays added.
 * 
 * @see FormControl
 */
export type FormControlWithValidators = WithValidators<
  FormControl, 
  FormControlValidatorFn, 
  AsyncFormControlValidatorFn
>

/**
 * Type Predicate that checks whether or not a given AbstractControl is a FormControl.
 * 
 * @see {@link "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates" Type Predicates}
 */
export function isFormControl(control: AbstractControl): control is FormControl {
  return (<FormControl>control)?.control !== undefined
}

/**
 * Constructor function for a FormControlWithValidators object.
 * 
 * @param value The default value of the input.
 * @param validators The validators that will be applied to the FormControl.
 * @param asyncValidators The async validators that will be applied to the FormControl.
 * 
 * @returns FormControlWithValidators
 */
export function createFormControl(
  value: FormControlValue = undefined, 
  validators: FormControlValidatorFn[] = [], 
  asyncValidators: AsyncFormControlValidatorFn[] = []
): FormControlWithValidators {
  return {
    validators,
    asyncValidators,
    control: {
      value
    }
  }
}