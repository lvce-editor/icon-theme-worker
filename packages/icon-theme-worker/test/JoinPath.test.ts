import { test, expect } from '@jest/globals'
import * as JoinPath from '../src/parts/JoinPath/JoinPath.ts'

test('joinPath should handle single part', () => {
  const result = JoinPath.joinPath('foo')
  expect(result).toBe('foo')
})

test('joinPath should handle two parts with no slashes', () => {
  const result = JoinPath.joinPath('foo', 'bar')
  expect(result).toBe('foo/bar')
})

test('joinPath should handle trailing slash on first part', () => {
  const result = JoinPath.joinPath('foo/', 'bar')
  expect(result).toBe('foo/bar')
})

test('joinPath should handle leading slash on second part', () => {
  const result = JoinPath.joinPath('foo', '/bar')
  expect(result).toBe('foo/bar')
})

test('joinPath should handle both trailing and leading slashes', () => {
  const result = JoinPath.joinPath('foo/', '/bar')
  expect(result).toBe('foo/bar')
})

test('joinPath should handle multiple parts', () => {
  const result = JoinPath.joinPath('foo', 'bar', 'baz')
  expect(result).toBe('foo/bar/baz')
})

test('joinPath should handle multiple parts with mixed slashes', () => {
  const result = JoinPath.joinPath('foo/', '/bar/', '/baz')
  expect(result).toBe('foo/bar/baz')
})

test('joinPath should handle empty string parts', () => {
  const result = JoinPath.joinPath('foo', '', 'bar')
  expect(result).toBe('foo/bar')
})

test('joinPath should handle root path', () => {
  const result = JoinPath.joinPath('/', 'foo')
  expect(result).toBe('/foo')
})

test('joinPath should handle root path with trailing slash', () => {
  const result = JoinPath.joinPath('/', '/foo')
  expect(result).toBe('/foo')
})

test('joinPath should handle absolute paths', () => {
  const result = JoinPath.joinPath('/home/user', 'documents', 'file.txt')
  expect(result).toBe('/home/user/documents/file.txt')
})

test('joinPath should preserve multiple slashes when necessary', () => {
  const result = JoinPath.joinPath('foo//', '//bar')
  expect(result).toBe('foo///bar')
})

test('joinPath should handle single argument with slashes', () => {
  const result = JoinPath.joinPath('/foo/bar/baz')
  expect(result).toBe('/foo/bar/baz')
})

test('joinPath should handle no arguments', () => {
  const result = JoinPath.joinPath()
  expect(result).toBe('')
})
