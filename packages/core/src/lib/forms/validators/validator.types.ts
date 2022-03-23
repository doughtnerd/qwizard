import { Maybe } from "../../utility-types";
import { AbstractControl } from "../elements";
import { FormArray } from "../elements/FormArray";
import { FormControl } from "../elements/FormControl";
import { FormGroup } from "../elements/FormGroup";
import { ValidationErrors } from "./errors";


export type ValidatorFn = FormControlValidatorFn | FormGroupValidatorFn | FormArrayValidatorFn | AbstractControlValidatorFn;

export type AbstractControlValidatorFn = (input: AbstractControl) => Maybe<ValidationErrors>;
export type FormControlValidatorFn = (input: FormControl) => Maybe<ValidationErrors>;
export type FormGroupValidatorFn = (input: FormGroup) => Maybe<ValidationErrors>;
export type FormArrayValidatorFn = (input: FormArray) => Maybe<ValidationErrors>;