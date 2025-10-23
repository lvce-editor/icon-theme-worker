import * as Character from '../Character/Character.ts'

export const joinPath = (...parts: readonly string[]): string => {
  let merged = ''
  for (const part of parts) {
    if (merged.endsWith(Character.Slash) && part.startsWith(Character.Slash)) {
      merged += part.slice(1)
    } else if (!merged.endsWith(Character.Slash) && !part.startsWith(Character.Slash)) {
      merged += Character.Slash + part
    } else {
      merged += part
    }
  }
  return merged
}
