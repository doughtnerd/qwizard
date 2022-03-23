import { ForwardedRef, InputHTMLAttributes } from "react"
import { WithInputRef, DefaultInputProps } from "@qwizard/react"

export type MyInputProps = WithInputRef<
  InputHTMLAttributes<HTMLInputElement> &
  { labelText: string } &
  DefaultInputProps
>

export function MyInput({ inputRef, defaultValue, errors, labelText, ...inputProps }: MyInputProps): JSX.Element {
  const errorMessageMap = errors.errors
  const errorsText = Object.values(errorMessageMap)?.[0]?.message

  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight:'64px'}}>
      <label htmlFor={inputProps.id} style={{fontWeight: 'bold', fontSize: '14px'}}>{labelText}</label>
      <input defaultValue={defaultValue} ref={inputRef as ForwardedRef<HTMLInputElement>} {...inputProps} />
      <sub style={{ color:'red', fontSize: '10px' }} hidden={errorsText === undefined}>{errorsText} </sub>
    </div>
  )
}