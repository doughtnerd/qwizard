import { AbstractControl } from "./elements"
import { AsyncValidatorFn } from "./validators"
import { ValidatorFn } from "./validators/validator.types"

/**
 * Utility type that is used to add validators and asyncValidators to an AbstractControl type
 */
export type WithValidators<T extends AbstractControl, K extends ValidatorFn, V extends AsyncValidatorFn> = {
  validators: K[]
  asyncValidators: V[]
} & T