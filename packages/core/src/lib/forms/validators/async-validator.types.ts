import { AbstractControl } from "../elements/form.types";
import { Either, Maybe } from "../../utility-types";
import { ValidationErrors } from "./errors";
import { FormControl } from "../elements/FormControl";
import { FormArray } from "../elements/FormArray";
import { FormGroup } from "../elements/FormGroup";


export type AsyncValidatorFn = AsyncAbstractControlValidatorFn | AsyncFormControlValidatorFn | AsyncFormGroupValidatorFn | AsyncFormArrayValidatorFn;
export type AsyncAbstractControlValidatorFn = (input: AbstractControl) => Promise<Maybe<ValidationErrors>>;
export type AsyncFormControlValidatorFn = (input: FormControl) => Promise<Maybe<ValidationErrors>>;
export type AsyncFormGroupValidatorFn = (input: FormGroup) => Promise<Maybe<ValidationErrors>>;
export type AsyncFormArrayValidatorFn = (input: FormArray) => Promise<Maybe<ValidationErrors>>;