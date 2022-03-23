
import { createFormGroup, FormGroupConfig } from './FormGroup';
import { createFormControl, FormControlConfig } from './FormControl';
import { createFormArray, FormArrayConfig } from './FormArray';

export type AbstractFormControlConfig = FormGroupConfig | FormArrayConfig | FormControlConfig

export const FormConfig = {
  Group: createFormGroup,
  Control: createFormControl,
  Array: createFormArray
}

export * from './Form'
export * from './FormGroup'
export * from './FormArray'
export * from './FormControl'