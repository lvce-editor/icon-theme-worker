import { jest, test, expect, beforeEach } from '@jest/globals'
import { VError } from '@lvce-editor/verror'
import * as CacheWorker from '../src/parts/CacheWorker/CacheWorker.ts'
import { getIconThemeCacheKey } from '../src/parts/GetIconThemeCacheKey/GetIconThemeCacheKey.ts'
import * as GetJsonCached from '../src/parts/GetJsonCached/GetJsonCached.ts'

const cacheName = 'test-cache'
const bucketName = 'test-bucket'
const locationProtocol = 'https:'
const mockData = { name: 'test', value: 123 }

beforeEach(() => {
  jest.restoreAllMocks()
})

const mockFetch = (
  data: Readonly<typeof mockData> = mockData,
  etag: string = '"test-etag"',
  responseHeaders: Readonly<Record<string, string>> = {},
  headStatus: number = 200,
): jest.SpiedFunction<typeof fetch> => {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Jest's fetch signature uses mutable request init types.
  return jest.spyOn(globalThis, 'fetch').mockImplementation(async (_input: Readonly<RequestInfo | URL>, init?: Readonly<RequestInit>) => {
    if (init?.method === 'HEAD') {
      return new Response(null, {
        headers: etag ? { etag } : {},
        status: headStatus,
      })
    }
    return Response.json(data, { headers: responseHeaders })
  })
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Jest's spy type exposes mutable mock state.
const getRequestMethods = (fetchMock: Readonly<jest.SpiedFunction<typeof fetch>>): string[] => {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Jest exposes its call list as mutable tuples.
  return fetchMock.mock.calls.map(([, init]) => init?.method ?? 'GET')
}

const registerCacheMock = (handlers: Readonly<Record<string, (...args: readonly unknown[]) => unknown>>): { [Symbol.dispose]: () => void } => {
  return CacheWorker.registerMockRpc(handlers)
}

test('getJsonCached bypasses cache when useCache is false', async () => {
  const fetchMock = mockFetch()
  const cacheMock = registerCacheMock({})
  try {
    const result = await GetJsonCached.getJsonCached('https://example.com/api', false, bucketName, cacheName, locationProtocol)
    expect(result).toEqual(mockData)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][1]?.method).toBeUndefined()
  } finally {
    cacheMock[Symbol.dispose]()
  }
})

test('getJsonCached reads and writes the cache worker using the ETag key and namespace', async () => {
  const fetchMock = mockFetch(mockData, '"test-etag"', { 'x-test-header': 'preserved' })
  const storedItems = new Map<string, { body: ArrayBuffer; headers: Readonly<Record<string, string>>; status: number; statusText: string }>()
  const cacheMock = registerCacheMock({
    'Cache.getCacheStorageItem': (key: unknown, actualCacheName: unknown, actualBucketName: unknown, bucketOptions: unknown) => {
      expect(actualCacheName).toBe(cacheName)
      expect(actualBucketName).toBe(bucketName)
      expect(bucketOptions).toEqual({ expires: expect.any(Number), quota: 1000 * 1024 * 1024 })
      return storedItems.get(String(key)) || null
    },
    'Cache.setCacheStorageItem': (
      key: unknown,
      body: unknown,
      actualCacheName: unknown,
      headers: unknown,
      actualBucketName: unknown,
      bucketOptions: unknown,
    ) => {
      expect(actualCacheName).toBe(cacheName)
      expect(actualBucketName).toBe(bucketName)
      expect(bucketOptions).toEqual({ expires: expect.any(Number), quota: 1000 * 1024 * 1024 })
      storedItems.set(String(key), {
        body: body as ArrayBuffer,
        headers: headers as Readonly<Record<string, string>>,
        status: 200,
        statusText: 'OK',
      })
      return { success: true }
    },
  })
  try {
    const result1 = await GetJsonCached.getJsonCached('https://example.com/api', true, bucketName, cacheName, locationProtocol)
    const result2 = await GetJsonCached.getJsonCached('https://example.com/api', true, bucketName, cacheName, locationProtocol)
    const expectedKey = await getIconThemeCacheKey('"test-etag"', '-', locationProtocol)

    expect(result1).toEqual(mockData)
    expect(result2).toEqual(mockData)
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(getRequestMethods(fetchMock).filter((method) => method === 'GET')).toHaveLength(1)
    expect(storedItems.has(expectedKey)).toBe(true)
    expect(storedItems.get(expectedKey)?.headers).toEqual({
      'content-length': '1',
      'content-type': 'application/json',
      'x-test-header': 'preserved',
    })
  } finally {
    cacheMock[Symbol.dispose]()
  }
})

test('getJsonCached falls back to GET when a HEAD response has no ETag', async () => {
  const fetchMock = mockFetch(mockData, '')
  const cacheMock = registerCacheMock({
    'Cache.getCacheStorageItem': () => {
      throw new Error('cache should not be read')
    },
  })
  try {
    const result = await GetJsonCached.getJsonCached('https://example.com/api', true, bucketName, cacheName, locationProtocol)
    expect(result).toEqual(mockData)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(getRequestMethods(fetchMock)).toEqual(['HEAD', 'GET'])
  } finally {
    cacheMock[Symbol.dispose]()
  }
})

test('getJsonCached falls back to GET when a HEAD response is not ok', async () => {
  const fetchMock = mockFetch(mockData, '"test-etag"', {}, 404)
  const cacheMock = registerCacheMock({})
  try {
    const result = await GetJsonCached.getJsonCached('https://example.com/api', true, bucketName, cacheName, locationProtocol)
    expect(result).toEqual(mockData)
    expect(getRequestMethods(fetchMock)).toEqual(['HEAD', 'GET'])
  } finally {
    cacheMock[Symbol.dispose]()
  }
})

test('getJsonCached falls back to GET when cache RPC is unavailable', async () => {
  const fetchMock = mockFetch()
  const cacheMock = registerCacheMock({
    'Cache.getCacheStorageItem': () => {
      throw new Error('Cache worker unavailable')
    },
  })
  try {
    const result = await GetJsonCached.getJsonCached('https://example.com/api', true, bucketName, cacheName, locationProtocol)
    expect(result).toEqual(mockData)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(getRequestMethods(fetchMock).filter((method) => method === 'GET')).toHaveLength(1)
  } finally {
    cacheMock[Symbol.dispose]()
  }
})

test('getJsonCached falls back to GET when cached JSON is malformed', async () => {
  const fetchMock = mockFetch()
  const cacheMock = registerCacheMock({
    'Cache.getCacheStorageItem': () => ({
      body: new TextEncoder().encode('{').buffer,
      headers: { 'Content-Type': 'application/json' },
      status: 200,
      statusText: 'OK',
    }),
  })
  try {
    const result = await GetJsonCached.getJsonCached('https://example.com/api', true, bucketName, cacheName, locationProtocol)
    expect(result).toEqual(mockData)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  } finally {
    cacheMock[Symbol.dispose]()
  }
})

test('getJsonCached falls back to GET when the cache worker reports a failed write', async () => {
  const fetchMock = mockFetch()
  const cacheMock = registerCacheMock({
    'Cache.getCacheStorageItem': () => null,
    'Cache.setCacheStorageItem': () => ({
      errorCode: 'CACHE_STORAGE_WRITE_FAILED',
      errorMessage: 'quota exceeded',
      success: false,
    }),
  })
  try {
    const result = await GetJsonCached.getJsonCached('https://example.com/api', true, bucketName, cacheName, locationProtocol)
    expect(result).toEqual(mockData)
    expect(fetchMock).toHaveBeenCalledTimes(3)
  } finally {
    cacheMock[Symbol.dispose]()
  }
})

test('getJsonCached preserves the VError from the network fallback', async () => {
  jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
    throw new Error('Network error')
  })
  const cacheMock = registerCacheMock({})
  try {
    await expect(GetJsonCached.getJsonCached('https://example.com/api', false, bucketName, cacheName, locationProtocol)).rejects.toThrow(VError)
  } finally {
    cacheMock[Symbol.dispose]()
  }
})
