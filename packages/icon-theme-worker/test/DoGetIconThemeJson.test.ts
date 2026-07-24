/* eslint-disable unicorn/no-global-object-property-assignment */
import { test, expect, beforeEach } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'
import * as DoGetIconThemeJson from '../src/parts/DoGetIconThemeJson/DoGetIconThemeJson.ts'

const originalFetch = globalThis.fetch
const originalLocation = (globalThis as any).location

beforeEach(() => {
  globalThis.fetch = originalFetch
  ;(globalThis as any).location = originalLocation || { protocol: 'https:' }
})

test('doGetIconThemeJson should return icon theme json for web platform with useCache false', async () => {
  const mockJson = { iconDefinitions: {} }
  globalThis.fetch = async (): Promise<Response> => {
    return {
      json: async () => mockJson,
      ok: true,
    } as unknown as Response
  }

  const result = await DoGetIconThemeJson.doGetIconThemeJson([], 'test-theme', '/assets', PlatformType.Web, false, '')

  expect(result).toBeDefined()
  expect(result?.json).toEqual(mockJson)
  expect(result?.extensionBaseUrl).toBe('/assets/extensions/builtin.test-theme')
})

test('doGetIconThemeJson should return icon theme json for web platform with useCache true', async () => {
  const mockJson = { iconDefinitions: {} }
  globalThis.fetch = async (): Promise<Response> => {
    return {
      json: async () => mockJson,
      ok: true,
    } as unknown as Response
  }

  const result = await DoGetIconThemeJson.doGetIconThemeJson([], 'test-theme', '/assets', PlatformType.Web, true, '')

  expect(result).toBeDefined()
  expect(result?.json).toEqual(mockJson)
  expect(result?.extensionBaseUrl).toBe('/assets/extensions/builtin.test-theme')
})

test('doGetIconThemeJson should return undefined when icon theme is not found for non-web platform', async () => {
  const result = await DoGetIconThemeJson.doGetIconThemeJson([], 'test-theme', '/assets', PlatformType.Remote, false, '')

  expect(result).toBeUndefined()
})

test('doGetIconThemeJson should use optimized paths for builtin vscode-icons on electron', async () => {
  const mockJson = {
    iconDefinitions: {
      _file: '/icons/default_file.svg',
    },
  }
  globalThis.fetch = async (): Promise<Response> => {
    return {
      json: async () => mockJson,
      ok: true,
    } as unknown as Response
  }
  const extensions = [
    {
      iconThemes: [
        {
          id: 'vscode-icons',
          path: 'icon-theme.json',
        },
      ],
      id: 'builtin.vscode-icons',
      path: '/usr/lib/lvce/resources/app/static/abc/extensions/builtin.vscode-icons',
      uri: 'file:///usr/lib/lvce/resources/app/static/abc/extensions/builtin.vscode-icons',
    },
  ]

  const result = await DoGetIconThemeJson.doGetIconThemeJson(extensions, 'vscode-icons', '/abc', PlatformType.Electron, false, 'abc')

  expect(result).toEqual({
    extensionBaseUrl: '/abc',
    extensionPath: '/usr/lib/lvce/resources/app/static/abc/extensions/builtin.vscode-icons',
    extensionRemoteUri: '',
    extensionUri: 'file:///usr/lib/lvce/resources/app/static/abc/extensions/builtin.vscode-icons',
    json: {
      iconDefinitions: {
        _file: '/file-icons/default_file.svg',
      },
    },
  })
})
