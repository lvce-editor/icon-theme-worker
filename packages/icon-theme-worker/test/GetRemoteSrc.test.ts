import { test, expect } from '@jest/globals'
import { getRemoteSrc } from '../src/parts/GetRemoteSrc/GetRemoteSrc.ts'

test('getRemoteSrc should prepend /remote to URI', () => {
  const result = getRemoteSrc('/some/path')
  expect(result).toBe('/remote/some/path')
})

test('getRemoteSrc should handle empty URI', () => {
  const result = getRemoteSrc('')
  expect(result).toBe('/remote')
})

test('getRemoteSrc should handle URI without leading slash', () => {
  const result = getRemoteSrc('some/path')
  expect(result).toBe('/remotesome/path')
})

test('getRemoteSrc should handle complex URI with query params', () => {
  const result = getRemoteSrc('/api/data?param=value&other=123')
  expect(result).toBe('/remote/api/data?param=value&other=123')
})

test('getRemoteSrc should handle URI with hash', () => {
  const result = getRemoteSrc('/path#section')
  expect(result).toBe('/remote/path#section')
})
