import { ValidationErrors } from "@doughtnerd/qwizard-core"

/**
 * Names of events that can be emitted by the input component.
 * Used to determine which events to listen to for validation.
 */
export type FormControlInputEvents = 'input' | 'change' | 'blur'

/**
 * Render function for a FormArray. Can be used with functional components.
 * @param props The props to pass to the FormArray rendering function 
 * @param props.children The child react elements to render
 * @param props.errors The errors that are associated with the FormArray component
 * @param props.hasValidated Whether or not the FormArray has been validated at least once
 */
export type FormArrayRenderFn = (props: {children: React.ReactNode, errors: ValidationErrors, hasValidated: boolean}) => JSX.Element

/**
 * Render function for a FormGroup. Can be used with functional components.
 * @param props The props to pass to the FormGroup rendering function 
 * @param props.children The child react elements to render
 * @param props.errors The errors that are associated with the FormGroup component
 * @param props.hasValidated Whether or not the FormGroup has been validated at least once
 */
export type FormGroupRenderFn = (props: {children: React.ReactNode, errors: ValidationErrors, hasValidated: boolean}) => JSX.Element
