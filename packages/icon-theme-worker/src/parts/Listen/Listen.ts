import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { commandMapRef } from '../CommandMapRef/CommandMapRef.ts'
import { initializeCacheWorker } from '../InitializeCacheWorker/InitializeCacheWorker.ts'

export const listen = async (): Promise<void> => {
  Object.assign(commandMapRef, CommandMap.commandMap)
  await RendererWorker.initializeRendererWorkerForWorker(CommandMap.commandMap)
  await initializeCacheWorker()
}
