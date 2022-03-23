import { ValidationErrors } from "@qwizard/core"

export type FormControlInputEvents = 'input' | 'change' | 'blur'

export type FormArrayRenderFn = (props: {children: React.ReactNode, errors: ValidationErrors, hasValidated: boolean}) => JSX.Element

export type FormGroupRenderFn = (props: {children: React.ReactNode, errors: ValidationErrors, hasValidated: boolean}) => JSX.Element
