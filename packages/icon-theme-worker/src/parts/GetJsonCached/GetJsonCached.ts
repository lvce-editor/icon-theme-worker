import { getJson } from '../GetJson/GetJson.ts'

const cache = new Map<string, any>()

export const getJsonCached = async (url: string, useCache: boolean): Promise<any> => {
  if (!useCache) {
    return getJson(url)
  }

  try {
    const headResponse = await fetch(url, { method: 'HEAD' })
    if (!headResponse.ok) {
      return getJson(url)
    }

    const etag = headResponse.headers.get('etag')
    if (etag && cache.has(etag)) {
      return cache.get(etag)
    }

    const json = await getJson(url)
    if (etag) {
      cache.set(etag, json)
    }
    return json
  } catch {
    return getJson(url)
  }
}
