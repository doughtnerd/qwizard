
const Rules: Record<string, {inbound: string[], outbound: string[]}> = {}


export function validateConnection(fromType: string, toType: string): void {
  if (Rules[fromType]) {
    const {outbound} = Rules[fromType]

    if (!outbound.includes(toType)) {
      throw new Error(`Invalid connection from ${fromType} to ${toType}`)
    }
    
  }

  if (Rules[toType]) {
    const {inbound} = Rules[toType]

    if (!inbound.includes(fromType)) {
      throw new Error(`Invalid connection from ${fromType} to ${toType}`)
    }
  }
}

export function setRule(nodeType: string, inbound: string[], outbound: string[]): void {
  Rules[nodeType] = {inbound, outbound}
}