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

export const setTheme = (iconTheme: any): void => {
  state.iconTheme = iconTheme.json
  state.extensionPath = iconTheme.extensionPath
  state.extensionBaseUrl = iconTheme.extensionBaseUrl
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
