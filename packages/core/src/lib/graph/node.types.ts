export type NodeId = `#${string}`

export type DataSourceId = `@${string}`

export type SubmitToConfig = { [key: string]: DataSourceId } | DataSourceId

export type ValidateOnConfig = 'change' | 'blur' | 'submit'

export type ValidatorName = string

export type ValidatorArgs = Array<string | number | boolean>

export type ValidatorConfig = [ValidatorName, ValidatorArgs] | [ValidatorName] | DataSourceId

export type Metadata = { [key: string]: string | number | boolean } | DataSourceId

export type GraphNode = EntryNode | TextInputNode | SelectNode | RadioGroupNode


export type CustomGraphNode<T> = {
  id: NodeId
  type: string
  data: T
  validInboundEdges: Array<string>
  validOutboundEdges: Array<string>
}



export type EntryNode = {
  id: NodeId
  type: 'entry'
  data: any
}



export type SectionNode = {
  id: NodeId
  type: 'section'
  data: SectionNodeData
}

export type SectionNodeData = {
  name: string
  description: string
  validateOn: ValidateOnConfig
  submitTo: SubmitToConfig
}


export type TextInputNode = {
  id: NodeId
  type: 'textInput',
  data: TextNodeData
}

export type TextNodeData = {
  name: string
  label: string
  placeholder: string
  validators: ValidatorConfig[]
  metadata: Metadata
}

export type SelectNodeData = {
  name: string
  label: string
  options: {value: string | number, label: string}[] | DataSourceId
  value: string | number
  validators: ValidatorConfig[]
  metadata: Metadata
}

export type SelectNode = {
  id: NodeId
  type: 'select'
  data: SelectNodeData
}









export type RadioGroupNodeData = {
  name: string
  label: string
  options: {value: string | number, label: string} | DataSourceId
  value: string | number
  validators: ValidatorConfig[]
  metadata: Metadata
}

export type RadioGroupNode = {
  id: string
  type: 'radioGroup'
  data: RadioGroupNodeData
}