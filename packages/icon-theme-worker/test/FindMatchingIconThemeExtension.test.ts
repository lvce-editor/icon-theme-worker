import { expect, test } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'
import { findMatchingIconThemeExtension } from '../src/parts/FindMatchingIconThemeExtension/FindMatchingIconThemeExtension.ts'

const extension = {
  iconThemes: [
    {
      id: 'vscode-icons',
      path: 'icon-theme.json',
    },
  ],
  path: '/extensions/builtin.vscode-icons',
  uri: 'file:///extensions/builtin.vscode-icons',
}

test('findMatchingIconThemeExtension ignores disabled extensions', () => {
  expect(findMatchingIconThemeExtension([{ ...extension, disabled: true }], 'vscode-icons', PlatformType.Electron)).toBeUndefined()
})

test('findMatchingIconThemeExtension returns enabled extensions', () => {
  expect(findMatchingIconThemeExtension([extension], 'vscode-icons', PlatformType.Electron)).toEqual({
    ...extension.iconThemes[0],
    extensionId: undefined,
    extensionPath: extension.path,
    extensionRemoteUri: '/remote/extensions/builtin.vscode-icons',
    extensionUri: extension.uri,
  })
})
