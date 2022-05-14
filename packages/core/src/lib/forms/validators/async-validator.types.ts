import { Maybe } from "../../utility-types";
import { AbstractControl } from "../elements/form.types";
import { FormArray } from "../elements/FormArray";
import { FormControl } from "../elements/FormControl";
import { FormGroup } from "../elements/FormGroup";
import { ValidationErrors } from "./errors";

/**
 * Parent type of all async form validator functions
 */
export type AsyncValidatorFn = AsyncAbstractControlValidatorFn | AsyncFormControlValidatorFn | AsyncFormGroupValidatorFn | AsyncFormArrayValidatorFn;

/**
 * An async form validator function that validates an AbstractControl
 */
export type AsyncAbstractControlValidatorFn = (input: AbstractControl) => Promise<Maybe<ValidationErrors>>;

/**
 * An async form validator function that validates a FormControl
 */
export type AsyncFormControlValidatorFn = (input: FormControl) => Promise<Maybe<ValidationErrors>>;

/**
 * An async form validator function that validates a FormGroup
 */
export type AsyncFormGroupValidatorFn = (input: FormGroup) => Promise<Maybe<ValidationErrors>>;

/**
 * An async form validator function that validates a FormArray
 */
export type AsyncFormArrayValidatorFn = (input: FormArray) => Promise<Maybe<ValidationErrors>>;