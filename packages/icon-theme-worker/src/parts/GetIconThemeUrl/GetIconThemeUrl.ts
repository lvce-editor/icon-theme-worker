export const getIconThemeUrl = (assetDir: string, iconThemeId: string): string => {
  return `${assetDir}/extensions/builtin.${iconThemeId}/icon-theme.json`
}
