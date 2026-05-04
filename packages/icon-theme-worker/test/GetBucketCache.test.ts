import { test, expect, beforeEach, jest } from '@jest/globals'
import * as GetBucketCache from '../src/parts/GetBucketCache/GetBucketCache.ts'

const originalStorageBuckets = (globalThis.navigator as any).storageBuckets

beforeEach(() => {
  ;(globalThis.navigator as any).storageBuckets = originalStorageBuckets
  jest.restoreAllMocks()
})

test('getBucketCache should open storage bucket with expected expiration and quota', async () => {
  const mockNow = 17 * 10 ** 12
  const twoWeeks = 14 * 24 * 60 * 60 * 10 ** 3
  const oneGigabyte = 10 ** 3 * 2 ** 10 * 2 ** 10
  const mockCache = {
    match: async (): Promise<undefined> => undefined,
    put: async (): Promise<void> => {},
  }
  let actualBucketName = ''
  let actualBucketOptions: { expires: number; quota: number } | undefined
  let actualCacheName = ''
  const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(mockNow)
  ;(globalThis.navigator as any).storageBuckets = {
    open: async (
      bucketName: string,
      options: { expires: number; quota: number },
    ): Promise<{ caches: { open: (cacheName: string) => Promise<typeof mockCache> } }> => {
      actualBucketName = bucketName
      actualBucketOptions = options
      return {
        caches: {
          open: async (cacheName: string): Promise<typeof mockCache> => {
            actualCacheName = cacheName
            return mockCache
          },
        },
      }
    },
  }

  await GetBucketCache.getBucketCache('test-bucket', 'test-cache')

  expect(dateNowSpy).toHaveBeenCalledTimes(1)
  expect(actualBucketName).toBe('test-bucket')
  expect(actualBucketOptions).toEqual({
    expires: mockNow + twoWeeks,
    quota: oneGigabyte,
  })
  expect(actualCacheName).toBe('test-cache')
})
