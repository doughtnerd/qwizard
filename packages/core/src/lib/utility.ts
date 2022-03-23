export function isEmptyObject(obj: Record<string, never>): boolean {
  for(const key in obj) {
    return false
  }
  return true
}