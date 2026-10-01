import type { IconThemeExtension } from '../IconThemeExtension/IconThemeExtension.ts'
import { getExtensionRemoteUri } from '../GetExtensionRemoteUri/GetExtensionRemoteUri.ts'

export interface MatchingIconThemeExtension {
  readonly extensionId: string | undefined
  readonly extensionPath: string
  readonly extensionRemoteUri: string
  readonly extensionUri: string
  readonly id: string
  readonly path: string
}

// TODO handle case when extension json or properties are invalid / unexpected
export const findMatchingIconThemeExtension = (
  extensions: readonly IconThemeExtension[],
  iconThemeId: string,
  platform: number,
): MatchingIconThemeExtension | undefined => {
  for (const extension of extensions) {
    if (extension && !extension.disabled && extension.iconThemes) {
      for (const iconTheme of extension.iconThemes) {
        if (iconTheme.id === iconThemeId) {
          const extensionRemoteUri = getExtensionRemoteUri(extension.uri || '', extension.path || '', platform)
          return {
            ...iconTheme,
            extensionId: extension.id,
            extensionPath: extension.path || '',
            extensionRemoteUri,
            extensionUri: extension.uri || '',
          }
        }
      }
    }
  }
  return undefined
}
