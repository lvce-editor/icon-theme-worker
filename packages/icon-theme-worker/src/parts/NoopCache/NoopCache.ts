import type { ICache } from '../ICache/ICache.ts'

export const noopCache: ICache = {
  async match() {
    return undefined
  },
  async put() {},
}
