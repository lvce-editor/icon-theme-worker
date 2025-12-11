import { supportsNormalCacheKey } from '../SupportsNormalCacheKey/SupportsNormalCacheKey.ts'

const RE_WEAK = /^W\/"(.*)"$/
const RE_STRONG = /^"(.*)"$/

const getCacheHash = (etag: string): string => {
  const weakMatch = etag.match(RE_WEAK)
  if (weakMatch) {
    return weakMatch[1]
  }
  const strongMatch = etag.match(RE_STRONG)
  if (strongMatch) {
    return strongMatch[1]
  }
  return etag
}

const getPrefix = (locationProtocol: string): string => {
  if (supportsNormalCacheKey(locationProtocol)) {
    return ``
  }
  // workaround for electron bug
  return `https://-`
}

export const getIconThemeCacheKey = async (etag: string, iconThemeId: string, commit: string): Promise<string> => {
  const locationProtocol = location.protocol
  const hash = getCacheHash(etag)
  const prefix = getPrefix(locationProtocol)
  return `${prefix}/icon-themes/${iconThemeId}/${commit}/${hash}`
}
