import { FormControlWithValidators as FormControlModel, validateFormControl, ValidationError, ValidationResults } from '@doughtnerd/qwizard-core';
import React, { LegacyRef } from 'react';
import { FormControlInputEvents } from '../types/input-config.types';
import { DefaultInputProps, WithInputRef } from '../types/withInputRef.type';


/**
 * Type the defines the props of the FormControl component.
 * 
 * @property {Function} renderComponent the function to use to render the FormControl component. If not supplied, defaults to rendering an `<input>` element.
 * @property {Object} renderData That config data that will be used when rendering the component.
 * @property {Object} renderData.inputProps The props that will be passed to the input element.
 * @property {FormControlInputEvents} renderData.validateOn When the FormControls (if any) on the formGroup should be validated.
 * @property {Function} renderData.onValidated Callback that will be called when the FormControl has validated.
 * @property {boolean} renderData.enableNativeValidation Whether or not the FormControl should use browser/HTML native validation (eg. setting an input type='email' uses native email validation and will show a native popup on submit).
 */
export type FormControlProps = {
  renderComponent?: (props: WithInputRef<DefaultInputProps & any>) => JSX.Element 
  renderData: {
    inputProps?: Record<string | number | symbol, any>
    validateOn?: FormControlInputEvents
    enableNativeValidation?: boolean
    onValidated?: (validationResults: ValidationResults) => void
  }
}

/**
 * Union type between FormControl and FormGroupRenderProps
 */
export type FormControlConfig = FormControlModel & FormControlProps

/**
 * Constructor function to make a FormControlConfig.
 * 
 * @param value The default value of the input.
 * @param config The config that will be used to render the FormControl.
 * @param validators The validators the FormGroupConfig will use. Defaults to an empty array.
 * @param asyncValidators The async Validators the FormControlConfig will use. Defaults to an empty array.
 * @returns A FormControlConfig.
 * 
 * @see FormControlProps
 */
export function createFormControl(
  value: FormControlConfig['control']['value'], 
  config: FormControlProps = { renderData: {} },
  validators: FormControlConfig['validators'] = [],
  asyncValidators: FormControlConfig['asyncValidators'] = [],
): FormControlConfig {
  return {
    control: {
      value,
    },
    asyncValidators,
    validators,
    renderComponent: config.renderComponent,
    renderData: config.renderData
  }
}

/**
 * **DON'T USE THIS FUNCTION DIRECTLY**
 */
export function FormControl(
  props: FormControlConfig
) {
  const ref = React.useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(null);
  const [errors, setErrors] = React.useState<ValidationResults>({ errors: {}, isValid: true })

  React.useEffect(() => {
    const currentRef: HTMLInputElement = ref.current as HTMLInputElement;

    function handleInput(e: any) {
      if(e.target.type === 'checkbox') {
        props.control.value = e.target.checked
      } else {
        props.control.value = e.target.value
      }
    }
    currentRef.addEventListener('input', handleInput)

    return () => {
      currentRef.removeEventListener('input', handleInput)
    }

  }, [ref.current])

  React.useEffect(() => {
    const currentRef: HTMLInputElement = ref.current as HTMLInputElement;

    async function validate() {
      const validationResults = await validateFormControl(props)
      const firstError = Object.values(validationResults.errors).find((error) => error)

      if(props.renderData.enableNativeValidation) {
        currentRef.setCustomValidity((firstError as Error)?.message ?? '')

        const validityState: ValidityState = currentRef.validity
        for(const key in validityState) {
          if(key!=='valid' && key !== 'customError' && Reflect.has(validityState, key) && Reflect.get(validityState, key) === true) {
            (validationResults.errors as any)[key] = new ValidationError(currentRef.validationMessage)
          }
        }
      }

      props.renderData?.onValidated?.(validationResults)
      setErrors(validationResults)
    }

    currentRef.addEventListener(props.renderData?.validateOn ?? 'blur', validate)

    return () => {
      currentRef.removeEventListener(props.renderData?.validateOn ?? 'blur', validate)
    }
  }, [ref.current])

  if(props.renderComponent) {
    return <props.renderComponent {...props.renderData?.inputProps} inputRef={ref} defaultValue={props.control.value} errors={errors} />
  }

  return <input {...props.renderData?.inputProps} defaultValue={props.control.value} ref={ref as LegacyRef<HTMLInputElement>} />

}