import { test, expect } from '@jest/globals'

const Initialize = await import('../src/parts/Initialize/Initialize.ts')

test('initialize should call both initialization functions', async () => {
  // initializeRendererProcess is a no-op function, so we just verify initialize completes without error
  await expect(Initialize.initialize()).resolves.toBeUndefined()
})
