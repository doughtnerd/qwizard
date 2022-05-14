import { FormGroup, isFormGroup } from './elements/FormGroup';
import { FormControl, isFormControl } from './elements/FormControl';
import { AbstractControl, FormArray, isFormArray } from '.';

/**
 * The value of a FormControl
 */
type FormControlValue = any

/**
 * The value of a FormArray
 */
type FormArrayValue = AbstractFormControlValue[]

/**
 * The value of a FormGroup
 */
type FormGroupValue = { [key: string]: AbstractFormControlValue }

/**
 * The value of an AbstractControl
 */
type AbstractFormControlValue = FormControlValue | FormArrayValue | FormGroupValue

/**
 * Returns the value of an AbstractControl, including all of its children.
 * 
 * @param form The AbstractControl to get the value of
 * @throws if the AbstractControl is not a FormControl, FormArray, or FormGroup
 */
export function getAbstractControlValue(form: AbstractControl): AbstractFormControlValue {
  if(isFormArray(form)) {
    return getFormArrayValue(form)
  }
  if(isFormControl(form)) {
    return getFormControlValue(form)
  }
  if(isFormGroup(form)) {
    return getFormGroupValue(form)
  }
  throw new Error('getAbstractControlValue: Expected control to be a form group, form control, or form array')
}

/**
 * Returns the value of an FormControl, including all of its children.
 * 
 * @param form The FormControl to get the value of
 */
export function getFormControlValue(control: FormControl): FormControlValue {
  return control.control.value;
}

/**
 * Returns the value of an FormGroup, including all of its children.
 * 
 * @param form The FormGroup to get the value of
 */
export function getFormGroupValue(control: FormGroup): FormGroupValue {
  return Object.entries(control.controls).reduce<AbstractFormControlValue>((acc, curr) => {
    const [controlName, control] = curr

    if(isFormControl(control)) {
      acc[controlName] = getFormControlValue(control);
    }
    if(isFormGroup(control)) {
      acc[controlName] = getFormGroupValue(control);
    }
    if(isFormArray(control)) {
      acc[controlName] = getFormArrayValue(control);
    }

    return acc
  }, {})
}

/**
 * Returns the value of an FormArray, including all of its children.
 * 
 * @param form The FormArray to get the value of
 */
export function getFormArrayValue(control: FormArray): FormArrayValue {
  return control.controls.map(control => {
    if(isFormControl(control)) {
      return getFormControlValue(control);
    }
    if(isFormGroup(control)) {
      return getFormGroupValue(control);
    }
    if(isFormArray(control)) {
      return getFormArrayValue(control);
    }
  })
}