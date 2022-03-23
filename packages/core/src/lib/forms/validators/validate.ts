import { AsyncValidatorFn } from '.';
import { AbstractControlWithValidators } from '..';
import { isNothing, Nothing } from '../../utility-types';
import { FormArrayWithValidators, isFormArray } from '../elements/FormArray';
import { FormControlWithValidators, isFormControl } from '../elements/FormControl';
import { FormGroupWithValidators, isFormGroup } from '../elements/FormGroup';
import { ValidationErrors } from "./errors";
import { ValidatorFn } from './validator.types';

export type ValidationResultsTree = ValidationEntryMap & ValidationResults

export type ValidationResults = {
  errors: ValidationErrors
  isValid: boolean
}

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

export async function validateFormControl(control: FormControlWithValidators): Promise<ValidationResults> {
  const asyncValidationResults = runAsyncValidators(control, control.asyncValidators)
  
  const validationResults: ValidationResults = runSyncValidators(control, control.validators)

  const awaitedValidationResults = await asyncValidationResults

  return { errors: { ...validationResults.errors, ...awaitedValidationResults.errors }, isValid: validationResults.isValid && awaitedValidationResults.isValid }
}

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