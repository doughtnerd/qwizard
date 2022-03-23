import { DataSourceId, NodeId } from "./node.types";

export type Edge = StandardEdge | ConditionalEdge

export type Operator = 'EQ' | 'NEQ' | 'LT' | 'GT'

export type StandardEdge = {
  type: 'standard',
  a: NodeId,
  b: NodeId
}

export function isStandardEdge(edge: Edge): edge is StandardEdge {
  return edge.type === 'standard';
}

export function createStandardEdge(a: NodeId, b: NodeId): StandardEdge {
  return { type: 'standard', a, b }
}

export type ConditionalEdge = {
  type: 'conditional',
  a: NodeId,
  b: NodeId,
  condition: Operator | DataSourceId
}
