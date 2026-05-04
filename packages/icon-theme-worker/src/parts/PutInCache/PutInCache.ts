import type { ICache } from '../ICache/ICache.ts'
import { parseContentLength } from '../ParseContentLength/ParseContentLength.ts'

export const putInCache = async (url: string, response: Response, cache: ICache): Promise<void> => {
  const length = parseContentLength(response)
  const cachingResponse = new Response(response.body, {
    headers: {
      'Content-Length': `${length}`,
      'Content-Type': 'application/json',
    },
  })
  await cache.put(url, cachingResponse)
}
