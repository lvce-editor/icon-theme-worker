import type { Rpc } from '@lvce-editor/rpc'

type CacheWorkerCommandMap = Readonly<Record<string, (...args: readonly unknown[]) => unknown>>

export interface CacheStorageItem {
  readonly body: ArrayBuffer
  readonly headers: Readonly<Record<string, string>>
  readonly status: number
  readonly statusText: string
}

export type CacheStorageWriteResult =
  | { readonly success: true }
  | { readonly success: false; readonly errorCode: 'CACHE_STORAGE_WRITE_FAILED'; readonly errorMessage: string }

const state: { rpc: Readonly<Rpc> | undefined } = {
  rpc: undefined,
}

export const set = (cacheWorkerRpc: Rpc): void => {
  state.rpc = cacheWorkerRpc
}

export const invoke = <T>(command: string, ...args: readonly unknown[]): Promise<T> => {
  if (!state.rpc) {
    throw new Error('Cache worker RPC is not initialized')
  }
  return state.rpc.invoke(command, ...args) as Promise<T>
}

export const registerMockRpc = (commandMap: CacheWorkerCommandMap): { [Symbol.dispose]: () => void } => {
  const previousRpc = state.rpc
  state.rpc = {
    invoke: (command: string, ...args: readonly unknown[]): Promise<unknown> => {
      const handler = commandMap[command]
      if (!handler) {
        return Promise.reject(new Error(`Cache worker mock command not found: ${command}`))
      }
      return Promise.resolve(handler(...args))
    },
  } as Rpc
  return {
    [Symbol.dispose]: (): void => {
      state.rpc = previousRpc
    },
  }
}
