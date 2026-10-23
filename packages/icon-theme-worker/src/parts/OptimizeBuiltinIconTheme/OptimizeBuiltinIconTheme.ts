import type { IconTheme } from '../IconTheme/IconTheme.ts'

const vscodeIconsExtensionId = 'builtin.vscode-icons'
const vscodeIconsPathPrefix = '/icons/'
const optimizedPathPrefix = '/file-icons/'

const optimizeIconPath = (iconPath: string): string => {
  if (!iconPath.startsWith(vscodeIconsPathPrefix)) {
    return iconPath
  }
  return `${optimizedPathPrefix}${iconPath.slice(vscodeIconsPathPrefix.length)}`
}

export const optimizeBuiltinIconTheme = (iconTheme: IconTheme, extensionId: string): IconTheme => {
  if (extensionId !== vscodeIconsExtensionId || !iconTheme?.iconDefinitions) {
    return iconTheme
  }
  return {
    ...iconTheme,
    iconDefinitions: Object.fromEntries(
      Object.entries(iconTheme.iconDefinitions).map((entry: readonly [string, string]) => [entry[0], optimizeIconPath(entry[1])]),
    ),
  }
}
