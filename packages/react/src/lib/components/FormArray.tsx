import { FormArrayWithValidators as FormArrayModel, isFormArray, isFormControl, isFormGroup, validateFormArray, ValidationErrors, ValidationResultsTree } from '@qwizard/core'
import React from 'react'
import { AbstractFormControlConfig } from '.'
import { FormArrayRenderFn, FormControlInputEvents } from '../types/input-config.types'
import { DefaultInputProps, WithInputRef } from '../types/withInputRef.type'
import { FormControl } from './FormControl'
import { FormGroup, FormGroupConfig } from './FormGroup'

export type FormArrayRenderProps = {
  renderComponent?: FormArrayRenderFn
  renderData: {
    componentTemplate?: (props: WithInputRef<DefaultInputProps & any>) => JSX.Element
    propsTemplate?: (controlName: string) => Record<string | number | symbol, any>
    validateOn?: FormControlInputEvents
    onValidated?: (validationResults: ValidationResultsTree) => void
    childrenFirst?: boolean
  }
}

export type FormArrayConfig = Omit<FormArrayModel, 'controls'> & { controls: AbstractFormControlConfig[] } & FormArrayRenderProps

export function createFormArray(
  controls: FormArrayConfig['controls'], 
  config: FormArrayRenderProps,
  validators: FormArrayConfig['validators'] = [],
  asyncValidators: FormArrayConfig['asyncValidators'] = [],
): FormArrayConfig {
  return {
    controls,
    asyncValidators,
    validators,
    renderComponent: config.renderComponent,
    renderData: config.renderData
  }
}

export function FormArray(props: FormArrayConfig): JSX.Element {
  const [errors, setErrors] = React.useState<ValidationResultsTree>({ errors: {}, isValid: true })
  const [hasValidated, setHasValidated] = React.useState(false)

  const [validationEntries, setValidationEntries] = React.useState<Record<string, boolean>>(() => {
    return Object.keys(props.controls).reduce((acc, key) => { return { ...acc, [key]: false }}, {})
  })

  const onChildValidated = React.useCallback((entryKey: string) => {
    setValidationEntries((prev) => ({...prev, [entryKey]: true}))
  }, [setValidationEntries])

  React.useEffect(() => {
    async function validate() {
      const validationErrors = await validateFormArray(props, true)
      setErrors(validationErrors)
      props.renderData.onValidated?.(validationErrors)
    }

    if(props.renderData.childrenFirst) {
      const hasGroupValidated = Object.values(validationEntries).every((value) => value === true)
      if(hasGroupValidated) {
        validate()
        setHasValidated(true)
      }
    } else {
      validate()
      setHasValidated(true)
    }
  }, [validationEntries])

  const controls = Object.entries(Object.assign({}, props.controls))
    .map(([key, control]: [string, AbstractFormControlConfig]) => {
      const v = control.renderData.validateOn ?? props.renderData.validateOn
      if(isFormControl(control)) {
        // TODO: Use a better key value
        control.renderData.onValidated = () => onChildValidated(key)
        control.renderData.validateOn = v
        // eslint-disable-next-line no-prototype-builtins
        control.renderData.inputProps = control.renderData.hasOwnProperty('inputProps') ? control.renderData.inputProps : props.renderData?.propsTemplate?.(key) ?? {}
        return <FormControl key={key} {...control} renderComponent={control.renderComponent ?? props.renderData.componentTemplate} />
      } 
      if(isFormGroup(control)) {
        // TODO: Use a better key value
        (control as FormGroupConfig).renderData.onValidated = () => onChildValidated(key);
        (control as FormGroupConfig).renderData.validateOn = v;
        (control as FormGroupConfig).renderData.childrenFirst = props.renderData.childrenFirst;
        return <FormGroup {...control as FormGroupConfig} />
      }
      if(isFormArray(control)) {
        // TODO: Use a better key value
        (control as FormArrayConfig).renderData.onValidated = () => onChildValidated(key);
        (control as FormArrayConfig).renderData.validateOn = v;
        (control as FormArrayConfig).renderData.childrenFirst = props.renderData.childrenFirst;
        return <FormArray {...control as FormArrayConfig} />
      }
      return <></>
    })

  if(props.renderComponent) {
    return <>{props.renderComponent({children: controls, errors: errors.errors as ValidationErrors, hasValidated})}</>
  }

  return <>
    {controls}
  </>
}