import { ValidationResults } from "@doughtnerd/qwizard-core";
import { ForwardedRef, ForwardRefExoticComponent, LegacyRef, MutableRefObject, RefAttributes } from "react";

/**
 * The default props for any component that will be used as a FormControl.
 */
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

/**
 * Utility type that adds an inputRef prop to the props of any component that will be used as a FormControl.
 */
export type WithInputRef<T extends object> = T & {
  inputRef: ForwardedRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
}