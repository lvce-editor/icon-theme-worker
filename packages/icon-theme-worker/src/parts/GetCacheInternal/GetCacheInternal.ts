import type { ICache } from '../ICache/ICache.ts'
import { noopCache } from '../NoopCache/NoopCache.ts'
import { supportsStorageBuckets } from '../SupportsStorageBuckets/SupportsStorageBuckets.ts'

export const getCacheInternal = async (bucketName: string, cacheName: string): Promise<ICache> => {
  if (!supportsStorageBuckets()) {
    return noopCache
  }
  const twoWeeks = 14 * 24 * 60 * 60 * 1000
  // @ts-ignore
  const bucket = await navigator.storageBuckets.open(bucketName, {
    quota: 1000 * 1024 * 1024, // 1 GB
    expires: Date.now() + twoWeeks,
  })
  const cache = (await bucket.caches.open(cacheName)) as Cache
  return cache
}
