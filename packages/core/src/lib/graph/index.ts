import { Maybe } from "..";
import { Edge } from "./edge.types";
import type { GraphNode, NodeId } from "./node.types";

type Graph = {
  nodes: {
    [key: string]: GraphNode<string, unknown>
  }
  incomingEdges: {
    [key: string]: {
      from: NodeId,
      edge: Edge<string, unknown>
    }
  }
  outgoingEdges: {
    [key: string]: {
      to: NodeId,
      edge: Edge<string, unknown>
    }
  }
}

function addNode(graph: Graph, node: GraphNode<string, unknown>): Graph {
  graph.nodes[node.id] = node
  return graph
}

function hasNode(graph: Graph, nodeId: NodeId): boolean {
  return !!graph.nodes[nodeId]
}

function getNode(graph: Graph, nodeId: NodeId): Maybe<GraphNode<string, unknown>> {
  return graph.nodes[nodeId]
}

function connect(graph: Graph, a: NodeId, b: NodeId, edge: Edge<string, unknown>): Graph {
  if(!hasNode(graph, a)) {
    throw new Error(`Node ${a} does not exist`)
  }
  if(!hasNode(graph, b)) {
    throw new Error(`Node ${b} does not exist`)
  }
  graph.outgoingEdges[a] = {
    to: b,
    edge: edge
  }
  graph.incomingEdges[b] = {
    from: a,
    edge: edge
  }
  return graph
}
