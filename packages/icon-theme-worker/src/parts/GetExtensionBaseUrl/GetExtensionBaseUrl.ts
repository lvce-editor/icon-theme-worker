import { PlatformType } from '@lvce-editor/constants'

export const getExtensionBaseUrl = (webExtension: any, platform: number): string => {
  if (webExtension.uri && webExtension.uri.startsWith('file://') && platform === PlatformType.Remote) {
    const relative = webExtension.uri.slice('file://'.length)
    return `/remote${relative}`
  }
  if (webExtension.uri && webExtension.uri.startsWith('file://') && platform === PlatformType.Electron) {
    // TODO for electron use `/file` urls
    const relative = webExtension.uri.slice('file://'.length)
    return `/remote${relative}`
  }
  return webExtension.path
}
