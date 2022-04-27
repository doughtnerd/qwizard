import { FormGroupWithValidators as FormGroupModel, isFormArray, isFormControl, isFormGroup, validateFormGroup, ValidationErrors, ValidationResultsTree } from '@doughtnerd/qwizard-core'
import React from 'react'
import { AbstractFormControlConfig, FormControlConfig } from '.'
import { FormControlInputEvents, FormGroupRenderFn } from '../types/input-config.types'
import { DefaultInputProps, WithInputRef } from '../types/withInputRef.type'
import { FormArray, FormArrayConfig } from './FormArray'
import { FormControl } from './FormControl'

export type FormGroupRenderProps = {
  renderComponent?: FormGroupRenderFn
  renderData: {
    componentTemplate?: (props: WithInputRef<DefaultInputProps & any>) => JSX.Element 
    propsTemplate?: (controlName: string) => Record<string | number | symbol, any>
    validateOn?: FormControlInputEvents
    onValidated?: (validationResults: ValidationResultsTree) => void
    childrenFirst?: boolean
  }
}

export type FormGroupConfig = Omit<FormGroupModel, 'controls'> & { controls: {[key: string]: AbstractFormControlConfig }} & FormGroupRenderProps

export function createFormGroup(
  controls: FormGroupConfig['controls'], 
  config: FormGroupRenderProps,
  validators: FormGroupConfig['validators'] = [],
  asyncValidators: FormGroupConfig['asyncValidators'] = [],
): FormGroupConfig {
  return {
    controls,
    asyncValidators,
    validators,
    renderComponent: config.renderComponent,
    renderData: config.renderData
  }
}

export function FormGroup(props: FormGroupConfig): JSX.Element {
  const [errors, setErrors] = React.useState<ValidationResultsTree>({ errors: {}, isValid: true })
  const [hasValidated, setHasValidated] = React.useState(false)
  const [validationEntries, setValidationEntries] = React.useState<Record<string, boolean>>(() => {
    return Object.keys(props.controls).reduce((acc, key) => { return { ...acc, [key]: false }}, {})
  })
  const [hasValidatedOnce, setHasValidatedOnce] = React.useState(false)

  const onChildValidated = React.useCallback((entryKey: string) => {
    setHasValidatedOnce(true)
    setValidationEntries((prev) => ({...prev, [entryKey]: true}))
  }, [setValidationEntries])

  React.useEffect(() => {
    async function validate() {
      const validationErrors = await validateFormGroup(props, true)
      setErrors(validationErrors)
      props.renderData.onValidated?.(validationErrors)
    }

    if(hasValidatedOnce) {
      if(props.renderData.childrenFirst) {
        const hasGroupValidated = Object.values(validationEntries).every((value) => value === true)
        if(hasGroupValidated) {
          validate()
          setHasValidated(hasGroupValidated)
        }
      } else {
        validate()
        setHasValidated(true)
      }
    }

  }, [validationEntries])

  const controls = Object.entries(props.controls)
    .map(([key, control]: [string, AbstractFormControlConfig]) => {
      const v = control.renderData.validateOn ?? props.renderData.validateOn
      
      if(isFormControl(control)) {
        control.renderData.onValidated = () => onChildValidated(key)
        control.renderData.validateOn = v
        // eslint-disable-next-line no-prototype-builtins
        ;(control as FormControlConfig).renderData.inputProps = control.renderData.hasOwnProperty('inputProps') ? (control as FormControlConfig).renderData.inputProps : props.renderData?.propsTemplate?.(key) ?? {}
        return <FormControl key={key} {...control as FormControlConfig} renderComponent={control.renderComponent ?? props.renderData.componentTemplate}/>
      } 
      if(isFormGroup(control)) {
        control.renderData.onValidated = () => onChildValidated(key)
        control.renderData.validateOn = v
        ;(control as FormGroupConfig).renderData.childrenFirst = props.renderData.childrenFirst
        return <FormGroup key={key} {...control as FormGroupConfig} />
      }
      if(isFormArray(control)) {
        (control as FormArrayConfig).renderData.onValidated = () => onChildValidated(key);
        (control as FormArrayConfig).renderData.validateOn = v;
        (control as FormArrayConfig).renderData.childrenFirst = props.renderData.childrenFirst;
        return <FormArray key={key} {...control as FormArrayConfig} />
      }
      return <></>
    })

  if(props.renderComponent) {
    return <>{props.renderComponent({ children: controls, errors: errors.errors as ValidationErrors, hasValidated: hasValidated })}</>
  }

  return <>{controls}</>
}
