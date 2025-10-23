import { PlatformType } from '@lvce-editor/constants'
import * as FindMatchingIconThemeExtension from '../FindMatchingIconThemeExtension/FindMatchingIconThemeExtension.ts'
import { getIconThemeJsonUrl } from '../GetIconThemeJsonUrl/GetIconThemeJsonUrl.ts'
import * as GetIconThemeUrl from '../GetIconThemeUrl/GetIconThemeUrl.ts'
import * as GetJson from '../GetJson/GetJson.ts'

export const doGetIconThemeJson = async (extensions: readonly any[], iconThemeId: string, assetDir: string, platform: number): Promise<any> => {
  if (platform === PlatformType.Web) {
    const url = GetIconThemeUrl.getIconThemeUrl(assetDir, iconThemeId)
    const json = await GetJson.getJson(url)
    return {
      json,
      extensionPath: `${assetDir}/extensions/builtin.${iconThemeId}`,
      extensionBaseUrl: `${assetDir}/extensions/builtin.${iconThemeId}`,
    }
  }
  const iconTheme = FindMatchingIconThemeExtension.findMatchingIconThemeExtension(extensions, iconThemeId, platform)
  if (!iconTheme) {
    return undefined
  }
  const iconThemeUrl = getIconThemeJsonUrl(iconTheme)
  const iconThemeJson = await GetJson.getJson(iconThemeUrl)
  return {
    extensionUri: iconTheme.extensionUri || '',
    extensionRemoteUri: iconTheme.extensionRemoteUri || '',
    extensionPath: iconTheme.extensionPath,
    json: iconThemeJson,
  }
}
