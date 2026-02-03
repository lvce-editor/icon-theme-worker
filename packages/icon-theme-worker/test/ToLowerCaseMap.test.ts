import { expect, test } from '@jest/globals'
import * as ToLowerCaseMap from '../src/parts/ToLowerCaseMap/ToLowerCaseMap.ts'

test('toLowerCaseMap should convert all keys to lowercase', () => {
  const input = {
    LICENSE: 'license-icon',
    'Package.JSON': 'package-icon',
    README: 'readme-icon',
  }
  const result = ToLowerCaseMap.toLowerCaseMap(input)
  expect(result).toEqual({
    license: 'license-icon',
    'package.json': 'package-icon',
    readme: 'readme-icon',
  })
})

test('toLowerCaseMap should handle empty object', () => {
  const input = {}
  const result = ToLowerCaseMap.toLowerCaseMap(input)
  expect(result).toEqual({})
})

test('toLowerCaseMap should handle already lowercase keys', () => {
  const input = {
    license: 'license-icon',
    'package.json': 'package-icon',
    readme: 'readme-icon',
  }
  const result = ToLowerCaseMap.toLowerCaseMap(input)
  expect(result).toEqual({
    license: 'license-icon',
    'package.json': 'package-icon',
    readme: 'readme-icon',
  })
})

test('toLowerCaseMap should preserve values unchanged', () => {
  const input = {
    'Document.PDF': 'MixedCaseValue',
    'FILE.TXT': 'UPPERCASE_VALUE',
    'image.PNG': 'lowercase_value',
  }
  const result = ToLowerCaseMap.toLowerCaseMap(input)
  expect(result).toEqual({
    'document.pdf': 'MixedCaseValue',
    'file.txt': 'UPPERCASE_VALUE',
    'image.png': 'lowercase_value',
  })
})

test('toLowerCaseMap should handle special characters in keys', () => {
  const input = {
    'File_Name.JS': 'js-icon',
    'File-Name.TXT': 'file-icon',
    'File.Name.CSS': 'css-icon',
  }
  const result = ToLowerCaseMap.toLowerCaseMap(input)
  expect(result).toEqual({
    'file_name.js': 'js-icon',
    'file-name.txt': 'file-icon',
    'file.name.css': 'css-icon',
  })
})

test('toLowerCaseMap should handle single entry', () => {
  const input = {
    'SINGLE.FILE': 'icon',
  }
  const result = ToLowerCaseMap.toLowerCaseMap(input)
  expect(result).toEqual({
    'single.file': 'icon',
  })
})

test('toLowerCaseMap should handle keys with different cases for same word', () => {
  const input = {
    README: 'readme-icon-1',
    readme: 'readme-icon-3',
    ReadMe: 'readme-icon-2',
  }
  const result = ToLowerCaseMap.toLowerCaseMap(input)
  // Note: The last entry will win when keys collide after lowercasing
  expect(result.readme).toBeDefined()
  expect(Object.keys(result).length).toBe(1)
})

test('toLowerCaseMap should handle numeric strings in keys', () => {
  const input = {
    '123.JSON': 'json-icon',
    'File123.TXT': 'text-icon',
  }
  const result = ToLowerCaseMap.toLowerCaseMap(input)
  expect(result).toEqual({
    '123.json': 'json-icon',
    'file123.txt': 'text-icon',
  })
})

test('toLowerCaseMap should handle unicode characters', () => {
  const input = {
    'ФАЙЛ.TXT': 'file-icon',
    '文件.JSON': 'json-icon',
  }
  const result = ToLowerCaseMap.toLowerCaseMap(input)
  expect(result['файл.txt']).toBe('file-icon')
  expect(result['文件.json']).toBe('json-icon')
})

test('toLowerCaseMap should not mutate the original object', () => {
  const input = {
    LICENSE: 'license-icon',
    README: 'readme-icon',
  }
  const originalKeys = Object.keys(input)
  ToLowerCaseMap.toLowerCaseMap(input)
  expect(Object.keys(input)).toEqual(originalKeys)
  expect(input.LICENSE).toBe('license-icon')
  expect(input.README).toBe('readme-icon')
})
