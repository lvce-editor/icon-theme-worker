import * as PlatformType from '../PlatformType/PlatformType.ts'

export const getExtensionBaseUrl = (webExtension: any, platform: number): string => {
  // TODO support file scheme and application scheme
  if (webExtension.uri && webExtension.uri.startsWith('file://') && platform === PlatformType.Web) {
    const relative = webExtension.uri.slice('file://'.length)
    return `/remote${relative}`
  }
  return webExtension.path
}
