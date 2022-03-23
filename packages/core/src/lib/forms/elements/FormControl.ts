import { Nothing } from "../../utility-types";
import { AsyncFormControlValidatorFn, FormControlValidatorFn } from "../validators";
import { WithValidators } from "../withValidators.type";
import { AbstractControl } from "./form.types";

type FormControlValue = FormControl['control']['value'] | Nothing

export type FormControl = {
  control: { value: any }
}

export type FormControlWithValidators = WithValidators<
  FormControl, 
  FormControlValidatorFn, 
  AsyncFormControlValidatorFn
>

export function isFormControl(control: AbstractControl): control is FormControl {
  return (<FormControl>control)?.control !== undefined
}

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