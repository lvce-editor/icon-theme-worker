import type { IconTheme } from '../IconTheme/IconTheme.ts'
import type { LoadedIconTheme } from '../LoadedIconTheme/LoadedIconTheme.ts'
import * as InitialIconTheme from '../InitialIconTheme/InitialIconTheme.ts'

const state: {
  extensionBaseUrl: string
  extensionPath: string
  hasWarned: string[]
  iconTheme: IconTheme | undefined
  seenFiles: string[]
  seenFolders: string[]
} = {
  extensionBaseUrl: '',
  extensionPath: '',
  hasWarned: [],
  iconTheme: InitialIconTheme.initialIconTheme,
  seenFiles: [],
  seenFolders: [],
}

const hasHttpExtensionPath = (iconTheme: LoadedIconTheme): boolean => {
  return Boolean(iconTheme.extensionPath && (iconTheme.extensionPath.startsWith('http://') || iconTheme.extensionPath.startsWith('https://')))
}

export const setTheme = (iconTheme: LoadedIconTheme | undefined): void => {
  if (!iconTheme) {
    state.iconTheme = InitialIconTheme.initialIconTheme
    state.extensionPath = ''
    state.extensionBaseUrl = ''
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

export const getIconTheme = (): IconTheme | undefined => {
  return state.iconTheme
}
