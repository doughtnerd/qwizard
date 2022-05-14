import { AsyncValidatorFn } from '.';
import { AbstractControlWithValidators } from '..';
import { isNothing, Nothing } from '../../utility-types';
import { FormArrayWithValidators, isFormArray } from '../elements/FormArray';
import { FormControlWithValidators, isFormControl } from '../elements/FormControl';
import { FormGroupWithValidators, isFormGroup } from '../elements/FormGroup';
import { ValidationErrors } from "./errors";
import { ValidatorFn } from './validator.types';

/**
 * Type that represents the validation results of the entire tree of controls.
 */
export type ValidationResultsTree = ValidationEntryMap & ValidationResults

/**
 * Type that represents the validation results of a single control.
 */
export type ValidationResults = {
  errors: ValidationErrors
  isValid: boolean
}

/**
 * Type that represents the validation results of a subtree of controls.
 */
export type ValidationEntryMap = {
  [controlName: string]: ValidationResultsTree
} | Record<string, any>

function runAsyncValidators(control: any, asyncValidators: AsyncValidatorFn[]): Promise<ValidationResults> {
  return Promise.all(asyncValidators.map(asyncValidator => asyncValidator(control).catch(() => {
    console.error('asyncValidator threw an error. Please ensure that all async validators handle promise rejection gracefully inside of the validator function.')
    return undefined as Nothing
  })))
    .then(results => results.reduce<ValidationResults>((acc, error) => {
      return isNothing(error) ? acc : { errors: { ...acc.errors, ...error }, isValid: false }
    }, { errors: {}, isValid: true }))
}

function runSyncValidators(control: any, validators: ValidatorFn[]): ValidationResults {
  return validators.reduce<ValidationResults>((acc, validator) => {
    const error = validator(control);
    return isNothing(error) ? acc : { errors: { ...acc.errors, ...error }, isValid: false }
  }, { errors: {}, isValid: true })
}

/**
 * Validates the entire tree of controls.
 * Async validators are run first, then sync validators are run.
 * The results are combined into a single ValidationResultsTree.
 * 
 * @param form The AbstractControl to validate
 * @returns a Promise containing the validation results.
 */
export function validateAbstractControl(form: AbstractControlWithValidators): Promise<ValidationResultsTree> {
  if(isFormArray(form)) {
    return validateFormArray(form)
  }
  if(isFormControl(form)) {
    return validateFormControl(form)
  }
  if(isFormGroup(form)) {
    return validateFormGroup(form)
  }
  throw new Error('validateAbstractControl: Expected control to be a form group, form control, or form array')
}

/**
 * Validates a FormControl.
 * Async validators are run first, then sync validators are run.
 * The results are combined into a single ValidationResultsTree.
 * 
 * @param control the FormControl to validate
 * @returns a Promise containing the validation results.
 */
export async function validateFormControl(control: FormControlWithValidators): Promise<ValidationResults> {
  const asyncValidationResults = runAsyncValidators(control, control.asyncValidators)
  
  const validationResults: ValidationResults = runSyncValidators(control, control.validators)

  const awaitedValidationResults = await asyncValidationResults

  return { errors: { ...validationResults.errors, ...awaitedValidationResults.errors }, isValid: validationResults.isValid && awaitedValidationResults.isValid }
}

/**
 * Validates a FormArray.
 * Async validators are run first, then sync validators are run.
 * The results are combined into a single ValidationResultsTree.
 * 
 * @param control the FormArray to validate
 * @returns a Promise containing the validation results.
 */
export async function validateFormArray(control: FormArrayWithValidators, onlySelf = false): Promise<ValidationResultsTree> {
  const asyncValidationResults = runAsyncValidators(control, control.asyncValidators)

  const validationResults: ValidationResults = runSyncValidators(control, control.validators)

  const awaitedValidationResults = await asyncValidationResults

  if(onlySelf) {
    return { errors: { ...validationResults.errors, ...awaitedValidationResults.errors }, isValid: validationResults.isValid && awaitedValidationResults.isValid }
  }

  const childValidationMap: ValidationEntryMap = await control.controls.reduce(async (errors, control, idx) => {
    const awaitedErrors = await errors
    if(isFormControl(control)) {
      const validationResult = await validateFormControl(control)
      return { ...awaitedErrors, [idx]: validationResult }
    }

    if(isFormArray(control)) {
      const validationResult = await validateFormArray(control)
      return { ...awaitedErrors, [idx]: validationResult }
    }

    if(isFormGroup(control)) {
      const validationResult = await validateFormGroup(control)
      return { ...awaitedErrors, [idx]: validationResult }
    }
    return awaitedErrors
  }, { })

  const isArrayValid = validationResults.isValid && awaitedValidationResults.isValid && Object.values(childValidationMap).every((childValidation) => (childValidation as ValidationResults).isValid)
  return { errors: { ...validationResults.errors, ...awaitedValidationResults.errors }, ...childValidationMap, isValid: isArrayValid }
}

/**
 * Validates a FormGroup.
 * Async validators are run first, then sync validators are run.
 * The results are combined into a single ValidationResultsTree.
 * 
 * @param control the FormGroup to validate
 * @returns a Promise containing the validation results.
 */
export async function validateFormGroup(control: FormGroupWithValidators, onlySelf = false): Promise<ValidationResultsTree> {
  const asyncValidationResults = runAsyncValidators(control, control.asyncValidators)

  const validationResults: ValidationResults = runSyncValidators(control, control.validators)

  const awaitedValidationResults = await asyncValidationResults

  if(onlySelf) {
    return { errors: { ...validationResults.errors, ...awaitedValidationResults.errors }, isValid: validationResults.isValid && awaitedValidationResults.isValid }
  }

  const childValidationMap: ValidationEntryMap = await Object.entries(control.controls).reduce(async(errors, [controlName, control]) => {
    const awaitedErrors = await errors
    if(isFormControl(control)) {
      const validationResult = await validateFormControl(control)
      return { ...awaitedErrors, [controlName]: validationResult }
    }

    if(isFormArray(control)) {
      const validationResult = await validateFormArray(control)
      return { ...awaitedErrors, [controlName]: validationResult }
    }

    if(isFormGroup(control)) {
      const validationResult = await validateFormGroup(control)
      return { ...awaitedErrors, [controlName]: validationResult }
    }
    return awaitedErrors
  }, {})

  const isGroupValid = validationResults.isValid && awaitedValidationResults.isValid && Object.values(childValidationMap).every((childValidation) => (childValidation as ValidationResults).isValid)
  return { errors: { ...validationResults.errors, ...awaitedValidationResults.errors }, ...childValidationMap, isValid: isGroupValid }
}