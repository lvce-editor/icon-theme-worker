import { test, expect, beforeEach } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'
import * as DoGetIconThemeJson from '../src/parts/DoGetIconThemeJson/DoGetIconThemeJson.ts'

const originalFetch = globalThis.fetch

beforeEach(() => {
  globalThis.fetch = originalFetch
})

test('doGetIconThemeJson should return icon theme json for web platform with useCache false', async () => {
  const mockJson = { iconDefinitions: {} }
  globalThis.fetch = async (): Promise<Response> => {
    return {
      ok: true,
      json: async () => mockJson,
    } as unknown as Response
  }

  const result = await DoGetIconThemeJson.doGetIconThemeJson([], 'test-theme', '/assets', PlatformType.Web, false)

  expect(result).toBeDefined()
  expect(result?.json).toEqual(mockJson)
  expect(result?.extensionBaseUrl).toBe('/assets/extensions/builtin.test-theme')
})

test('doGetIconThemeJson should return icon theme json for web platform with useCache true', async () => {
  const mockJson = { iconDefinitions: {} }
  globalThis.fetch = async (): Promise<Response> => {
    return {
      ok: true,
      json: async () => mockJson,
    } as unknown as Response
  }

  const result = await DoGetIconThemeJson.doGetIconThemeJson([], 'test-theme', '/assets', PlatformType.Web, true)

  expect(result).toBeDefined()
  expect(result?.json).toEqual(mockJson)
  expect(result?.extensionBaseUrl).toBe('/assets/extensions/builtin.test-theme')
})

test('doGetIconThemeJson should return undefined when icon theme is not found for non-web platform', async () => {
  const result = await DoGetIconThemeJson.doGetIconThemeJson([], 'test-theme', '/assets', PlatformType.Node, false)

  expect(result).toBeUndefined()
})
