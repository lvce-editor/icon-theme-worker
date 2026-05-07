import type { ICache } from '../ICache/ICache.ts'

export const getBucketCache = async (bucketName: string, cacheName: string): Promise<ICache> => {
  const twoWeeks = 14 * 24 * 60 * 60 * 1000
  // @ts-ignore
  const bucket = await navigator.storageBuckets.open(bucketName, {
    expires: Date.now() + twoWeeks,
    quota: 1000 * 1024 * 1024, // 1 GB
  })
  const cache = (await bucket.caches.open(cacheName)) as Cache
  return cache
}
