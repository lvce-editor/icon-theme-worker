import { expect, test } from '@jest/globals'
import { getFileIcon } from '../src/parts/GetIcon/GetIcon.ts'
import { loadIconThemeJson } from '../src/parts/GetIconThemeJson/GetIconThemeJson.ts'
import * as IconThemeState from '../src/parts/IconThemeState/IconThemeState.ts'

test('loadIconThemeJson clears the current icon theme when the id is null', async () => {
  IconThemeState.setTheme({
    extensionBaseUrl: '/remote',
    extensionPath: '',
    extensionRemoteUri: '',
    extensionUri: '',
    json: {
      fileNames: {
        'file.txt': 'text',
      },
      iconDefinitions: {
        text: '/text.svg',
      },
    },
  })

  expect(getFileIcon({ name: 'file.txt' })).toBe('/remote/text.svg')

  await loadIconThemeJson([], null, '', 0, false, '')

  expect(getFileIcon({ name: 'file.txt' })).toBe('')
  expect(IconThemeState.getExtensionBaseUrl()).toBe('')
})
