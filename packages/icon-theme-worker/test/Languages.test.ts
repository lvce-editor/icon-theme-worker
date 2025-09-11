import { test, expect, beforeEach } from '@jest/globals'
import type { Language } from '../src/parts/Language/Language.ts'
import * as Languages from '../src/parts/Languages/Languages.ts'

beforeEach(() => {
  Languages.reset()
})

test('addLanguages should add languages with extensions to state', () => {
  const languages: readonly Language[] = [
    {
      id: 'javascript',
      extensions: ['.js', '.jsx'],
      extensionPath: '',
      tokenize: '',
    },
    {
      id: 'typescript',
      extensions: ['.ts', '.tsx'],
      extensionPath: '',
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
      id: 'plaintext',
      extensions: undefined,
      extensionPath: '',
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
      id: 'plaintext',
      extensions: [],
      extensionPath: '',
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
      id: 'javascript',
      extensions: ['.js'],
      extensionPath: '',
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
      id: 'typescript',
      extensions: ['.ts'],
      extensionPath: '',
      tokenize: '',
    },
    {
      id: 'javascript',
      extensions: ['.js'],
      extensionPath: '',
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
      id: 'json',
      extensions: ['.json'],
      extensionPath: '',
      tokenize: '',
    },
    {
      id: 'typescript',
      extensions: ['.ts'],
      extensionPath: '',
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
      id: 'javascript',
      extensions: ['.js'],
      extensionPath: '',
      tokenize: '',
    },
  ]

  const secondLanguages: readonly Language[] = [
    {
      id: 'typescript',
      extensions: ['.js'], // Same extension, different language
      extensionPath: '',
      tokenize: '',
    },
  ]

  Languages.addLanguages(firstLanguages)
  expect(Languages.getLanguageId('test.js')).toBe('javascript')

  Languages.addLanguages(secondLanguages)
  expect(Languages.getLanguageId('test.js')).toBe('typescript')
})
