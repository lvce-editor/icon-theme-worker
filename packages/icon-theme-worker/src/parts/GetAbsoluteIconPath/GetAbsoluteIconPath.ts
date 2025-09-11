import * as GetRemoteSrc from '../GetRemoteSrc/GetRemoteSrc.ts'
import * as IconThemeState from '../IconThemeState/IconThemeState.ts'
import * as PathSeparator from '../PathSeparator/PathSeparator.ts'

export const getAbsoluteIconPath = (iconTheme: any, icon: string): string => {
  if (!iconTheme) {
    return ''
  }
  const result = iconTheme.iconDefinitions[icon]
  const baseUrl = IconThemeState.getExtensionBaseUrl()
  if (result) {
    if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
      return `${baseUrl}${result}`
    }
    if (baseUrl.includes(PathSeparator.BackSlash)) {
      const extensionUri = baseUrl.replaceAll(PathSeparator.BackSlash, PathSeparator.Slash)
      return `/remote/${extensionUri}${result}`
    }
    return GetRemoteSrc.getRemoteSrc(`${baseUrl}${result}`)
  }
  return ''
}
