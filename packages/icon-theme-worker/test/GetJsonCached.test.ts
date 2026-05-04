/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { test, expect, beforeEach } from '@jest/globals'
import { VError } from '@lvce-editor/verror'
import * as GetCache from '../src/parts/GetCache/GetCache.ts'
import * as GetJsonCached from '../src/parts/GetJsonCached/GetJsonCached.ts'

const originalFetch = globalThis.fetch
const originalStorageBuckets = (globalThis.navigator as any).storageBuckets
const originalLocation = (globalThis as any).location

beforeEach(() => {
  globalThis.fetch = originalFetch
  ;(globalThis.navigator as any).storageBuckets = originalStorageBuckets
  ;(globalThis as any).location = originalLocation || { protocol: 'https:' }
  GetCache.resetCache()
})

const createMockCache = (): Cache => {
  const cache = new Map<string, Response>()
  return {
    async add(): Promise<void> {},
    async addAll(): Promise<void> {},
    async delete(): Promise<boolean> {
      return false
    },
    async keys(): Promise<ReadonlyArray<Request>> {
      return []
    },
    async match(url: RequestInfo | URL): Promise<Response | undefined> {
      const urlString = getUrlString(url)
      return cache.get(urlString)
    },
    async matchAll(): Promise<ReadonlyArray<Response>> {
      return [...cache.values()]
    },
    async put(url: RequestInfo | URL, response: Response): Promise<void> {
      const urlString = getUrlString(url)
      cache.set(urlString, response)
    },
  }
}

const setupMockStorageBuckets = (mockCache: Cache): void => {
  ;(globalThis.navigator as any).storageBuckets = {
    async open(): Promise<{
      caches: {
        open(): Promise<Cache>
      }
    }> {
      return {
        caches: {
          async open(): Promise<Cache> {
            return mockCache
          },
        },
      }
    },
  }
}

type MockResponse = Response | (() => Response) | (() => never)

type MockFetchOptions = {
  getResponse?: MockResponse
  onCall?: (input: RequestInfo | URL, init?: RequestInit) => Response | undefined
  urlMatcher?: (url: string) => {
    getResponse?: MockResponse
  }
}

const getUrlString = (input: RequestInfo | URL): string => {
  if (typeof input === 'string') {
    return input
  }
  if (input instanceof URL) {
    return input.toString()
  }
  return input.url
}

const getRequestMethod = (input: RequestInfo | URL, init?: RequestInit): string => {
  if (init?.method) {
    return init.method
  }
  if (typeof input === 'object' && 'method' in input) {
    return input.method
  }
  return 'GET'
}

const getResponse = (mockResponse: MockResponse): Response => {
  if (typeof mockResponse === 'function') {
    return mockResponse()
  }
  return mockResponse
}

const getHeadEtag = (urlString: string): string => {
  if (urlString.includes('api1')) {
    return '"test-etag-1"'
  }
  if (urlString.includes('api2')) {
    return '"test-etag-2"'
  }
  return '"test-etag"'
}

const getHeadResponse = (urlString: string, options: MockFetchOptions): Response | undefined => {
  if (options.urlMatcher) {
    const matched = options.urlMatcher(urlString)
    if (matched?.getResponse) {
      return new Response(null, {
        headers: {
          etag: getHeadEtag(urlString),
        },
        status: 200,
      })
    }
  }
  if (options.getResponse) {
    return new Response(null, {
      headers: {
        etag: '"test-etag"',
      },
      status: 200,
    })
  }
  return undefined
}

const getMatchedResponse = (urlString: string, options: MockFetchOptions): Response | undefined => {
  if (!options.urlMatcher) {
    return undefined
  }
  const matched = options.urlMatcher(urlString)
  if (!matched?.getResponse) {
    return undefined
  }
  return getResponse(matched.getResponse)
}

const mockFetch = (options: MockFetchOptions): typeof globalThis.fetch => {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlString = getUrlString(input)
    const method = getRequestMethod(input, init)

    const headResponse = options.onCall?.(input, init)
    if (headResponse) {
      return headResponse
    }

    if (method === 'HEAD') {
      const response = getHeadResponse(urlString, options)
      if (response) {
        return response
      }
    }

    const matchedResponse = getMatchedResponse(urlString, options)
    if (matchedResponse) {
      return matchedResponse
    }

    if (options.getResponse) {
      return getResponse(options.getResponse)
    }

    throw new Error('No response configured for this request')
  }
}

test('getJsonCached should call getJson when useCache is false', async () => {
  const mockData = { name: 'test', value: 123 }
  globalThis.fetch = mockFetch({
    getResponse: Response.json(mockData),
  })

  const locationProtocol = 'https:'

  const result = await GetJsonCached.getJsonCached('https://example.com/api', false, 'test-bucket', 'test-cache', locationProtocol)

  expect(result).toEqual(mockData)
})

test('getJsonCached should use cache when useCache is true', async () => {
  const mockData = { name: 'test', value: 123 }
  const mockCache = createMockCache()
  setupMockStorageBuckets(mockCache)
  let getCallCount = 0

  globalThis.fetch = mockFetch({
    getResponse: () => {
      getCallCount++
      return Response.json(mockData, {
        headers: {
          etag: '"test-etag"',
        },
      })
    },
  })

  const cacheName = `test-cache-${Date.now()}-${Math.random()}`
  const result1 = await GetJsonCached.getJsonCached('https://example.com/api', true, 'test-bucket', cacheName, 'https:')
  expect(result1).toEqual(mockData)
  expect(getCallCount).toBe(1)

  const result2 = await GetJsonCached.getJsonCached('https://example.com/api', true, 'test-bucket', cacheName, 'https:')
  expect(result2).toEqual(mockData)
  expect(getCallCount).toBe(1)
})

test('getJsonCached should throw VError when fetch fails and useCache is false', async () => {
  globalThis.fetch = mockFetch({
    getResponse: () => {
      throw new Error('Network error')
    },
  })

  await expect(GetJsonCached.getJsonCached('https://example.com/api', false, 'test-bucket', 'test-cache', 'https:')).rejects.toThrow(VError)
})

test('getJsonCached should throw VError when fetch fails and useCache is true', async () => {
  const mockCache = createMockCache()
  setupMockStorageBuckets(mockCache)

  globalThis.fetch = mockFetch({
    getResponse: () => {
      throw new Error('Network error')
    },
  })

  await expect(GetJsonCached.getJsonCached('https://example.com/api', true, 'test-bucket', 'test-cache', 'https:')).rejects.toThrow(VError)
})

test('getJsonCached should cache different URLs separately', async () => {
  const mockData1 = { name: 'test1', value: 1 }
  const mockData2 = { name: 'test2', value: 2 }
  const mockCache = createMockCache()
  setupMockStorageBuckets(mockCache)
  let getCallCount = 0

  globalThis.fetch = mockFetch({
    urlMatcher: (url: string) => {
      if (url.includes('api1')) {
        return {
          getResponse: (): Response => {
            getCallCount++
            return Response.json(mockData1, {
              headers: {
                etag: '"test-etag-1"',
              },
            })
          },
        }
      }
      return {
        getResponse: (): Response => {
          getCallCount++
          return Response.json(mockData2, {
            headers: {
              etag: '"test-etag-2"',
            },
          })
        },
      }
    },
  })

  const cacheName = `test-cache-${Date.now()}-${Math.random()}`
  const result1 = await GetJsonCached.getJsonCached('https://example.com/api1', true, 'test-bucket', cacheName, 'https:')
  expect(result1).toEqual(mockData1)
  expect(getCallCount).toBe(1)

  const result2 = await GetJsonCached.getJsonCached('https://example.com/api2', true, 'test-bucket', cacheName, 'https:')
  expect(result2).toEqual(mockData2)
  expect(getCallCount).toBe(2)

  const result1Cached = await GetJsonCached.getJsonCached('https://example.com/api1', true, 'test-bucket', cacheName, 'https:')
  expect(result1Cached).toEqual(mockData1)
  expect(getCallCount).toBe(2)

  const result2Cached = await GetJsonCached.getJsonCached('https://example.com/api2', true, 'test-bucket', cacheName, 'https:')
  expect(result2Cached).toEqual(mockData2)
  expect(getCallCount).toBe(2)
})

test('getJsonCached should fallback to getJson when cache operations fail', async () => {
  const mockData = { name: 'test', value: 999 }
  let getCallCount = 0

  const mockCache: Cache = {
    async add(): Promise<void> {},
    async addAll(): Promise<void> {},
    async delete(): Promise<boolean> {
      return false
    },
    async keys(): Promise<ReadonlyArray<Request>> {
      return []
    },
    async match() {
      throw new Error('Cache match failed')
    },
    async matchAll(): Promise<ReadonlyArray<Response>> {
      return []
    },
    async put() {
      throw new Error('Cache put failed')
    },
  }
  setupMockStorageBuckets(mockCache)

  globalThis.fetch = mockFetch({
    getResponse: () => {
      getCallCount++
      return Response.json(mockData, {
        headers: {
          etag: '"test-etag"',
        },
      })
    },
  })

  const result = await GetJsonCached.getJsonCached('https://example.com/api', true, 'test-bucket', 'test-cache', 'https:')
  expect(result).toEqual(mockData)
  expect(getCallCount).toBe(1)
})

test('getJsonCached should fallback to getJson when HEAD response is not ok', async () => {
  const mockData = { name: 'test', value: 111 }
  let getCallCount = 0
  const mockCache = createMockCache()
  setupMockStorageBuckets(mockCache)

  globalThis.fetch = mockFetch({
    getResponse: () => {
      getCallCount++
      return Response.json(mockData)
    },
    onCall: (input, init) => {
      const method = init?.method || 'GET'
      if (method === 'HEAD') {
        return new Response(null, {
          status: 404,
          statusText: 'Not Found',
        })
      }
      return undefined
    },
  })

  const cacheName = `test-cache-${Date.now()}-${Math.random()}`
  const result = await GetJsonCached.getJsonCached('https://example.com/api', true, 'test-bucket', cacheName, 'https:')
  expect(result).toEqual(mockData)
  expect(getCallCount).toBe(1)
})

test('getJsonCached should handle getJson error when fetch fails', async () => {
  const mockCache = createMockCache()
  setupMockStorageBuckets(mockCache)

  globalThis.fetch = mockFetch({
    getResponse: () => {
      throw new Error('GET request failed')
    },
  })

  await expect(GetJsonCached.getJsonCached('https://example.com/api', true, 'test-bucket', 'test-cache', 'https:')).rejects.toThrow(VError)
})
