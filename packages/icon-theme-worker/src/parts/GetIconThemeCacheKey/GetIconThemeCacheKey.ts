import { hash } from '../Hash/Hash.ts'
import { supportsNormalCacheKey } from '../SupportsNormalCacheKey/SupportsNormalCacheKey.ts'

const getMarkdownCacheHash = async (etag: string): Promise<string> => {
  const contents = `${etag}:`
  return hash(contents)
}

export const getIconThemeCacheKey = async (etag: string): Promise<string> => {
  const locationProtocol = location.protocol
  const hash = await getMarkdownCacheHash(etag)
  if (supportsNormalCacheKey(locationProtocol)) {
    return `/icon-themes/${hash}`
  }
  // workaround for electron bug
  return `https://-/icon-themes/${hash}`
}
