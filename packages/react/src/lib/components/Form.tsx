import { isFormArray, isFormControl, isFormGroup, validateAbstractControl, validateFormArray, validateFormControl, validateFormGroup, ValidationResultsTree } from '@doughtnerd/qwizard-core'
import React, { InputHTMLAttributes, PropsWithChildren } from 'react'
import { AbstractFormControlConfig } from '.'
import { FormArray, FormArrayConfig } from './FormArray'
import { FormControl } from './FormControl'
import { FormGroup, FormGroupConfig } from './FormGroup'

export type FormConfig = {
  config: AbstractFormControlConfig
  formProps?: InputHTMLAttributes<HTMLFormElement>
  onValidate?: (validationResults: ValidationResultsTree) => void,
  onSubmit?: (event: CustomEvent) => void,
  renderFormContent?: (formElements: React.ReactNode) => React.ReactNode
}

export function Form(props: PropsWithChildren<FormConfig>): JSX.Element {
  const onChildValidated = async (validationFunc: any) => {
    const errors = await validationFunc(props.config)
    props.onValidate?.(errors)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors = await validateAbstractControl(props.config)
    props.onSubmit?.(new CustomEvent('submit', { detail: { errors } }))
  }

  let formUI;
  if (isFormControl(props.config)) {
    props.config.renderData.onValidated = props.config.renderData.onValidated ? props.config.renderData.onValidated : () => onChildValidated(validateFormControl)
    formUI = <FormControl {...props.config} />
  }

  if (isFormArray(props.config)) {
    props.config.renderData.onValidated = props.config.renderData.onValidated ? props.config.renderData.onValidated : () => onChildValidated(validateFormArray)
    formUI = <FormArray {...props.config as FormArrayConfig} />
  }

  if (isFormGroup(props.config)) {
    props.config.renderData.onValidated = props.config.renderData.onValidated ? props.config.renderData.onValidated : () => onChildValidated(validateFormGroup)
    formUI = <FormGroup {...props.config as FormGroupConfig} />
  }

  if (props.renderFormContent) {
    return <form {...props.formProps} onSubmit={onSubmit}>{props.renderFormContent(formUI)}</form>
  }

  return <form {...props.formProps} onSubmit={onSubmit}>{formUI}{props.children}</form>
}