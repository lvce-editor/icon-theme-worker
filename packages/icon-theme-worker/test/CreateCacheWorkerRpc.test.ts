import { expect, jest, test } from '@jest/globals'

const mockRendererWorker = {
  invokeAndTransfer: jest.fn(),
}

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  RendererWorker: mockRendererWorker,
}))

const { createCacheWorkerRpc } = await import('../src/parts/CreateCacheWorkerRpc/CreateCacheWorkerRpc.ts')

test('waits for the cache worker readiness message before making rpc calls', async () => {
  let cacheWorkerPort: MessagePort | undefined
  let resolveRpcRequest: (message: any) => void = () => {}
  const rpcRequestPromise = new Promise<any>((resolve) => {
    resolveRpcRequest = resolve
  })
  mockRendererWorker.invokeAndTransfer.mockImplementation(async (_command: unknown, port: unknown) => {
    const messagePort = port as MessagePort
    cacheWorkerPort = messagePort
    messagePort.addEventListener('message', (event: MessageEvent) => {
      resolveRpcRequest(event.data)
    })
    messagePort.start()
  })

  const rpc = await createCacheWorkerRpc()
  const resultPromise = rpc.invoke('Test.echo', 'value')
  expect(cacheWorkerPort).toBeDefined()
  const prematureRequest = await Promise.race([
    rpcRequestPromise,
    new Promise((resolve) => setTimeout(() => resolve(undefined), 50)),
  ])
  expect(prematureRequest).toBeUndefined()

  cacheWorkerPort!.postMessage('ready')
  const rpcRequest = await rpcRequestPromise
  expect(rpcRequest).toMatchObject({
    jsonrpc: '2.0',
    method: 'Test.echo',
    params: ['value'],
  })
  cacheWorkerPort!.postMessage({
    id: rpcRequest.id,
    jsonrpc: '2.0',
    result: 'value',
  })
  await expect(resultPromise).resolves.toBe('value')
  await rpc.dispose()
})
