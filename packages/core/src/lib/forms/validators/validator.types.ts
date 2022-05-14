import { Maybe } from "../../utility-types";
import { AbstractControl } from "../elements";
import { FormArray } from "../elements/FormArray";
import { FormControl } from "../elements/FormControl";
import { FormGroup } from "../elements/FormGroup";
import { ValidationErrors } from "./errors";

/**
 * Parent type of all form validator functions
 */
export type ValidatorFn = FormControlValidatorFn | FormGroupValidatorFn | FormArrayValidatorFn | AbstractControlValidatorFn;

/**
 * An form validator function that validates an AbstractControl
 */
export type AbstractControlValidatorFn = (input: AbstractControl) => Maybe<ValidationErrors>;

/**
 * An form validator function that validates an FormControl
 */
export type FormControlValidatorFn = (input: FormControl) => Maybe<ValidationErrors>;

/**
 * An form validator function that validates an FormGroup
 */
export type FormGroupValidatorFn = (input: FormGroup) => Maybe<ValidationErrors>;

/**
 * An form validator function that validates an FormArray
 */
export type FormArrayValidatorFn = (input: FormArray) => Maybe<ValidationErrors>;