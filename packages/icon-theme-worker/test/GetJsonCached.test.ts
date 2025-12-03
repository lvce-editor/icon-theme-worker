import { test, expect, beforeEach } from '@jest/globals'
import { VError } from '@lvce-editor/verror'

const GetJsonCached = await import('../src/parts/GetJsonCached/GetJsonCached.ts')

const originalFetch = globalThis.fetch

beforeEach(() => {
  globalThis.fetch = originalFetch
})

test('getJsonCached should call getJson when useCache is false', async () => {
  const mockData = { name: 'test', value: 123 }
  globalThis.fetch = async (): Promise<Response> => {
    return {
      ok: true,
      json: async () => mockData,
    } as unknown as Response
  }

  const result = await GetJsonCached.getJsonCached('https://example.com/api', false)

  expect(result).toEqual(mockData)
})

test('getJsonCached should call getJson when useCache is true', async () => {
  const mockData = { name: 'test', value: 123 }
  globalThis.fetch = async (): Promise<Response> => {
    return {
      ok: true,
      json: async () => mockData,
    } as unknown as Response
  }

  const result = await GetJsonCached.getJsonCached('https://example.com/api', true)

  expect(result).toEqual(mockData)
})

test('getJsonCached should throw VError when fetch fails and useCache is false', async () => {
  globalThis.fetch = async (): Promise<Response> => {
    throw new Error('Network error')
  }

  await expect(GetJsonCached.getJsonCached('https://example.com/api', false)).rejects.toThrow(VError)
})

test('getJsonCached should throw VError when fetch fails and useCache is true', async () => {
  globalThis.fetch = async (): Promise<Response> => {
    throw new Error('Network error')
  }

  await expect(GetJsonCached.getJsonCached('https://example.com/api', true)).rejects.toThrow(VError)
})
