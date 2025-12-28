import { test, expect } from '@jest/globals'
import * as GetAbsoluteIconPath from '../src/parts/GetAbsoluteIconPath/GetAbsoluteIconPath.ts'

test('getAbsoluteIconPath returns empty string when iconTheme is null', () => {
  const baseUrl = ''

  const result = GetAbsoluteIconPath.getAbsoluteIconPath(null, 'test-icon', baseUrl)
  expect(result).toBe('')
})

test('getAbsoluteIconPath returns empty string when iconTheme is undefined', () => {
  const baseUrl = ''

  const result = GetAbsoluteIconPath.getAbsoluteIconPath(undefined, 'test-icon', baseUrl)
  expect(result).toBe('')
})

test('getAbsoluteIconPath returns empty string when icon is not found in iconDefinitions', () => {
  const iconTheme = {
    iconDefinitions: {
      'other-icon': 'path/to/other-icon.png',
    },
  }
  const baseUrl = ''

  const result = GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, 'non-existent-icon', baseUrl)
  expect(result).toBe('')
})
