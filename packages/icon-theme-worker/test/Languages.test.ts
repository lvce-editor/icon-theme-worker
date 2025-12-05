import { test, expect, beforeEach } from '@jest/globals'
import type { Language } from '../src/parts/Language/Language.ts'
import * as Languages from '../src/parts/Languages/Languages.ts'

beforeEach(() => {
  Languages.reset()
})

test('addLanguages should add languages with extensions to state', () => {
  const languages: readonly Language[] = [
    {
      extensionPath: '',
      extensions: ['.js', '.jsx'],
      id: 'javascript',
      tokenize: '',
    },
    {
      extensionPath: '',
      extensions: ['.ts', '.tsx'],
      id: 'typescript',
      tokenize: '',
    },
  ]

  Languages.addLanguages(languages)

  expect(Languages.getLanguageId('test.js')).toBe('javascript')
  expect(Languages.getLanguageId('test.jsx')).toBe('javascript')
  expect(Languages.getLanguageId('test.ts')).toBe('typescript')
  expect(Languages.getLanguageId('test.tsx')).toBe('typescript')
})

test('addLanguages should handle languages without extensions', () => {
  const languages: readonly Language[] = [
    {
      extensionPath: '',
      extensions: undefined,
      id: 'plaintext',
      tokenize: '',
    },
  ]

  Languages.addLanguages(languages)

  // Should not affect any file extensions
  expect(Languages.getLanguageId('test.txt')).toBe('')
})

test('addLanguages should handle empty extensions array', () => {
  const languages: readonly Language[] = [
    {
      extensionPath: '',
      extensions: [],
      id: 'plaintext',
      tokenize: '',
    },
  ]

  Languages.addLanguages(languages)

  // Should not affect any file extensions
  expect(Languages.getLanguageId('test.txt')).toBe('')
})

test('getLanguageId should return empty string for unknown file extension', () => {
  const result = Languages.getLanguageId('unknown.xyz')
  expect(result).toBe('')
})

test('getLanguageId should handle files without extensions', () => {
  const result = Languages.getLanguageId('README')
  expect(result).toBe('')
})

test('getLanguageId should handle empty filename', () => {
  const result = Languages.getLanguageId('')
  expect(result).toBe('')
})

test('getLanguageId should be case insensitive', () => {
  const languages: readonly Language[] = [
    {
      extensionPath: '',
      extensions: ['.js'],
      id: 'javascript',
      tokenize: '',
    },
  ]

  Languages.addLanguages(languages)

  expect(Languages.getLanguageId('test.JS')).toBe('javascript')
  expect(Languages.getLanguageId('test.Js')).toBe('javascript')
  expect(Languages.getLanguageId('test.js')).toBe('javascript')
})

test('getLanguageId should handle multiple extensions in filename', () => {
  const languages: readonly Language[] = [
    {
      extensionPath: '',
      extensions: ['.ts'],
      id: 'typescript',
      tokenize: '',
    },
    {
      extensionPath: '',
      extensions: ['.js'],
      id: 'javascript',
      tokenize: '',
    },
  ]

  Languages.addLanguages(languages)

  // Should match the last extension
  expect(Languages.getLanguageId('test.config.js')).toBe('javascript')
  expect(Languages.getLanguageId('test.d.ts')).toBe('typescript')
})

test('getLanguageId should handle complex filenames with multiple dots', () => {
  const languages: readonly Language[] = [
    {
      extensionPath: '',
      extensions: ['.json'],
      id: 'json',
      tokenize: '',
    },
    {
      extensionPath: '',
      extensions: ['.ts'],
      id: 'typescript',
      tokenize: '',
    },
  ]

  Languages.addLanguages(languages)

  expect(Languages.getLanguageId('package.json')).toBe('json')
  expect(Languages.getLanguageId('test.spec.ts')).toBe('typescript')
  expect(Languages.getLanguageId('test.config.json')).toBe('json')
})

test('addLanguages should overwrite existing language mappings', () => {
  const firstLanguages: readonly Language[] = [
    {
      extensionPath: '',
      extensions: ['.js'],
      id: 'javascript',
      tokenize: '',
    },
  ]

  const secondLanguages: readonly Language[] = [
    {
      extensionPath: '',
      extensions: ['.js'], // Same extension, different language
      id: 'typescript',
      tokenize: '',
    },
  ]

  Languages.addLanguages(firstLanguages)
  expect(Languages.getLanguageId('test.js')).toBe('javascript')

  Languages.addLanguages(secondLanguages)
  expect(Languages.getLanguageId('test.js')).toBe('typescript')
})
