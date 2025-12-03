import { PlatformType } from '@lvce-editor/constants'
import type { LoadedIconTheme } from '../LoadedIconTheme/LoadedIconTheme.ts'
import * as FindMatchingIconThemeExtension from '../FindMatchingIconThemeExtension/FindMatchingIconThemeExtension.ts'
import { getIconThemeJsonUrl } from '../GetIconThemeJsonUrl/GetIconThemeJsonUrl.ts'
import * as GetIconThemeUrl from '../GetIconThemeUrl/GetIconThemeUrl.ts'
import { getJsonCached } from '../GetJsonCached/GetJsonCached.ts'

export const doGetIconThemeJson = async (
  extensions: readonly any[],
  iconThemeId: string,
  assetDir: string,
  platform: number,
  useCache: boolean,
): Promise<LoadedIconTheme | undefined> => {
  if (platform === PlatformType.Web) {
    const url = GetIconThemeUrl.getIconThemeUrl(assetDir, iconThemeId)
    const json = await getJsonCached(url, useCache)
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
  const iconThemeJson = await getJsonCached(iconThemeUrl, useCache)
  return {
    extensionPath: iconTheme.extensionPath,
    extensionRemoteUri: iconTheme.extensionRemoteUri || '',
    extensionUri: iconTheme.extensionUri || '',
    extensionBaseUrl: iconTheme.extensionRemoteUri || '',
    json: iconThemeJson,
  }
}
