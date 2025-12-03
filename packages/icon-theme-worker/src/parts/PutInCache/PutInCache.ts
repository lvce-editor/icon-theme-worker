import type { ICache } from '../ICache/ICache.ts'

export const putInCache = async (url: string, response: Response, cache: ICache): Promise<void> => {
  await cache.put(url, response)
}
