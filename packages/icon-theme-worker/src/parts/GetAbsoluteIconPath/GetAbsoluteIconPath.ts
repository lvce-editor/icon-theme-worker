import type { IconTheme } from '../IconTheme/IconTheme.ts'

export const getAbsoluteIconPath = (iconTheme: IconTheme | null | undefined, icon: string, baseUrl: string): string => {
  if (!iconTheme) {
    return ''
  }
  const result = iconTheme.iconDefinitions?.[icon]
  if (result && baseUrl) {
    return `${baseUrl}${result}`
  }
  return ''
}
