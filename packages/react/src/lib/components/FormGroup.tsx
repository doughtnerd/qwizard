import { FormGroupWithValidators as FormGroupModel, isFormArray, isFormControl, isFormGroup, validateFormGroup, ValidationErrors, ValidationResultsTree } from '@doughtnerd/qwizard-core'
import React from 'react'
import { AbstractFormControlConfig, FormControlConfig } from '.'
import { FormControlInputEvents, FormGroupRenderFn } from '../types/input-config.types'
import { DefaultInputProps, WithInputRef } from '../types/withInputRef.type'
import { FormArray, FormArrayConfig } from './FormArray'
import { FormControl } from './FormControl'

/**
 * @typedef {Object} FormGroupRenderDataDef Render data used by FormGroupConfig
 * @property {Function} renderData.componentTemplate If all elements on the form group use the same component, you can set this to the component. The library will use this function to render all FormControls and pass the return value of `propsTemplate` to the function.
 * @property {Function} renderData.propsTemplate If you choose to use `componentTemplate`, this function will be used to provide props to the component.
 * @property {FormControlInputEvents} renderData.validateOn When the FormControls (if any) on the formGroup should be validated.
 * @property {Function} renderData.onValidated Callback that will be called when the FormGroup has validated.
 * @property {boolean} renderData.childrenFirst Whether or not the group should wait until **ALL** children have validated before validating itself.
 */

/**
 * Type the defines the props of the FormGroup component.
 * 
 * @property {Function} renderComponent the function to use to render the FormGroup component. If not supplied, defaults to rendering the children of the FormGroupConfig directly.
 * @property {FormGroupRenderDataDef} renderData That config data that will be used when rendering the component.
 * @property {Function} renderData.componentTemplate If all elements on the form group use the same component, you can set this to the component. The library will use this function to render all FormControls and pass the return value of `propsTemplate` to the function.
 * @property {Function} renderData.propsTemplate If you choose to use `componentTemplate`, this function will be used to provide props to the component.
 * @property {FormControlInputEvents} renderData.validateOn When the FormControls (if any) on the formGroup should be validated.
 * @property {Function} renderData.onValidated Callback that will be called when the FormGroup has validated.
 * @property {boolean} renderData.childrenFirst Whether or not the group should wait until **ALL** children have validated before validating itself.
 */
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

/**
 * Union type between FormGroup and FormGroupRenderProps
 */
export type FormGroupConfig = Omit<FormGroupModel, 'controls'> & { controls: {[key: string]: AbstractFormControlConfig }} & FormGroupRenderProps

/**
 * Constructor function to make a FormGroupConfig.
 * 
 * @param controls The controls that the FormGroupConfig will contain.
 * @param config The config that will be used to render the FormGroup.
 * @param validators The validators the FormGroupConfig will use. Defaults to an empty array.
 * @param asyncValidators The async Validators the FormGroupConfig will use. Defaults to an empty array.
 * @returns A FormGroupConfig.
 * 
 * @see FormGroupRenderProps
 */
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

/**
 * **DON'T USE THIS FUNCTION DIRECTLY**
 */
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
