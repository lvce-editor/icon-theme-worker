import type { ICache } from '../ICache/ICache.ts'

const parseContentLength = (response: Response): number => {
  const raw = response.headers.get('Content-Length')
  if (raw) {
    return Number.parseInt(raw, 10)
  }
  return 1
}

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
