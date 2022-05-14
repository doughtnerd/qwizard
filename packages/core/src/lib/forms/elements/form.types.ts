import { FormArray, FormArrayWithValidators } from "./FormArray"
import { FormControl, FormControlWithValidators } from "./FormControl"
import { FormGroup, FormGroupWithValidators } from "./FormGroup"

/**
 * Parent type for all Form Control types.
 */
export type AbstractControl = FormArray | FormGroup | FormControl

/**
 * Parent type for all Form Control types with validators and asyncValidators arrays added.
 */
export type AbstractControlWithValidators = FormControlWithValidators | FormGroupWithValidators | FormArrayWithValidators
