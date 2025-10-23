import { joinPath } from '../JoinPath/JoinPath.ts'

export const getIconThemeJsonUrl = (iconThemeExtension: any, locationProtocol: string, locationHost: string): string => {
  const relativePath = iconThemeExtension.path
  if (iconThemeExtension && iconThemeExtension.extensionUri && iconThemeExtension.extensionUri.startsWith('file://')) {
    const rest = `${iconThemeExtension.extensionUri}`.slice('file://'.length)
    const protocol = locationProtocol
    const path = joinPath('/remote', rest, relativePath)
    return `${protocol}://${locationHost}${path}`
  }
  const rest = iconThemeExtension.extensionPath
  const path = joinPath(rest, relativePath)
  return `${iconThemeExtension.extensionPath}/${path}`
}
