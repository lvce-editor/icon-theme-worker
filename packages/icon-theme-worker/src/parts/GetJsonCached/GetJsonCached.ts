import { getCache } from '../GetCache/GetCache.ts'
import { getJson } from '../GetJson/GetJson.ts'
import { putInCache } from '../PutInCache/PutInCache.ts'

export const getJsonCached = async (
  url: string,
  useCache: boolean,
  bucketName: string,
  cacheName: string,
): Promise<any> => {
  if (!useCache) {
    return getJson(url)
  }

  try {
    const cache = await getCache(bucketName, cacheName)
    const cachedResponse = await cache.match(url)
    
    if (cachedResponse) {
      const clonedResponse = cachedResponse.clone()
      return await clonedResponse.json()
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    await putInCache(url, response.clone(), cache)
    return await response.json()
  } catch {
    return getJson(url)
  }
}
