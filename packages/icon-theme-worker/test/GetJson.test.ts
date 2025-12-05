import { test, expect, beforeEach } from '@jest/globals'
import { VError } from '@lvce-editor/verror'

const GetJson = await import('../src/parts/GetJson/GetJson.ts')

// Store original fetch
const originalFetch = globalThis.fetch

beforeEach(() => {
  // Restore original fetch before each test
  globalThis.fetch = originalFetch
})

test('getJson should return parsed JSON when fetch succeeds', async () => {
  const mockData = { name: 'test', value: 123 }
  globalThis.fetch = async (): Promise<Response> => {
    return {
      json: async () => mockData,
      ok: true,
    } as unknown as Response
  }

  const result = await GetJson.getJson('https://example.com/api')

  expect(result).toEqual(mockData)
})

test('getJson should throw VError when response is not ok', async () => {
  globalThis.fetch = async (): Promise<Response> => {
    return {
      ok: false,
      statusText: 'Not Found',
    } as unknown as Response
  }

  await expect(GetJson.getJson('https://example.com/api')).rejects.toThrow(VError)
  await expect(GetJson.getJson('https://example.com/api')).rejects.toThrow('Failed to get json')
})

test('getJson should throw VError when fetch fails', async () => {
  globalThis.fetch = async (): Promise<Response> => {
    throw new Error('Network error')
  }

  await expect(GetJson.getJson('https://example.com/api')).rejects.toThrow(VError)
  await expect(GetJson.getJson('https://example.com/api')).rejects.toThrow('Failed to get json')
})

test('getJson should throw VError when JSON parsing fails', async () => {
  globalThis.fetch = async (): Promise<Response> => {
    return {
      json: async () => {
        throw new Error('Invalid JSON')
      },
      ok: true,
    } as unknown as Response
  }

  await expect(GetJson.getJson('https://example.com/api')).rejects.toThrow(VError)
  await expect(GetJson.getJson('https://example.com/api')).rejects.toThrow('Failed to get json')
})

test('getJson should handle different data types', async () => {
  const testCases = [
    { data: 'string', expected: 'string' },
    { data: 42, expected: 42 },
    { data: true, expected: true },
    { data: null, expected: null },
    { data: [1, 2, 3], expected: [1, 2, 3] },
    { data: { nested: { value: 'test' } }, expected: { nested: { value: 'test' } } },
  ]

  for (const testCase of testCases) {
    globalThis.fetch = async (): Promise<Response> => {
      return {
        json: async () => testCase.data,
        ok: true,
      } as unknown as Response
    }

    const result = await GetJson.getJson('https://example.com/api')

    expect(result).toEqual(testCase.expected)
  }
})
