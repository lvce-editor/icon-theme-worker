import * as CacheWorker from '../CacheWorker/CacheWorker.ts'
import { getIconThemeCacheKey } from '../GetIconThemeCacheKey/GetIconThemeCacheKey.ts'
import { getJson } from '../GetJson/GetJson.ts'
import { parseContentLength } from '../ParseContentLength/ParseContentLength.ts'

const getBucketOptions = (): { expires: number; quota: number } => {
  const twoWeeks = 14 * 24 * 60 * 60 * 1000
  return {
    expires: Date.now() + twoWeeks,
    quota: 1000 * 1024 * 1024,
  }
}

export const getJsonCached = async (
  url: string,
  useCache: boolean,
  bucketName: string,
  cacheName: string,
  locationProtocol: string,
  iconThemeId = '-',
  etag = '',
): Promise<unknown> => {
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

    const cacheKey = await getIconThemeCacheKey(resolvedEtag, iconThemeId, locationProtocol)
    const bucketOptions = getBucketOptions()
    const cachedResponse = await CacheWorker.invoke<CacheWorker.CacheStorageItem | null>(
      'Cache.getCacheStorageItem',
      cacheKey,
      cacheName,
      bucketName,
      bucketOptions,
    )

    if (cachedResponse) {
      const response = new Response(cachedResponse.body, {
        headers: cachedResponse.headers,
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
      })
      return await response.json()
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const body = await response.clone().arrayBuffer()
    const responseHeaders = new Headers(response.headers)
    responseHeaders.set('content-length', String(parseContentLength(response)))
    if (!responseHeaders.has('content-type')) {
      responseHeaders.set('content-type', 'application/json')
    }
    const headers = Object.fromEntries(responseHeaders.entries())
    const writeResult = await CacheWorker.invoke<CacheWorker.CacheStorageWriteResult>(
      'Cache.setCacheStorageItem',
      cacheKey,
      body,
      cacheName,
      headers,
      bucketName,
      bucketOptions,
    )
    if (!writeResult.success) {
      throw new Error(writeResult.errorMessage)
    }
    return await response.json()
  } catch {
    return getJson(url)
  }
}
