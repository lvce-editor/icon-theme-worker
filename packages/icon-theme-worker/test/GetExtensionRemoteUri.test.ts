import { test, expect } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'
import * as GetExtensionRemoteUri from '../src/parts/GetExtensionRemoteUri/GetExtensionRemoteUri.ts'

test('getExtensionRemoteUri should return remote URL for Remote platform with file:// URI', () => {
  const extensionUri = 'file:///home/user/.vscode/extensions/my-extension'
  const extensionPath = '/home/user/.vscode/extensions/my-extension'
  const platform = PlatformType.Remote

  const result = GetExtensionRemoteUri.getExtensionRemoteUri(extensionUri, extensionPath, platform)

  expect(result).toBe('/remote/home/user/.vscode/extensions/my-extension')
})

test('getExtensionRemoteUri should apply remote path transformation for Remote platform regardless of URI scheme', () => {
  const extensionUri = 'https://example.com/extensions/my-extension'
  const extensionPath = '/home/user/.vscode/extensions/my-extension'
  const platform = PlatformType.Remote

  const result = GetExtensionRemoteUri.getExtensionRemoteUri(extensionUri, extensionPath, platform)

  // The function slices off the first 7 characters ('https://') and prepends '/remote'
  expect(result).toBe('/remote/example.com/extensions/my-extension')
})

test('getExtensionRemoteUri should return remote URL for Electron platform with file:// URI', () => {
  const extensionUri = 'file:///Users/user/.vscode/extensions/my-extension'
  const extensionPath = '/Users/user/.vscode/extensions/my-extension'
  const platform = PlatformType.Electron

  const result = GetExtensionRemoteUri.getExtensionRemoteUri(extensionUri, extensionPath, platform)

  expect(result).toBe('/remote/Users/user/.vscode/extensions/my-extension')
})

test('getExtensionRemoteUri should return extension URI for Electron platform when not file:// URI', () => {
  const extensionUri = 'https://example.com/extensions/my-extension'
  const extensionPath = '/Users/user/.vscode/extensions/my-extension'
  const platform = PlatformType.Electron

  const result = GetExtensionRemoteUri.getExtensionRemoteUri(extensionUri, extensionPath, platform)

  expect(result).toBe('https://example.com/extensions/my-extension')
})

test('getExtensionRemoteUri should return empty string for Electron platform when both URIs are empty', () => {
  const extensionUri = ''
  const extensionPath = ''
  const platform = PlatformType.Electron

  const result = GetExtensionRemoteUri.getExtensionRemoteUri(extensionUri, extensionPath, platform)

  expect(result).toBe('')
})

test('getExtensionRemoteUri should return extension URI for Web platform', () => {
  const extensionUri = 'https://example.com/extensions/my-extension'
  const extensionPath = '/home/user/.vscode/extensions/my-extension'
  const platform = PlatformType.Web

  const result = GetExtensionRemoteUri.getExtensionRemoteUri(extensionUri, extensionPath, platform)

  expect(result).toBe('https://example.com/extensions/my-extension')
})

test('getExtensionRemoteUri should return extension path for Web platform when extension URI is empty', () => {
  const extensionUri = ''
  const extensionPath = '/home/user/.vscode/extensions/my-extension'
  const platform = PlatformType.Web

  const result = GetExtensionRemoteUri.getExtensionRemoteUri(extensionUri, extensionPath, platform)

  expect(result).toBe('/home/user/.vscode/extensions/my-extension')
})

test('getExtensionRemoteUri should return empty string when both URIs are empty for Web platform', () => {
  const extensionUri = ''
  const extensionPath = ''
  const platform = PlatformType.Web

  const result = GetExtensionRemoteUri.getExtensionRemoteUri(extensionUri, extensionPath, platform)

  expect(result).toBe('')
})

test('getExtensionRemoteUri should handle file:// URIs with Windows-style paths on Electron', () => {
  const extensionUri = 'file:///C:/Users/user/.vscode/extensions/my-extension'
  const extensionPath = 'C:\\Users\\user\\.vscode\\extensions\\my-extension'
  const platform = PlatformType.Electron

  const result = GetExtensionRemoteUri.getExtensionRemoteUri(extensionUri, extensionPath, platform)

  expect(result).toBe('/remote/C:/Users/user/.vscode/extensions/my-extension')
})

test('getExtensionRemoteUri should return extension path when URI is empty for Electron platform', () => {
  const extensionUri = ''
  const extensionPath = '/home/user/.vscode/extensions/my-extension'
  const platform = PlatformType.Electron

  const result = GetExtensionRemoteUri.getExtensionRemoteUri(extensionUri, extensionPath, platform)

  expect(result).toBe('/home/user/.vscode/extensions/my-extension')
})

test('getExtensionRemoteUri should handle complex file:// URIs with special characters on Remote', () => {
  const extensionUri = 'file:///home/user/.vscode/extensions/my-extension-v1.0.0'
  const extensionPath = '/home/user/.vscode/extensions/my-extension-v1.0.0'
  const platform = PlatformType.Remote

  const result = GetExtensionRemoteUri.getExtensionRemoteUri(extensionUri, extensionPath, platform)

  expect(result).toBe('/remote/home/user/.vscode/extensions/my-extension-v1.0.0')
})
