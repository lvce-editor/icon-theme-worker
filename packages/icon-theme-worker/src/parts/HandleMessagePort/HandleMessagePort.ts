import { MessagePortRpcClient } from '@lvce-editor/rpc'
import { commandMapRef } from '../CommandMapRef/CommandMapRef.ts'

export const handleMessagePort = async (port: MessagePort): Promise<void> => {
  await MessagePortRpcClient.create({
    commandMap: commandMapRef,
    messagePort: port,
  })
}
