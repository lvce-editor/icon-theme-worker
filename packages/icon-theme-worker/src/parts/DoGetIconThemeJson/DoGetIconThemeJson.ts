import { PlatformType } from '@lvce-editor/constants'
import type { LoadedIconTheme } from '../LoadedIconTheme/LoadedIconTheme.ts'
import * as FindMatchingIconThemeExtension from '../FindMatchingIconThemeExtension/FindMatchingIconThemeExtension.ts'
import { getIconThemeJsonUrl } from '../GetIconThemeJsonUrl/GetIconThemeJsonUrl.ts'
import * as GetIconThemeUrl from '../GetIconThemeUrl/GetIconThemeUrl.ts'
import * as GetJson from '../GetJson/GetJson.ts'

export const doGetIconThemeJson = async (
  extensions: readonly any[],
  iconThemeId: string,
  assetDir: string,
  platform: number,
): Promise<LoadedIconTheme | undefined> => {
  if (platform === PlatformType.Web) {
    const url = GetIconThemeUrl.getIconThemeUrl(assetDir, iconThemeId)
    const json = await GetJson.getJson(url)
    return {
      extensionBaseUrl: `${assetDir}/extensions/builtin.${iconThemeId}`,
      extensionRemoteUri: `${assetDir}/extensions/builtin.${iconThemeId}`,
      extensionPath: `${assetDir}/extensions/builtin.${iconThemeId}`,
      extensionUri: `${assetDir}/extensions/builtin.${iconThemeId}`,
      json,
    }
  }
  const iconTheme = FindMatchingIconThemeExtension.findMatchingIconThemeExtension(extensions, iconThemeId, platform)
  if (!iconTheme) {
    return undefined
  }
  const iconThemeUrl = getIconThemeJsonUrl(iconTheme)
  const iconThemeJson = await GetJson.getJson(iconThemeUrl)
  return {
    extensionPath: iconTheme.extensionPath,
    extensionRemoteUri: iconTheme.extensionRemoteUri || '',
    extensionUri: iconTheme.extensionUri || '',
    extensionBaseUrl: iconTheme.extensionRemoteUri || '',
    json: iconThemeJson,
  }
}
