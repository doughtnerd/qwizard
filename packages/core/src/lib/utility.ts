
/**
 * Checks if an object is empty.
 * @param obj The object to check
 * @returns Whether or not the object is empty
 */
export function isEmptyObject(obj: Record<string, never>): boolean {
  for(const key in obj) {
    return false
  }
  return true
}