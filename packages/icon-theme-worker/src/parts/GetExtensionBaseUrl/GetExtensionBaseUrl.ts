import { PlatformType } from '@lvce-editor/constants'

const fileProtocol = 'file://'

export const getExtensionBaseUrl = (webExtension: any, platform: number): string => {
  if (webExtension.uri && webExtension.uri.startsWith(fileProtocol) && platform === PlatformType.Remote) {
    const relative = webExtension.uri.slice(fileProtocol.length)
    return `/remote${relative}`
  }
  if (webExtension.uri && webExtension.uri.startsWith(fileProtocol) && platform === PlatformType.Electron) {
    // TODO for electron use `/file` urls
    const relative = webExtension.uri.slice(fileProtocol.length)
    return `/remote${relative}`
  }
  return webExtension.path
}
