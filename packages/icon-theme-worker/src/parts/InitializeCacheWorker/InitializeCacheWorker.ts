import * as CacheWorker from '../CacheWorker/CacheWorker.ts'
import { createCacheWorkerRpc } from '../CreateCacheWorkerRpc/CreateCacheWorkerRpc.ts'

export const initializeCacheWorker = async (): Promise<void> => {
  const rpc = await createCacheWorkerRpc()
  CacheWorker.set(rpc)
}
