import { doGetIconThemeJson } from '../DoGetIconThemeJson/DoGetIconThemeJson.ts'
import * as IconThemeState from '../IconThemeState/IconThemeState.ts'

// TODO use cache storage or indexeddb for caching color theme
// use unique cache key based on content hash and/or commit hash
// when it's not cached, fetch should be quite fast
// though one needs to take care to not allow this worker or any worker
// read arbitrary files on disk

// TODO not sure whether this worker should query all extensions
// or the extension host worker or another worker

export const loadIconThemeJson = async (extensions: readonly any[], iconThemeId: string, assetDir: string, platform: number): Promise<any> => {
  if (!iconThemeId) {
    return ''
  }
  const json = await doGetIconThemeJson(extensions, iconThemeId, assetDir, platform)
  IconThemeState.setTheme(json)
  return json
}
