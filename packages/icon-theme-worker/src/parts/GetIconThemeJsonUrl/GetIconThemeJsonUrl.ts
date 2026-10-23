import type { MatchingIconThemeExtension } from '../FindMatchingIconThemeExtension/FindMatchingIconThemeExtension.ts'
import { joinPath } from '../JoinPath/JoinPath.ts'

export const getIconThemeJsonUrl = (iconThemeExtension: MatchingIconThemeExtension): string => {
  return joinPath(iconThemeExtension.extensionRemoteUri, iconThemeExtension.path)
}
