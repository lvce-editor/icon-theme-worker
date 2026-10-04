import { LazyTransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'

export const createCacheWorkerRpc = async (): Promise<Rpc> => {
  return LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    isMessagePortOpen: false,
    send: async (port: MessagePort): Promise<void> => {
      await RendererWorker.invokeAndTransfer('SendMessagePortToExtensionHostWorker.sendMessagePortToCacheWorker', port)
    },
  })
}
