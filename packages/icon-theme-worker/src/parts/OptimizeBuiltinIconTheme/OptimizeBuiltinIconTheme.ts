const vscodeIconsExtensionId = 'builtin.vscode-icons'
const vscodeIconsPathPrefix = '/icons/'
const optimizedPathPrefix = '/file-icons/'

interface IconTheme {
  readonly iconDefinitions?: Readonly<Record<string, unknown>>
  readonly [key: string]: unknown
}

const optimizeIconPath = (iconPath: unknown): unknown => {
  if (typeof iconPath !== 'string' || !iconPath.startsWith(vscodeIconsPathPrefix)) {
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
      Object.entries(iconTheme.iconDefinitions).map((entry: readonly [string, unknown]) => [entry[0], optimizeIconPath(entry[1])]),
    ),
  }
}
