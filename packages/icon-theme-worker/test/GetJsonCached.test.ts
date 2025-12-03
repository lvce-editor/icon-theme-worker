/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { test, expect, beforeEach } from '@jest/globals'
import { VError } from '@lvce-editor/verror'

const GetJsonCached = await import('../src/parts/GetJsonCached/GetJsonCached.ts')

const originalFetch = globalThis.fetch

beforeEach(() => {
  globalThis.fetch = originalFetch
})

type MockFetchOptions = {
  headResponse?: Response | (() => Response) | (() => never)
  getResponse?: Response | (() => Response) | (() => never)
  onCall?: (input: RequestInfo | URL, init?: RequestInit) => void
  urlMatcher?: (url: string) => {
    headResponse?: Response | (() => Response) | (() => never)
    getResponse?: Response | (() => Response) | (() => never)
  }
}

const mockFetch = (options: MockFetchOptions): typeof globalThis.fetch => {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    options.onCall?.(input, init)

    const method = init?.method
    const urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url

    if (options.urlMatcher) {
      const matched = options.urlMatcher(urlString)
      if (matched) {
        if (method === 'HEAD' && matched.headResponse) {
          const response = typeof matched.headResponse === 'function' ? matched.headResponse() : matched.headResponse
          return response
        }
        if (method !== 'HEAD' && matched.getResponse) {
          const response = typeof matched.getResponse === 'function' ? matched.getResponse() : matched.getResponse
          return response
        }
      }
    }

    if (method === 'HEAD' && options.headResponse) {
      const response = typeof options.headResponse === 'function' ? options.headResponse() : options.headResponse
      return response
    }

    if (method !== 'HEAD' && options.getResponse) {
      const response = typeof options.getResponse === 'function' ? options.getResponse() : options.getResponse
      return response
    }

    throw new Error('No response configured for this request')
  }
}

test('getJsonCached should call getJson when useCache is false', async () => {
  const mockData = { name: 'test', value: 123 }
  globalThis.fetch = mockFetch({
    getResponse: Response.json(mockData),
  })

  const result = await GetJsonCached.getJsonCached('https://example.com/api', false)

  expect(result).toEqual(mockData)
})

test('getJsonCached should call getJson when useCache is true', async () => {
  const mockData = { name: 'test', value: 123 }
  globalThis.fetch = mockFetch({
    getResponse: Response.json(mockData),
  })

  const result = await GetJsonCached.getJsonCached('https://example.com/api', true)

  expect(result).toEqual(mockData)
})

test('getJsonCached should throw VError when fetch fails and useCache is false', async () => {
  globalThis.fetch = mockFetch({
    getResponse: () => {
      throw new Error('Network error')
    },
  })

  await expect(GetJsonCached.getJsonCached('https://example.com/api', false)).rejects.toThrow(VError)
})

test('getJsonCached should throw VError when fetch fails and useCache is true', async () => {
  globalThis.fetch = mockFetch({
    getResponse: () => {
      throw new Error('Network error')
    },
  })

  await expect(GetJsonCached.getJsonCached('https://example.com/api', true)).rejects.toThrow(VError)
})

test('getJsonCached should use cached data when etag matches', async () => {
  const mockData = { name: 'test', value: 123 }
  const etag = '"abc123"'
  let fetchCallCount = 0

  globalThis.fetch = mockFetch({
    headResponse: new Response(null, {
      status: 200,
      headers: { etag },
    }),
    getResponse: Response.json(mockData),
    onCall: () => {
      fetchCallCount++
    },
  })

  const result1 = await GetJsonCached.getJsonCached('https://example.com/api', true)
  expect(result1).toEqual(mockData)
  expect(fetchCallCount).toBe(2)

  const result2 = await GetJsonCached.getJsonCached('https://example.com/api', true)
  expect(result2).toEqual(mockData)
  expect(fetchCallCount).toBe(3)
})

test('getJsonCached should fetch and cache data when etag exists but cache miss', async () => {
  const mockData = { name: 'test', value: 456 }
  const etag = '"xyz789"'
  let getJsonCallCount = 0

  globalThis.fetch = mockFetch({
    headResponse: new Response(null, {
      status: 200,
      headers: { etag },
    }),
    getResponse: () => {
      getJsonCallCount++
      return Response.json(mockData)
    },
  })

  const result = await GetJsonCached.getJsonCached('https://example.com/api', true)
  expect(result).toEqual(mockData)
  expect(getJsonCallCount).toBe(1)
})

test('getJsonCached should fetch but not cache when no etag', async () => {
  const mockData = { name: 'test', value: 789 }
  let getJsonCallCount = 0

  globalThis.fetch = mockFetch({
    headResponse: new Response(null, {
      status: 200,
      headers: {},
    }),
    getResponse: () => {
      getJsonCallCount++
      return Response.json(mockData)
    },
  })

  const result1 = await GetJsonCached.getJsonCached('https://example.com/api', true)
  expect(result1).toEqual(mockData)
  expect(getJsonCallCount).toBe(1)

  const result2 = await GetJsonCached.getJsonCached('https://example.com/api', true)
  expect(result2).toEqual(mockData)
  expect(getJsonCallCount).toBe(2)
})

test('getJsonCached should fallback to getJson when HEAD request fails', async () => {
  const mockData = { name: 'test', value: 999 }
  let getJsonCallCount = 0

  globalThis.fetch = mockFetch({
    headResponse: () => {
      throw new Error('HEAD request failed')
    },
    getResponse: () => {
      getJsonCallCount++
      return Response.json(mockData)
    },
  })

  const result = await GetJsonCached.getJsonCached('https://example.com/api', true)
  expect(result).toEqual(mockData)
  expect(getJsonCallCount).toBe(1)
})

test('getJsonCached should fallback to getJson when HEAD response is not ok', async () => {
  const mockData = { name: 'test', value: 111 }
  let getJsonCallCount = 0

  globalThis.fetch = mockFetch({
    headResponse: new Response(null, {
      status: 404,
      statusText: 'Not Found',
      headers: {},
    }),
    getResponse: () => {
      getJsonCallCount++
      return Response.json(mockData)
    },
  })

  const result = await GetJsonCached.getJsonCached('https://example.com/api', true)
  expect(result).toEqual(mockData)
  expect(getJsonCallCount).toBe(1)
})

test('getJsonCached should cache different etags separately', async () => {
  const mockData1 = { name: 'test1', value: 1 }
  const mockData2 = { name: 'test2', value: 2 }
  const etag1 = '"etag1"'
  const etag2 = '"etag2"'
  let getJsonCallCount = 0

  globalThis.fetch = mockFetch({
    urlMatcher: (url: string) => {
      if (url.includes('api1')) {
        return {
          headResponse: new Response(null, {
            status: 200,
            headers: { etag: etag1 },
          }),
          getResponse: (): Response => {
            getJsonCallCount++
            return Response.json(mockData1)
          },
        }
      }
      return {
        headResponse: new Response(null, {
          status: 200,
          headers: { etag: etag2 },
        }),
        getResponse: (): Response => {
          getJsonCallCount++
          return Response.json(mockData2)
        },
      }
    },
  })

  const result1 = await GetJsonCached.getJsonCached('https://example.com/api1', true)
  expect(result1).toEqual(mockData1)
  expect(getJsonCallCount).toBe(1)

  const result2 = await GetJsonCached.getJsonCached('https://example.com/api2', true)
  expect(result2).toEqual(mockData2)
  expect(getJsonCallCount).toBe(2)

  const result1Cached = await GetJsonCached.getJsonCached('https://example.com/api1', true)
  expect(result1Cached).toEqual(mockData1)
  expect(getJsonCallCount).toBe(2)

  const result2Cached = await GetJsonCached.getJsonCached('https://example.com/api2', true)
  expect(result2Cached).toEqual(mockData2)
  expect(getJsonCallCount).toBe(2)
})

test('getJsonCached should handle empty etag string', async () => {
  const mockData = { name: 'test', value: 333 }
  let getJsonCallCount = 0

  globalThis.fetch = mockFetch({
    headResponse: new Response(null, {
      status: 200,
      headers: { etag: '' },
    }),
    getResponse: () => {
      getJsonCallCount++
      return Response.json(mockData)
    },
  })

  const result1 = await GetJsonCached.getJsonCached('https://example.com/api', true)
  expect(result1).toEqual(mockData)
  expect(getJsonCallCount).toBe(1)

  const result2 = await GetJsonCached.getJsonCached('https://example.com/api', true)
  expect(result2).toEqual(mockData)
  expect(getJsonCallCount).toBe(2)
})

test('getJsonCached should handle getJson error when HEAD succeeds but GET fails', async () => {
  const etag = '"error-etag"'

  globalThis.fetch = mockFetch({
    headResponse: new Response(null, {
      status: 200,
      headers: { etag },
    }),
    getResponse: () => {
      throw new Error('GET request failed')
    },
  })

  await expect(GetJsonCached.getJsonCached('https://example.com/api', true)).rejects.toThrow(VError)
})

test('getJsonCached should handle getJson error when HEAD fails and GET fails', async () => {
  globalThis.fetch = mockFetch({
    getResponse: () => {
      throw new Error('All requests failed')
    },
  })

  await expect(GetJsonCached.getJsonCached('https://example.com/api', true)).rejects.toThrow(VError)
})

test('getJsonCached should handle getJson error when HEAD not ok and GET fails', async () => {
  globalThis.fetch = mockFetch({
    headResponse: new Response(null, {
      status: 404,
      statusText: 'Not Found',
      headers: {},
    }),
    getResponse: () => {
      throw new Error('GET request failed')
    },
  })

  await expect(GetJsonCached.getJsonCached('https://example.com/api', true)).rejects.toThrow(VError)
})
