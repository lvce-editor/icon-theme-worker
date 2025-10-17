// TODO handle case when extension json or properties are invalid / unexpected
export const findMatchingIconThemeExtension = (extensions: readonly any[], iconThemeId: string): any => {
  for (const extension of extensions) {
    if (extension && extension.iconThemes) {
      for (const iconTheme of extension.iconThemes) {
        if (iconTheme.id === iconThemeId) {
          return {
            ...iconTheme,
            extensionPath: extension.path,
            extensionUri: extension.uri,
          }
        }
      }
    }
  }
  return undefined
}
