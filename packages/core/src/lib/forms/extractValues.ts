import { FormGroup, FormGroupWithValidators, isFormGroup } from './elements/FormGroup';
import { createFormControl, FormControl, FormControlWithValidators, isFormControl } from './elements/FormControl';
import { AbstractControl, FormArray, FormArrayWithValidators, isFormArray } from '.';


/**
 * The value of an AbstractControl
 */
 type AbstractFormControlValue = FormControlValue | FormArrayValue | FormGroupValue
 
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

export function setFormGroupValue(control: FormGroup, value: FormGroupValue): FormGroupWithValidators {
  return Object.entries(control.controls).reduce<FormGroupWithValidators>((prev: FormGroupWithValidators, [controlName, control]) => {
    if(isFormControl(control)) {
      prev.controls[controlName] = setFormControlValue(control as FormControlWithValidators, value[controlName] ?? undefined);
    }
    if(isFormGroup(control)) {
      prev.controls[controlName] = setFormGroupValue(control as FormGroupWithValidators, value[controlName] ?? undefined);
    }
    if(isFormArray(control)) {
      prev.controls[controlName] = setFormArrayValue(control as FormArrayWithValidators, value[controlName] ?? undefined);
    }

    return prev
  }, {} as FormGroupWithValidators)
}

export function setFormArrayValue(control: FormArrayWithValidators, values: FormArrayValue): FormArrayWithValidators {
  return control.controls.reduce((prev: FormArrayWithValidators, curr, index) => {
    if(isFormControl(curr)) {
      prev.controls[index] = setFormControlValue(curr as FormControlWithValidators, values[index] ?? undefined);
    }
    if(isFormGroup(curr)) {
      prev.controls[index] = setFormGroupValue(curr as FormGroupWithValidators, values[index] ?? undefined);
    }
    if(isFormArray(curr)) {
      prev.controls[index] = setFormArrayValue(curr as FormArrayWithValidators, values[index] ?? undefined);
    }

    return prev
  }, {} as FormArrayWithValidators)
}

export function setFormControlValue(control: FormControlWithValidators, value?: FormControlValue): FormControlWithValidators {
  return createFormControl(value, control.validators, control.asyncValidators)
}

export function patchFormArrayValue(control: FormArrayWithValidators, values: FormArrayValue): FormArrayWithValidators {
  return control.controls.reduce((prev: FormArrayWithValidators, curr, index) => {
    if(isFormControl(curr)) {
      prev.controls[index] = setFormControlValue(curr as FormControlWithValidators, values?.[index]);
    }
    if(isFormGroup(curr)) {
      prev.controls[index] = setFormGroupValue(curr as FormGroupWithValidators, values?.[index]);
    }
    if(isFormArray(curr)) {
      prev.controls[index] = setFormArrayValue(curr as FormArrayWithValidators, values?.[index]);
    }

    return prev
  }, {} as FormArrayWithValidators)
}

export function patchFormGroupValue(control: FormGroupWithValidators, value?: FormGroupValue): FormGroupWithValidators {
  return Object.entries(control.controls).reduce<FormGroupWithValidators>((prev: FormGroupWithValidators, [controlName, control]) => {
    if(isFormControl(control)) {
      prev.controls[controlName] = patchFormControlValue(control as FormControlWithValidators, value?.[controlName]);
    }
    if(isFormGroup(control)) {
      prev.controls[controlName] = patchFormGroupValue(control as FormGroupWithValidators, value?.[controlName]);
    }
    if(isFormArray(control)) {
      prev.controls[controlName] = patchFormArrayValue(control as FormArrayWithValidators, value?.[controlName]);
    }

    return prev
  }, {} as FormGroupWithValidators)
}

export function patchFormControlValue(control: FormControlWithValidators, value?: FormControlValue): FormControlWithValidators {
  return createFormControl(value ?? control.control.value, control.validators, control.asyncValidators)
}