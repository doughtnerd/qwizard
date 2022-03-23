import { ValidationResults } from "@qwizard/core";
import { ForwardedRef, ForwardRefExoticComponent, LegacyRef, MutableRefObject, RefAttributes } from "react";

export type DefaultInputProps = { 
  defaultValue: number | string | readonly string[] | undefined
  errors: ValidationResults
}

export type RefType<T extends DefaultInputProps = DefaultInputProps> = 
  React.MutableRefObject<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | 
  MutableRefObject<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> |
  LegacyRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> |
  ForwardRefExoticComponent<T & RefAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>> |
  ForwardedRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;


export type WithInputRef<T extends object> = T & {
  inputRef: ForwardedRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
}