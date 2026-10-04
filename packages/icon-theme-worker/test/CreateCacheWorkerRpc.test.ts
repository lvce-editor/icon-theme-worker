import { expect, test } from '@jest/globals'
import { MessagePortRpcClient } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateCacheWorkerRpc from '../src/parts/CreateCacheWorkerRpc/CreateCacheWorkerRpc.ts'

test('waits for the cache worker readiness message before making rpc calls', async () => {
  const rendererRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToCacheWorker': async (port: Readonly<MessagePort>): Promise<void> => {
      await MessagePortRpcClient.create({
        commandMap: {
          'Test.echo': (value: string): string => value,
        },
        messagePort: port as MessagePort,
      })
    },
  })

  try {
    const rpc = await CreateCacheWorkerRpc.createCacheWorkerRpc()
    await expect(rpc.invoke('Test.echo', 'value')).resolves.toBe('value')
    await rpc.dispose()
  } finally {
    rendererRpc[Symbol.dispose]()
  }
})
