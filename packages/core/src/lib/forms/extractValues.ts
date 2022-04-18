import { FormGroup, isFormGroup } from './elements/FormGroup';
import { FormControl, isFormControl } from './elements/FormControl';
import { AbstractControl, FormArray, isFormArray } from '.';


export function getAbstractControlValue(form: AbstractControl): any {
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

export function getFormControlValue(control: FormControl): any {
  return control.control.value;
}

export function getFormGroupValue(control: FormGroup): any {
  return Object.entries(control.controls).reduce<any>((acc, curr) => {
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

export function getFormArrayValue(control: FormArray): any {
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