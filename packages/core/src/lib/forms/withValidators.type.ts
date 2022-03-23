import { AbstractControl } from "./elements"
import { AsyncValidatorFn } from "./validators"
import { ValidatorFn } from "./validators/validator.types"


export type WithValidators<T extends AbstractControl, K extends ValidatorFn, V extends AsyncValidatorFn> = {
  validators: K[]
  asyncValidators: V[]
} & T