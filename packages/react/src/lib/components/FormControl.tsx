import { FormControlWithValidators as FormControlModel, validateFormControl, ValidationError, ValidationResults } from '@doughtnerd/qwizard-core';
import React, { LegacyRef } from 'react';
import { FormControlInputEvents } from '../types/input-config.types';
import { DefaultInputProps, WithInputRef } from '../types/withInputRef.type';

export type FormControlProps = {
  renderComponent?: (props: WithInputRef<DefaultInputProps & any>) => JSX.Element 
  renderData: {
    inputProps?: Record<string | number | symbol, any>
    validateOn?: FormControlInputEvents
    enableNativeValidation?: boolean
    onValidated?: (validationResults: ValidationResults) => void
  }
}

export type FormControlConfig = FormControlModel & FormControlProps

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