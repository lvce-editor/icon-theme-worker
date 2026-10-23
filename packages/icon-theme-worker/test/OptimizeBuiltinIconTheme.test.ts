import { expect, test } from '@jest/globals'
import { optimizeBuiltinIconTheme } from '../src/parts/OptimizeBuiltinIconTheme/OptimizeBuiltinIconTheme.ts'

test('optimizes vscode-icons paths', () => {
  const iconTheme = {
    iconDefinitions: {
      _file: '/icons/default_file.svg',
      _file_light: '',
    },
  }

  expect(optimizeBuiltinIconTheme(iconTheme, 'builtin.vscode-icons')).toEqual({
    iconDefinitions: {
      _file: '/file-icons/default_file.svg',
      _file_light: '',
    },
  })
})

test('does not optimize another extension', () => {
  const iconTheme = {
    iconDefinitions: {
      _file: '/icons/default_file.svg',
    },
  }

  expect(optimizeBuiltinIconTheme(iconTheme, 'sample.vscode-icons')).toBe(iconTheme)
})
