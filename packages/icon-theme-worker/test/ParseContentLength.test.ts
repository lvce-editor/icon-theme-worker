import { expect, test } from '@jest/globals'
import * as ParseContentLength from '../src/parts/ParseContentLength/ParseContentLength.ts'

test('parseContentLength should parse content-length header', () => {
  const response = new Response(null, {
    headers: {
      'Content-Length': '42',
    },
  })

  expect(ParseContentLength.parseContentLength(response)).toBe(42)
})

test('parseContentLength should return 1 when content-length header is missing', () => {
  const response = new Response(null)

  expect(ParseContentLength.parseContentLength(response)).toBe(1)
})

test('parseContentLength should use integer parsing for content-length header', () => {
  const response = new Response(null, {
    headers: {
      'Content-Length': '42px',
    },
  })

  expect(ParseContentLength.parseContentLength(response)).toBe(42)
})
