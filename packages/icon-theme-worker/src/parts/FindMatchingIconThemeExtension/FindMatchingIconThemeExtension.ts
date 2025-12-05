import { getExtensionRemoteUri } from '../GetExtensionRemoteUri/GetExtensionRemoteUri.ts'

// TODO handle case when extension json or properties are invalid / unexpected
export const findMatchingIconThemeExtension = (extensions: readonly any[], iconThemeId: string, platform: number): any => {
  for (const extension of extensions) {
    if (extension && extension.iconThemes) {
      for (const iconTheme of extension.iconThemes) {
        if (iconTheme.id === iconThemeId) {
          const extensionRemoteUri = getExtensionRemoteUri(extension.uri, extension.path, platform)
          return {
            ...iconTheme,
            extensionPath: extension.path,
            extensionRemoteUri,
            extensionUri: extension.uri,
          }
        }
      }
    }
  }
  return undefined
}
