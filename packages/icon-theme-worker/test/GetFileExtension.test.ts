import { expect, test } from '@jest/globals'
import * as GetFileExtension from '../src/parts/GetFileExtension/GetFileExtension.ts'

test('getFileExtensionIndex should return correct index for files with extension', () => {
  expect(GetFileExtension.getFileExtensionIndex('file.txt')).toBe(4)
  expect(GetFileExtension.getFileExtensionIndex('document.pdf')).toBe(8)
  expect(GetFileExtension.getFileExtensionIndex('image.png')).toBe(5)
  expect(GetFileExtension.getFileExtensionIndex('script.js')).toBe(6)
  expect(GetFileExtension.getFileExtensionIndex('style.css')).toBe(5)
})

test('getFileExtensionIndex should return -1 for files without extension', () => {
  expect(GetFileExtension.getFileExtensionIndex('file')).toBe(-1)
  expect(GetFileExtension.getFileExtensionIndex('document')).toBe(-1)
  expect(GetFileExtension.getFileExtensionIndex('README')).toBe(-1)
})

test('getFileExtensionIndex should return last dot index for files with multiple dots', () => {
  expect(GetFileExtension.getFileExtensionIndex('file.backup.txt')).toBe(11)
  expect(GetFileExtension.getFileExtensionIndex('config.local.json')).toBe(12)
  expect(GetFileExtension.getFileExtensionIndex('archive.tar.gz')).toBe(11)
})

test('getFileExtensionIndex should handle edge cases', () => {
  expect(GetFileExtension.getFileExtensionIndex('.hidden')).toBe(0)
  expect(GetFileExtension.getFileExtensionIndex('file.')).toBe(4)
  expect(GetFileExtension.getFileExtensionIndex('')).toBe(-1)
  expect(GetFileExtension.getFileExtensionIndex('.')).toBe(0)
})

test('getFileExtensionIndex should throw error for non-string input', () => {
  expect(() => GetFileExtension.getFileExtensionIndex(null as any)).toThrow()
  expect(() => GetFileExtension.getFileExtensionIndex(undefined as any)).toThrow()
  expect(() => GetFileExtension.getFileExtensionIndex(123 as any)).toThrow()
  expect(() => GetFileExtension.getFileExtensionIndex({} as any)).toThrow()
})

test('getNthFileExtension should return correct index for valid startIndex', () => {
  expect(GetFileExtension.getNthFileExtension('file.backup.txt', 0)).toBe(-1)
  expect(GetFileExtension.getNthFileExtension('file.backup.txt', 5)).toBe(4)
  expect(GetFileExtension.getNthFileExtension('file.backup.txt', 10)).toBe(4)
  expect(GetFileExtension.getNthFileExtension('file.backup.txt', 11)).toBe(11)
})

test('getNthFileExtension should return -1 when no dot found before startIndex', () => {
  expect(GetFileExtension.getNthFileExtension('file.backup.txt', 12)).toBe(11)
  expect(GetFileExtension.getNthFileExtension('file.backup.txt', 15)).toBe(11)
  expect(GetFileExtension.getNthFileExtension('file', 0)).toBe(-1)
  expect(GetFileExtension.getNthFileExtension('file', 5)).toBe(-1)
})

test('getNthFileExtension should handle negative startIndex', () => {
  expect(GetFileExtension.getNthFileExtension('file.backup.txt', -1)).toBe(-1)
  expect(GetFileExtension.getNthFileExtension('file.backup.txt', -5)).toBe(-1)
})

test('getNthFileExtension should handle startIndex beyond string length', () => {
  expect(GetFileExtension.getNthFileExtension('file.txt', 8)).toBe(4)
  expect(GetFileExtension.getNthFileExtension('file.txt', 100)).toBe(4)
})

test('getNthFileExtension should work with single dot files', () => {
  expect(GetFileExtension.getNthFileExtension('file.txt', 0)).toBe(-1)
  expect(GetFileExtension.getNthFileExtension('file.txt', 4)).toBe(4)
  expect(GetFileExtension.getNthFileExtension('file.txt', 6)).toBe(4)
})

test('getNthFileExtension should work with files starting with dot', () => {
  expect(GetFileExtension.getNthFileExtension('.hidden', 0)).toBe(0)
  expect(GetFileExtension.getNthFileExtension('.hidden', 1)).toBe(0)
  expect(GetFileExtension.getNthFileExtension('.hidden.txt', 0)).toBe(0)
  expect(GetFileExtension.getNthFileExtension('.hidden.txt', 1)).toBe(0)
  expect(GetFileExtension.getNthFileExtension('.hidden.txt', 7)).toBe(7)
  expect(GetFileExtension.getNthFileExtension('.hidden.txt', 8)).toBe(7)
})
