import { getCache } from '../GetCache/GetCache.ts'
import { getIconThemeCacheKey } from '../GetIconThemeCacheKey/GetIconThemeCacheKey.ts'
import { getJson } from '../GetJson/GetJson.ts'
import { putInCache } from '../PutInCache/PutInCache.ts'

export const getJsonCached = async (
  url: string,
  useCache: boolean,
  bucketName: string,
  cacheName: string,
  locationProtocol: string,
  iconThemeId = '-',
  etag = '',
): Promise<any> => {
  if (!useCache) {
    return getJson(url)
  }

  try {
    let resolvedEtag = etag
    if (!resolvedEtag) {
      const headResponse = await fetch(url, { method: 'HEAD' })
      if (!headResponse.ok) {
        throw new Error(headResponse.statusText)
      }

      resolvedEtag = headResponse.headers.get('etag') || ''
      if (!resolvedEtag) {
        return getJson(url)
      }
    }

    const cache = await getCache(bucketName, cacheName)
    const cacheKey = await getIconThemeCacheKey(resolvedEtag, iconThemeId, locationProtocol)
    const cachedResponse = await cache.match(cacheKey)

    if (cachedResponse) {
      return await cachedResponse.json()
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    await putInCache(cacheKey, response.clone(), cache)
    return await response.json()
  } catch {
    return getJson(url)
  }
}
