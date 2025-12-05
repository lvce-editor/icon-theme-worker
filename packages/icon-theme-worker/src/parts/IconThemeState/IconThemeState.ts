import type { LoadedIconTheme } from '../LoadedIconTheme/LoadedIconTheme.ts'
import * as InitialIconTheme from '../InitialIconTheme/InitialIconTheme.ts'

const state = {
  extensionBaseUrl: '',
  extensionPath: '',
  hasWarned: [],
  /**
   * @type{any}
   */
  iconTheme: InitialIconTheme.initialIconTheme,
  seenFiles: [],
  seenFolders: [],
}

const hasHttpExtensionPath = (iconTheme: any): boolean => {
  return iconTheme.extensionPath && (iconTheme.extensionPath.startsWith('http://') || iconTheme.extensionPath.startsWith('https://'))
}

export const setTheme = (iconTheme: LoadedIconTheme | undefined): void => {
  if (!iconTheme) {
    return
  }
  state.iconTheme = iconTheme.json
  state.extensionPath = iconTheme.extensionPath
  state.extensionBaseUrl = iconTheme.extensionRemoteUri || iconTheme.extensionBaseUrl
  if (!state.extensionBaseUrl && hasHttpExtensionPath(iconTheme)) {
    state.extensionBaseUrl = iconTheme.extensionPath
  }
}

export const getExtensionBaseUrl = (): string => {
  return state.extensionBaseUrl || ''
}

export const getIconTheme = (): any => {
  return state.iconTheme
}
