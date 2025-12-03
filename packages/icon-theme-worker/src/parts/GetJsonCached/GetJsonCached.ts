import { getJson } from '../GetJson/GetJson.ts'

export const getJsonCached = async (url: string, useCache: boolean): Promise<any> => {
  if (!useCache) {
    return getJson(url)
  }
  // TODO
  // 1. query cache
  // 2. if it doesn;t exist, fetch data
  // 3. add data to cache
  // 4. return data from cache
  return getJson(url)
}
