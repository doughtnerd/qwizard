import type { AbstractControlWithValidators } from ".."

export type NodeId = `#${string}`

// export type DataSourceId = `@${string}`

// export type SubmitToConfig = { [key: string]: DataSourceId } | DataSourceId

// export type ValidatorName = string

// export type ValidatorArgs = Array<string | number | boolean>

// export type ValidatorConfig = [ValidatorName, ValidatorArgs] | [ValidatorName] | DataSourceId

export type Metadata = { [key: string]: string | number | boolean } // | DataSourceId

export type GraphNode<T extends string, K> = FormNode | CustomNode<T, K>

export type CustomNode<Type extends string, DataType> = {
  id: NodeId
  type: Type
  data: DataType
  metadata: Metadata
}

export type FormNode = CustomNode<'form', AbstractControlWithValidators>
