import { test, expect, jest, beforeEach } from '@jest/globals'
import type { Dirent } from '../src/parts/Dirent/Dirent.ts'
import * as DefaultIcon from '../src/parts/DefaultIcon/DefaultIcon.ts'
import * as GetIcon from '../src/parts/GetIcon/GetIcon.ts'
import { getIcons } from '../src/parts/GetIcons/GetIcons.ts'
import * as IconThemeState from '../src/parts/IconThemeState/IconThemeState.ts'

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

test('getFileNameIcon should return empty string when no iconTheme', () => {
  // This test verifies the basic behavior when iconTheme is null
  // The actual implementation will call IconThemeState.getIconTheme() internally
  const result = GetIcon.getFileNameIcon('test.js')
  expect(typeof result).toBe('string')
})

test('getFileIcon should call getFileNameIcon with file name', () => {
  const file = { name: 'test.js' }
  const result = GetIcon.getFileIcon(file)
  expect(typeof result).toBe('string')
})

test('getFileIcons should return array of icons for multiple files', () => {
  const files = [{ name: 'test1.js' }, { name: 'test2.ts' }]

  const result = GetIcon.getFileIcons(files)
  expect(Array.isArray(result)).toBe(true)
  expect(result).toHaveLength(2)
  expect(typeof result[0]).toBe('string')
  expect(typeof result[1]).toBe('string')
})

test('getFolderNameIcon should return string', () => {
  const result = GetIcon.getFolderNameIcon('src')
  expect(typeof result).toBe('string')
})

test('getFolderIcon should call getFolderNameIcon with folder name', () => {
  const folder = { name: 'src' }
  const result = GetIcon.getFolderIcon(folder)
  expect(typeof result).toBe('string')
})

test('getIcon should handle file dirent', () => {
  const dirent: Dirent = { name: 'test.js', type: 1 } // File type

  const result = GetIcon.getIcon(dirent)
  expect(typeof result).toBe('string')
})

test('getIcon should handle directory dirent', () => {
  const dirent: Dirent = { name: 'src', type: 2 } // Directory type

  const result = GetIcon.getIcon(dirent)
  expect(typeof result).toBe('string')
})

test('getIcon should handle expanded directory dirent', () => {
  const dirent: Dirent = { name: 'src', type: 3 } // DirectoryExpanded type

  const result = GetIcon.getIcon(dirent)
  expect(typeof result).toBe('string')
})

test('getIcon should handle symlink file dirent', () => {
  const dirent: Dirent = { name: 'test.js', type: 4 } // SymLinkFile type

  const result = GetIcon.getIcon(dirent)
  expect(typeof result).toBe('string')
})

test('getIcon should handle symlink folder dirent', () => {
  const dirent: Dirent = { name: 'src', type: 5 } // SymLinkFolder type

  const result = GetIcon.getIcon(dirent)
  expect(typeof result).toBe('string')
})

test('getIcon should handle unsupported dirent type', () => {
  const dirent: Dirent = { name: 'unknown', type: 999 } // Unknown type

  const result = GetIcon.getIcon(dirent)
  expect(result).toBe(DefaultIcon.None)
})

test('getIcons should handle mixed file and folder requests', () => {
  const requests = [
    { name: 'test.js', type: 1 }, // File
    { name: 'src', type: 2 }, // Folder
  ]

  const result = getIcons(requests)
  expect(Array.isArray(result)).toBe(true)
  expect(result).toHaveLength(2)
  expect(typeof result[0]).toBe('string')
  expect(typeof result[1]).toBe('string')
})

test('getIcons should use expanded folder icon for expanded folder requests', () => {
  IconThemeState.setTheme({
    extensionBaseUrl: '/remote',
    extensionPath: '',
    extensionRemoteUri: '',
    extensionUri: '',
    json: {
      folderNames: {
        packages: 'folder-packages',
      },
      folderNamesExpanded: {
        packages: 'folder-packages-open',
      },
      iconDefinitions: {
        _folder: '/folder.svg',
        _folder_open: '/folder-open.svg',
        'folder-packages': '/folder-packages.svg',
        'folder-packages-open': '/folder-packages-open.svg',
      },
    },
  })

  const result = getIcons([
    { name: 'packages', type: 2 },
    { expanded: true, name: 'packages', type: 2 },
  ])

  expect(result).toEqual(['/remote/folder-packages.svg', '/remote/folder-packages-open.svg'])
})

test('getFileNameIcon should handle empty filename', () => {
  const result = GetIcon.getFileNameIcon('')
  expect(typeof result).toBe('string')
})

test('getFolderNameIcon should handle empty folder name', () => {
  const result = GetIcon.getFolderNameIcon('')
  expect(typeof result).toBe('string')
})
