import * as InitialIconTheme from '../InitialIconTheme/InitialIconTheme.ts'

export const state = {
  seenFiles: [],
  seenFolders: [],
  hasWarned: [],
  /**
   * @type{any}
   */
  iconTheme: InitialIconTheme.initialIconTheme,
  extensionPath: '',
}

export const setTheme = (iconTheme: any): void => {
  state.iconTheme = iconTheme.json
  state.extensionPath = iconTheme.extensionPath
}

export const getExtensionPath = (): string => {
  return state.extensionPath || ''
}

export const getIconTheme = (): any => {
  return state.iconTheme
}
