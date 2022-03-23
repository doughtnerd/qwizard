// import { Edge, StandardEdge } from "./edge.types"
// import { EntryNode, GraphNode, SectionNode, TextInputNode } from "./node.types"

// type Start = {
//   id: string
//   name: string
//   description: string
//   start: string
//   sections: Section[]
// }

// type Section = {
//   id: string
//   name: string
//   description: string
//   validateOn: string,
//   submitTo: {
//     [key: string]: string
//   }
//   questions: Question[]
// }

// type Question = {
//   id: string
//   type: string
//   name: string
//   options?: string
//   validators: Array<[string]> | Array<[string, Array<string | number>]>
//   metadata: { [key: string]: string | number | boolean }
// }

// type V1GraphConfig = {
//   version: 1,
//   questionnaire: Start
// }

// const config = {
//   nodes: [
//     {
//       id: '#myEntryNode',
//       type: 'entry',
//       data: {}
//     } as EntryNode,
//     {
//       id: '#mySectionNode',
//       type: 'section',
//       data: {
//         name: 'mySection',
//         description: 'mySectionDescription',
//         validateOn: 'submit',
//         submitTo: '@submitMyForm'
//       }
//     } as SectionNode,
//     {
//       id: '#myTextInputNode',
//       type: 'textInput',
//       data: {
//         label: 'myTextInputLabel',
//         name: 'myTextInputName',
//         placeholder: 'myTextInputPlaceholder',
//         metadata: {},
//         validators: [
//           ['notEmpty']
//         ]
//       }
//     } as TextInputNode
//   ],
//   edges: [
//     {
//       a: '#myEntryNode',
//       b: '#mySectionNode',
//       type: 'standard'
//     } as StandardEdge,
//     {
//       a: '#mySectionNode',
//       b: '#myTextInputNode',
//       type: 'standard'
//     } as StandardEdge
//   ]
// }

// class Graph {

//   constructor(private nodes: GraphNode[], edges: Edge[]) {}
// }

export {}