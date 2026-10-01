import type { ICache } from '../ICache/ICache.ts'
import { getBucketCache } from '../GetBucketCache/GetBucketCache.ts'
import { noopCache } from '../NoopCache/NoopCache.ts'
import { supportsStorageBuckets } from '../SupportsStorageBuckets/SupportsStorageBuckets.ts'

export const getCacheInternal = async (bucketName: string, cacheName: string): Promise<ICache> => {
  if (!supportsStorageBuckets()) {
    return noopCache
  }
  return getBucketCache(bucketName, cacheName)
}
