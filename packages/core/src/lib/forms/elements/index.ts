import { createFormArray } from "./FormArray";
import { createFormControl } from "./FormControl";
import { createFormGroup } from "./FormGroup";

export const Form = {
  Control: createFormControl,
  Group: createFormGroup,
  Array: createFormArray
}


export * from './form.types'
export * from './FormArray'
export * from './FormGroup'
export * from './FormControl'