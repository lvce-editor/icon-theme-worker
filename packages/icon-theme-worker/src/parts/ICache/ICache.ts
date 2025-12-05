/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export interface ICache {
  readonly match: (request: RequestInfo | URL, options?: CacheQueryOptions) => Promise<Response | undefined>
  readonly put: (request: RequestInfo | URL, response: Response) => Promise<void>
}
