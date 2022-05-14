import { FormArrayWithValidators as FormArrayModel, isFormArray, isFormControl, isFormGroup, validateFormArray, ValidationErrors, ValidationResultsTree } from '@doughtnerd/qwizard-core'
import React from 'react'
import { AbstractFormControlConfig } from '.'
import { FormArrayRenderFn, FormControlInputEvents } from '../types/input-config.types'
import { DefaultInputProps, WithInputRef } from '../types/withInputRef.type'
import { FormControl } from './FormControl'
import { FormGroup, FormGroupConfig } from './FormGroup'

/**
 * Type the defines the props of the FormArray component.
 * 
 * @property {Function} renderComponent the function to use to render the FormArray. If not supplied, defaults to rendering the children of the FormArrayConfig directly.
 * @property {Object} renderData That config data that will be used when rendering the component.
 * @property {Function} renderData.componentTemplate If all elements on the form array use the same component, you can set this to the component. The library will use this function to render all FormControls and pass the return value of `propsTemplate` to the function.
 * @property {Function} renderData.propsTemplate If you choose to use `componentTemplate`, this function will be used to provide props to the component.
 * @property {FormControlInputEvents} renderData.validateOn When the FormControls (if any) on the FromArrayConfig should be validated.
 * @property {Function} renderData.onValidated Callback that will be called when the FormGroup has validated.
 * @property {boolean} renderData.childrenFirst Whether or not the array should wait until **ALL** children have validated before validating itself.
 */
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

/**
 * Union type between FormArray (from @doughtnerd/@qwizard-core) and FormArrayRenderProps
 */
export type FormArrayConfig = Omit<FormArrayModel, 'controls'> & { controls: AbstractFormControlConfig[] } & FormArrayRenderProps

/**
 * Constructor function to make a FormArrayConfig.
 * 
 * @param controls The controls that the FormArrayConfig will contain.
 * @param config The config that will be used to render the FormArrayConfig.
 * @param validators The validators the FormArrayConfig will use. Defaults to an empty array.
 * @param asyncValidators The async Validators the FormArrayConfig will use. Defaults to an empty array.
 * @returns A FormArrayConfig.
 * 
 * @see FormArrayRenderProps
 */
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

/**
 * **DON'T USE THIS FUNCTION DIRECTLY**
 */
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