import type { GraphNode, NodeId } from "./node.types";

export type Edge<T extends string, K> = StandardEdge | CustomEdge<T, K>;

export type CustomEdge<T extends string, K = undefined> = {
  type: T
  a: NodeId,
  b: NodeId,
  data: K
}

export type StandardEdge = CustomEdge<'standard'>

export function isEdgeType<T extends Edge<string, unknown>>(edge: Edge<string, unknown>, edgeType: string): edge is T {
  return edge.type === edgeType
}

export function isStandardEdge(edge: Edge<never, never>): edge is StandardEdge {
  return isEdgeType<StandardEdge>(edge, 'standard')
}

export type ConditionalEdge = CustomEdge<'conditional', <NodeAType extends GraphNode<string, unknown>, NodeBType extends GraphNode<string, unknown>>(a: NodeAType, b: NodeBType) => boolean>