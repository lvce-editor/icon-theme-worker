import * as FindMatchingIconThemeExtension from '../FindMatchingIconThemeExtension/FindMatchingIconThemeExtension.ts'
import { getExtensionBaseUrl } from '../GetExtensionBaseUrl/GetExtensionBaseUrl.ts'
import * as GetIconThemeUrl from '../GetIconThemeUrl/GetIconThemeUrl.ts'
import * as GetJson from '../GetJson/GetJson.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

export const doGetIconThemeJson = async (
  extensions: readonly any[],
  iconThemeId: string,
  assetDir: string,
  platform: number,
  locationProtocol: string,
): Promise<any> => {
  if (platform === PlatformType.Web) {
    const url = GetIconThemeUrl.getIconThemeUrl(assetDir, iconThemeId)
    const json = await GetJson.getJson(url)
    return {
      json,
      extensionPath: `${assetDir}/extensions/builtin.${iconThemeId}`,
    }
  }
  for (const webExtension of extensions) {
    if (webExtension.iconThemes) {
      for (const iconTheme of webExtension.iconThemes) {
        // TODO handle error when icon theme path is not of type string
        const baseUrl = getExtensionBaseUrl(webExtension, locationProtocol)
        const iconThemeUrl = `${baseUrl}/${iconTheme.path}`
        const json = await GetJson.getJson(iconThemeUrl)
        return {
          json,
          extensionPath: webExtension.path,
        }
      }
    }
  }
  const iconTheme = FindMatchingIconThemeExtension.findMatchingIconThemeExtension(extensions, iconThemeId)
  if (!iconTheme) {
    return undefined
  }
  const iconThemePath = `${iconTheme.extensionPath}/${iconTheme.path}`
  const iconThemeJson = await GetJson.getJson(iconThemePath)
  return {
    extensionPath: iconTheme.extensionPath,
    json: iconThemeJson,
  }
}
