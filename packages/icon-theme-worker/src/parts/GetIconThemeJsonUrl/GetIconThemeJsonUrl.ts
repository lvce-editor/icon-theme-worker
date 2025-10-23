import { joinPath } from '../JoinPath/JoinPath.ts'

export const getIconThemeJsonUrl = (iconThemeExtension: any): string => {
  return joinPath(iconThemeExtension.extensionRemoteUri, iconThemeExtension.path)
}
