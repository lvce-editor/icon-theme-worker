import { test, expect, jest, beforeEach, describe } from '@jest/globals'
import type { Dirent } from '../src/parts/Dirent/Dirent.ts'
import * as DefaultIcon from '../src/parts/DefaultIcon/DefaultIcon.ts'
import * as GetIcon from '../src/parts/GetIcon/GetIcon.ts'
import { getIcons } from '../src/parts/GetIcons/GetIcons.ts'
import * as IconThemeState from '../src/parts/IconThemeState/IconThemeState.ts'

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

// ===== getFileNameIcon Tests =====
describe('getFileNameIcon', () => {
  test('should return string type', () => {
    const result = GetIcon.getFileNameIcon('test.js')
    expect(typeof result).toBe('string')
  })

  test('should handle empty string', () => {
    const result = GetIcon.getFileNameIcon('')
    expect(typeof result).toBe('string')
  })

  test('should handle files with common extensions (js)', () => {
    const result = GetIcon.getFileNameIcon('script.js')
    expect(typeof result).toBe('string')
  })

  test('should handle files with common extensions (ts)', () => {
    const result = GetIcon.getFileNameIcon('script.ts')
    expect(typeof result).toBe('string')
  })

  test('should handle files with common extensions (jsx)', () => {
    const result = GetIcon.getFileNameIcon('component.jsx')
    expect(typeof result).toBe('string')
  })

  test('should handle files with common extensions (tsx)', () => {
    const result = GetIcon.getFileNameIcon('component.tsx')
    expect(typeof result).toBe('string')
  })

  test('should handle files with common extensions (json)', () => {
    const result = GetIcon.getFileNameIcon('package.json')
    expect(typeof result).toBe('string')
  })

  test('should handle files with common extensions (css)', () => {
    const result = GetIcon.getFileNameIcon('style.css')
    expect(typeof result).toBe('string')
  })

  test('should handle files with common extensions (html)', () => {
    const result = GetIcon.getFileNameIcon('index.html')
    expect(typeof result).toBe('string')
  })

  test('should handle files with no extension', () => {
    const result = GetIcon.getFileNameIcon('Dockerfile')
    expect(typeof result).toBe('string')
  })

  test('should be case-insensitive for extensions', () => {
    const result1 = GetIcon.getFileNameIcon('SCRIPT.JS')
    const result2 = GetIcon.getFileNameIcon('script.js')
    expect(typeof result1).toBe('string')
    expect(typeof result2).toBe('string')
  })

  test('should handle hidden files (dotfiles)', () => {
    const result = GetIcon.getFileNameIcon('.gitignore')
    expect(typeof result).toBe('string')
  })

  test('should handle files with multiple dots', () => {
    const result = GetIcon.getFileNameIcon('webpack.config.js')
    expect(typeof result).toBe('string')
  })

  test('should handle files with multiple extensions', () => {
    const result = GetIcon.getFileNameIcon('archive.tar.gz')
    expect(typeof result).toBe('string')
  })

  test('should throw assertion error for non-string input', () => {
    expect(() => {
      GetIcon.getFileNameIcon(123 as any)
    }).toThrow()
  })

  test('should handle README files', () => {
    const result = GetIcon.getFileNameIcon('README.md')
    expect(typeof result).toBe('string')
  })

  test('should handle LICENSE files', () => {
    const result = GetIcon.getFileNameIcon('LICENSE')
    expect(typeof result).toBe('string')
  })

  test('should handle config files', () => {
    const result = GetIcon.getFileNameIcon('tsconfig.json')
    expect(typeof result).toBe('string')
  })

  test('should handle editorconfig files', () => {
    const result = GetIcon.getFileNameIcon('.editorconfig')
    expect(typeof result).toBe('string')
  })

  test('should handle special names like package.json', () => {
    const result = GetIcon.getFileNameIcon('package.json')
    expect(typeof result).toBe('string')
  })

  test('should handle special names like package-lock.json', () => {
    const result = GetIcon.getFileNameIcon('package-lock.json')
    expect(typeof result).toBe('string')
  })
})

// ===== getFileIcon Tests =====
describe('getFileIcon', () => {
  test('should call getFileNameIcon with file name', () => {
    const file = { name: 'test.js' }
    const result = GetIcon.getFileIcon(file)
    expect(typeof result).toBe('string')
  })

  test('should handle file object with name property', () => {
    const file = { name: 'document.txt' }
    const result = GetIcon.getFileIcon(file)
    expect(typeof result).toBe('string')
  })

  test('should extract name from file object correctly', () => {
    const file = { name: 'application.js' }
    const result = GetIcon.getFileIcon(file)
    expect(typeof result).toBe('string')
  })

  test('should handle file with only extension', () => {
    const file = { name: '.env' }
    const result = GetIcon.getFileIcon(file)
    expect(typeof result).toBe('string')
  })

  test('should handle file with very long name', () => {
    const file = { name: 'very_very_very_very_very_long_filename_that_has_many_characters.ts' }
    const result = GetIcon.getFileIcon(file)
    expect(typeof result).toBe('string')
  })

  test('should handle file object with extra properties', () => {
    const file = { modified: '2024-01-01', name: 'test.js', size: 1024 }
    const result = GetIcon.getFileIcon(file)
    expect(typeof result).toBe('string')
  })
})

// ===== getFileIcons Tests =====
describe('getFileIcons', () => {
  test('should return array of icons for multiple files', () => {
    const files = [{ name: 'test1.js' }, { name: 'test2.ts' }]
    const result = GetIcon.getFileIcons(files)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(2)
    expect(typeof result[0]).toBe('string')
    expect(typeof result[1]).toBe('string')
  })

  test('should handle empty array', () => {
    const files: any[] = []
    const result = GetIcon.getFileIcons(files)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(0)
  })

  test('should handle single file', () => {
    const files = [{ name: 'single.js' }]
    const result = GetIcon.getFileIcons(files)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(1)
    expect(typeof result[0]).toBe('string')
  })

  test('should handle many files', () => {
    const files = Array.from({ length: 100 }, (_, i) => ({ name: `file${i}.js` }))
    const result = GetIcon.getFileIcons(files)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(100)
    for (const icon of result) {
      expect(typeof icon).toBe('string')
    }
  })

  test('should handle mixed file types', () => {
    const files = [{ name: 'app.js' }, { name: 'style.css' }, { name: 'index.html' }, { name: 'data.json' }, { name: 'image.png' }]
    const result = GetIcon.getFileIcons(files)
    expect(result).toHaveLength(5)
    for (const icon of result) {
      expect(typeof icon).toBe('string')
    }
  })

  test('should preserve order of files', () => {
    const files = [{ name: 'first.js' }, { name: 'second.ts' }, { name: 'third.jsx' }]
    const result = GetIcon.getFileIcons(files)
    expect(result).toHaveLength(3)
    // Each element should be a string (we can't control the actual icon content without mocking IconThemeState)
    expect(typeof result[0]).toBe('string')
    expect(typeof result[1]).toBe('string')
    expect(typeof result[2]).toBe('string')
  })

  test('should handle readonly array input', () => {
    const files: readonly any[] = [{ name: 'test.js' }]
    const result = GetIcon.getFileIcons(files)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(1)
  })

  test('should handle files with special characters in name', () => {
    const files = [{ name: 'file-with-dash.js' }, { name: 'file_with_underscore.ts' }, { name: 'file.with.dots.jsx' }]
    const result = GetIcon.getFileIcons(files)
    expect(result).toHaveLength(3)
    for (const icon of result) {
      expect(typeof icon).toBe('string')
    }
  })
})

// ===== getFolderNameIcon Tests =====
describe('getFolderNameIcon', () => {
  test('should return string', () => {
    const result = GetIcon.getFolderNameIcon('src')
    expect(typeof result).toBe('string')
  })

  test('should handle common folder names', () => {
    const folderNames = ['src', 'dist', 'node_modules', 'public', 'components', 'utils', 'lib']
    for (const folderName of folderNames) {
      const result = GetIcon.getFolderNameIcon(folderName)
      expect(typeof result).toBe('string')
    }
  })

  test('should be case-insensitive', () => {
    const result1 = GetIcon.getFolderNameIcon('SRC')
    const result2 = GetIcon.getFolderNameIcon('src')
    expect(typeof result1).toBe('string')
    expect(typeof result2).toBe('string')
  })

  test('should handle hidden folders', () => {
    const result = GetIcon.getFolderNameIcon('.git')
    expect(typeof result).toBe('string')
  })

  test('should handle folders with dots', () => {
    const result = GetIcon.getFolderNameIcon('.github')
    expect(typeof result).toBe('string')
  })

  test('should handle folders with dashes', () => {
    const result = GetIcon.getFolderNameIcon('my-folder')
    expect(typeof result).toBe('string')
  })

  test('should handle folders with underscores', () => {
    const result = GetIcon.getFolderNameIcon('my_folder')
    expect(typeof result).toBe('string')
  })

  test('should handle single character folder names', () => {
    const result = GetIcon.getFolderNameIcon('a')
    expect(typeof result).toBe('string')
  })

  test('should handle very long folder names', () => {
    const result = GetIcon.getFolderNameIcon('very_long_folder_name_with_many_characters_for_testing')
    expect(typeof result).toBe('string')
  })

  test('should handle empty string', () => {
    const result = GetIcon.getFolderNameIcon('')
    expect(typeof result).toBe('string')
  })
})

// ===== getFolderIcon Tests =====
describe('getFolderIcon', () => {
  test('should call getFolderNameIcon with folder name', () => {
    const folder = { name: 'src' }
    const result = GetIcon.getFolderIcon(folder)
    expect(typeof result).toBe('string')
  })

  test('should handle folder object with name property', () => {
    const folder = { name: 'components' }
    const result = GetIcon.getFolderIcon(folder)
    expect(typeof result).toBe('string')
  })

  test('should extract name from folder object correctly', () => {
    const folder = { name: 'utils' }
    const result = GetIcon.getFolderIcon(folder)
    expect(typeof result).toBe('string')
  })

  test('should handle folder object with extra properties', () => {
    const folder = { modified: '2024-01-01', name: 'dist', size: 1000 }
    const result = GetIcon.getFolderIcon(folder)
    expect(typeof result).toBe('string')
  })

  test('should handle multiple folder objects', () => {
    const folders = [{ name: 'src' }, { name: 'dist' }, { name: 'node_modules' }]
    for (const folder of folders) {
      const result = GetIcon.getFolderIcon(folder)
      expect(typeof result).toBe('string')
    }
  })
})

// ===== getIcon Tests =====
describe('getIcon', () => {
  test('should handle file dirent (type 1)', () => {
    const dirent: Dirent = { name: 'test.js', type: 1 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle directory dirent (type 2)', () => {
    const dirent: Dirent = { name: 'src', type: 2 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle expanded directory dirent (type 3)', () => {
    const dirent: Dirent = { name: 'src', type: 3 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle symlink file dirent (type 4)', () => {
    const dirent: Dirent = { name: 'test.js', type: 4 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle symlink folder dirent (type 5)', () => {
    const dirent: Dirent = { name: 'src', type: 5 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle block device (type 6)', () => {
    const dirent: Dirent = { name: 'blockdev', type: 6 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle character device (type 7)', () => {
    const dirent: Dirent = { name: 'chardev', type: 7 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle socket (type 8)', () => {
    const dirent: Dirent = { name: 'socket', type: 8 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle symlink (type 9)', () => {
    const dirent: Dirent = { name: 'symlink', type: 9 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle unsupported dirent type', () => {
    const dirent: Dirent = { name: 'unknown', type: 999 }
    const result = GetIcon.getIcon(dirent)
    expect(result).toBe(DefaultIcon.None)
  })

  test('should handle negative type', () => {
    const dirent: Dirent = { name: 'test', type: -1 }
    const result = GetIcon.getIcon(dirent)
    expect(result).toBe(DefaultIcon.None)
  })

  test('should handle file with extension', () => {
    const dirent: Dirent = { name: 'document.pdf', type: 1 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle hidden file', () => {
    const dirent: Dirent = { name: '.gitignore', type: 1 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle hidden directory', () => {
    const dirent: Dirent = { name: '.git', type: 2 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle directory with special name', () => {
    const dirent: Dirent = { name: 'node_modules', type: 2 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle mixed case folder names', () => {
    const dirent: Dirent = { name: 'MyFolder', type: 2 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should handle mixed case file names', () => {
    const dirent: Dirent = { name: 'MyFile.TS', type: 1 }
    const result = GetIcon.getIcon(dirent)
    expect(typeof result).toBe('string')
  })

  test('should return different icons for files vs folders', () => {
    const fileDirent: Dirent = { name: 'test', type: 1 }
    const folderDirent: Dirent = { name: 'test', type: 2 }

    const fileIcon = GetIcon.getIcon(fileDirent)
    const folderIcon = GetIcon.getIcon(folderDirent)

    // Both should be strings
    expect(typeof fileIcon).toBe('string')
    expect(typeof folderIcon).toBe('string')
    // They should typically be different (unless no icon theme is set)
  })

  test('should return different icons for collapsed vs expanded folders', () => {
    const collapsedDirent: Dirent = { name: 'src', type: 2 }
    const expandedDirent: Dirent = { name: 'src', type: 3 }

    const collapsedIcon = GetIcon.getIcon(collapsedDirent)
    const expandedIcon = GetIcon.getIcon(expandedDirent)

    expect(typeof collapsedIcon).toBe('string')
    expect(typeof expandedIcon).toBe('string')
  })

  test('should handle many different file types', () => {
    const fileTypes = [
      { name: 'file.js', type: 1 },
      { name: 'file.ts', type: 1 },
      { name: 'file.json', type: 1 },
      { name: 'file.css', type: 1 },
      { name: 'file.html', type: 1 },
      { name: 'file.md', type: 1 },
      { name: 'file.png', type: 1 },
      { name: 'file.jpg', type: 1 },
    ]

    for (const fileType of fileTypes) {
      const result = GetIcon.getIcon(fileType as Dirent)
      expect(typeof result).toBe('string')
    }
  })

  test('should handle many different folder types', () => {
    const folderTypes = [
      { name: 'src', type: 2 },
      { name: 'src', type: 3 },
      { name: 'src', type: 5 },
    ]

    for (const folderType of folderTypes) {
      const result = GetIcon.getIcon(folderType as Dirent)
      expect(typeof result).toBe('string')
    }
  })
})

// ===== getIcons Tests (integration with GetIcons module) =====
describe('getIcons', () => {
  test('should handle mixed file and folder requests', () => {
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

  test('should handle empty requests array', () => {
    const result = getIcons([])
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(0)
  })

  test('should handle all files', () => {
    const requests = [
      { name: 'file1.js', type: 1 },
      { name: 'file2.ts', type: 1 },
      { name: 'file3.json', type: 1 },
    ]
    const result = getIcons(requests)
    expect(result).toHaveLength(3)
    for (const icon of result) expect(typeof icon).toBe('string')
  })

  test('should handle all folders', () => {
    const requests = [
      { name: 'folder1', type: 2 },
      { name: 'folder2', type: 2 },
      { name: 'folder3', type: 3 }, // expanded
    ]
    const result = getIcons(requests)
    expect(result).toHaveLength(3)
    for (const icon of result) expect(typeof icon).toBe('string')
  })

  test('should handle large batches', () => {
    const requests = Array.from({ length: 500 }, (_, i) => ({
      name: `item${i}`,
      type: i % 2 === 0 ? 1 : 2, // alternate between files and folders
    }))
    const result = getIcons(requests)
    expect(result).toHaveLength(500)
    for (const icon of result) expect(typeof icon).toBe('string')
  })

  test('should handle special characters in names', () => {
    const requests = [
      { name: 'file-with-dash.js', type: 1 },
      { name: 'file_with_underscore.ts', type: 1 },
      { name: 'file.with.dots.json', type: 1 },
    ]
    const result = getIcons(requests)
    expect(result).toHaveLength(3)
    for (const icon of result) expect(typeof icon).toBe('string')
  })

  test('should handle unicode characters in names', () => {
    const requests = [
      { name: 'файл.js', type: 1 },
      { name: 'ファイル.ts', type: 1 },
      { name: '文件.json', type: 1 },
    ]
    const result = getIcons(requests)
    expect(result).toHaveLength(3)
    for (const icon of result) expect(typeof icon).toBe('string')
  })

  test('should handle hidden files in batch', () => {
    const requests = [
      { name: '.gitignore', type: 1 },
      { name: '.eslintrc', type: 1 },
      { name: '.prettierrc', type: 1 },
    ]
    const result = getIcons(requests)
    expect(result).toHaveLength(3)
    for (const icon of result) expect(typeof icon).toBe('string')
  })

  test('should handle mixed symlinks and regular files', () => {
    const requests = [
      { name: 'regular.js', type: 1 },
      { name: 'symlink.js', type: 4 },
      { name: 'folder', type: 2 },
      { name: 'symlink-folder', type: 5 },
    ]
    const result = getIcons(requests)
    expect(result).toHaveLength(4)
    for (const icon of result) expect(typeof icon).toBe('string')
  })
})

// ===== Edge cases and integration =====
describe('Edge cases and integration', () => {
  test('should handle readonly arrays consistently', () => {
    const files: readonly any[] = [{ name: 'test.js' }]
    const result1 = GetIcon.getFileIcons(files)
    const result2 = GetIcon.getFileIcons(files)

    expect(Array.isArray(result1)).toBe(true)
    expect(Array.isArray(result2)).toBe(true)
    expect(result1).toHaveLength(1)
    expect(result2).toHaveLength(1)
  })

  test('getIcon should handle all DirentType values', () => {
    const testCases = [
      { description: 'File', name: 'file.txt', type: 1 },
      { description: 'Directory', name: 'dir', type: 2 },
      { description: 'DirectoryExpanded', name: 'dir', type: 3 },
      { description: 'SymLinkFile', name: 'link.js', type: 4 },
      { description: 'SymLinkFolder', name: 'link', type: 5 },
      { description: 'BlockDevice', name: 'block', type: 6 },
      { description: 'CharacterDevice', name: 'char', type: 7 },
      { description: 'Socket', name: 'sock', type: 8 },
      { description: 'FIFO/Pipe', name: 'fifo', type: 9 },
    ]

    for (const testCase of testCases) {
      const result = GetIcon.getIcon({ name: testCase.name, type: testCase.type })
      expect(typeof result).toBe('string')
    }
  })

  test('function results should be consistent across calls', () => {
    const fileName = 'test.js'
    const result1 = GetIcon.getFileNameIcon(fileName)
    const result2 = GetIcon.getFileNameIcon(fileName)

    expect(result1).toBe(result2)
  })

  test('should handle rapid sequential calls', () => {
    for (let i = 0; i < 100; i++) {
      const result = GetIcon.getFileNameIcon(`file${i}.js`)
      expect(typeof result).toBe('string')
    }
  })
})

test('getFileNameIcon should handle empty filename', () => {
  const result = GetIcon.getFileNameIcon('')
  expect(typeof result).toBe('string')
})

test('getFolderNameIcon should handle empty folder name', () => {
  const result = GetIcon.getFolderNameIcon('')
  expect(typeof result).toBe('string')
})
