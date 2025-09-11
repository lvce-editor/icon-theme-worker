import * as IconThemeState from '../IconThemeState/IconThemeState.ts'

export const getAbsoluteIconPath = (iconTheme: any, icon: string): string => {
  if (!iconTheme) {
    return ''
  }
  const result = iconTheme.iconDefinitions[icon]
  const baseUrl = IconThemeState.getExtensionBaseUrl()
  if (result && baseUrl) {
    return `${baseUrl}${result}`
  }
  return ''
}
