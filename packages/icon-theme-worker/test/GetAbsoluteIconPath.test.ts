import { test, expect } from '@jest/globals'
import * as GetAbsoluteIconPath from '../src/parts/GetAbsoluteIconPath/GetAbsoluteIconPath.ts'

test.skip('getAbsoluteIconPath returns empty string when iconTheme is null', () => {
  const result = GetAbsoluteIconPath.getAbsoluteIconPath(null, 'test-icon')
  expect(result).toBe('')
})

test.skip('getAbsoluteIconPath returns empty string when iconTheme is undefined', () => {
  const result = GetAbsoluteIconPath.getAbsoluteIconPath(undefined, 'test-icon')
  expect(result).toBe('')
})

test.skip('getAbsoluteIconPath returns empty string when icon is not found in iconDefinitions', () => {
  const iconTheme = {
    iconDefinitions: {
      'other-icon': {
        iconPath: 'path/to/other-icon.png',
      },
    },
  }

  const result = GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, 'non-existent-icon')
  expect(result).toBe('')
})
