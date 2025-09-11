import { jest, test, expect } from '@jest/globals'
import { info, warn, error } from '../src/parts/Logger/Logger.js'

test('info should call console.info with provided arguments', () => {
  const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

  info('test message', 123, { key: 'value' })

  expect(consoleSpy).toHaveBeenCalledWith('test message', 123, { key: 'value' })

  consoleSpy.mockRestore()
})

test('warn should call console.warn with provided arguments', () => {
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

  warn('warning message', 456, { error: 'test' })

  expect(consoleSpy).toHaveBeenCalledWith('warning message', 456, { error: 'test' })

  consoleSpy.mockRestore()
})

test('error should call console.error with provided arguments', () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  error('error message', 789, { stack: 'trace' })

  expect(consoleSpy).toHaveBeenCalledWith('error message', 789, { stack: 'trace' })

  consoleSpy.mockRestore()
})

test('info should handle no arguments', () => {
  const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

  info()

  expect(consoleSpy).toHaveBeenCalledWith()

  consoleSpy.mockRestore()
})

test('warn should handle no arguments', () => {
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

  warn()

  expect(consoleSpy).toHaveBeenCalledWith()

  consoleSpy.mockRestore()
})

test('error should handle no arguments', () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  error()

  expect(consoleSpy).toHaveBeenCalledWith()

  consoleSpy.mockRestore()
})

test('info should handle multiple arguments of different types', () => {
  const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

  const args = ['string', 42, true, null, undefined, { obj: 'test' }, [1, 2, 3]]
  info(...args)

  expect(consoleSpy).toHaveBeenCalledWith(...args)

  consoleSpy.mockRestore()
})

test('warn should handle multiple arguments of different types', () => {
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

  const args = ['warning', 0, false, '', { warning: 'test' }, []]
  warn(...args)

  expect(consoleSpy).toHaveBeenCalledWith(...args)

  consoleSpy.mockRestore()
})

test('error should handle multiple arguments of different types', () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  const args = ['error', -1, Number.NaN, Infinity, { error: 'test' }, new Error('test')]
  error(...args)

  expect(consoleSpy).toHaveBeenCalledWith(...args)

  consoleSpy.mockRestore()
})
