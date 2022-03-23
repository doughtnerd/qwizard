import { FormArray, FormArrayWithValidators } from "./FormArray"
import { FormControl, FormControlWithValidators } from "./FormControl"
import { FormGroup, FormGroupWithValidators } from "./FormGroup"


export type AbstractControl = FormArray | FormGroup | FormControl

export type AbstractControlWithValidators = FormControlWithValidators | FormGroupWithValidators | FormArrayWithValidators
