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

export const getIconThemeCacheKey = async (etag: string): Promise<string> => {
  const locationProtocol = location.protocol
  const hash = getCacheHash(etag)
  if (supportsNormalCacheKey(locationProtocol)) {
    return `/icon-themes/${hash}`
  }
  // workaround for electron bug
  return `https://-/icon-themes/${hash}`
}
