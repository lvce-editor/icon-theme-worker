/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export interface ICache {
  readonly put: (request: RequestInfo | URL, response: Response) => Promise<void>
  readonly match: (request: RequestInfo | URL, options?: CacheQueryOptions) => Promise<Response | undefined>
}
