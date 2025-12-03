import type { ICache } from '../ICache/ICache.ts'
import { getCacheInternal } from '../GetCacheInternal/GetCacheInternal.ts'

export type { ICache } from '../ICache/ICache.ts'

const cachedCaches: Record<string, Promise<ICache>> = Object.create(null)

export const getCache = (bucketName: string, cacheName: string): Promise<ICache> => {
  if (!(cacheName in cachedCaches)) {
    cachedCaches[cacheName] = getCacheInternal(bucketName, cacheName)
  }
  return cachedCaches[cacheName]
}

export const resetCache = (): void => {
  for (const key in cachedCaches) {
    delete cachedCaches[key]
  }
}
