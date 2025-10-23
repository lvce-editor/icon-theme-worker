import { PlatformType } from '@lvce-editor/constants'

export const getExtensionRemoteUri = (extensionUri: string, extensionPath: string, platform: number): string => {
  if (platform === PlatformType.Remote || (platform === PlatformType.Electron && extensionUri && extensionUri.startsWith('file://'))) {
    const rest = extensionUri.slice('file://'.length)
    const remoteUrl = `/remote${rest}`
    return remoteUrl
  }
  return extensionUri || extensionPath || ''
}
