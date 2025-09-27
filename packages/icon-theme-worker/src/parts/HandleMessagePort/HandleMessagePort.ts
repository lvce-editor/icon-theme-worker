import { MessagePortRpcClient } from '@lvce-editor/rpc'

export const handleMessagePort = async (port: MessagePort): Promise<void> => {
  await MessagePortRpcClient.create({
    commandMap: {},
    messagePort: port,
  })
}
