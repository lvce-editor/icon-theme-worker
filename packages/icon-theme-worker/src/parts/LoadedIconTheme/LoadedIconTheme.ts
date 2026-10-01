import type { IconTheme } from '../IconTheme/IconTheme.ts'

export interface LoadedIconTheme {
  readonly extensionBaseUrl: string
  readonly extensionPath: string
  readonly extensionRemoteUri: string
  readonly extensionUri: string
  readonly json: IconTheme
}
