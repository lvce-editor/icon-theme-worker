import type { LoadedIconTheme } from '../LoadedIconTheme/LoadedIconTheme.ts'
import * as InitialIconTheme from '../InitialIconTheme/InitialIconTheme.ts'

const state = {
  seenFiles: [],
  seenFolders: [],
  hasWarned: [],
  /**
   * @type{any}
   */
  iconTheme: InitialIconTheme.initialIconTheme,
  extensionPath: '',
  extensionBaseUrl: '',
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

export const getExtensionPath = (): string => {
  return state.extensionPath || ''
}

export const getExtensionBaseUrl = (): string => {
  return state.extensionBaseUrl || ''
}

export const getIconTheme = (): any => {
  return state.iconTheme
}
